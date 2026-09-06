import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../../context/AppContext';
import { AttendanceSheetModal } from '../common/AttendanceSheetModal';
import { 
  QrCode, 
  Camera, 
  CameraOff,
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Users, 
  Clock, 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  Sparkles, 
  RotateCcw,
  Volume2,
  VolumeX,
  Trash2,
  Upload,
  RefreshCw,
  HelpCircle,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminAttendance: React.FC = () => {
  const { 
    attendanceSessions, 
    attendanceRecords, 
    members, 
    scanAttendanceQR, 
    manualCheckIn, 
    deleteAttendanceRecord,
    addToast,
    confirmAction
  } = useApp();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(attendanceSessions[0]?.id || '');
  const [manualMemberQuery, setManualMemberQuery] = useState('');
  const [manualStatus, setManualStatus] = useState<'Present' | 'Late' | 'Excused'>('Present');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Scanner UI & Camera state
  const [scannedQRInput, setScannedQRInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);
  const isCameraActiveRef = useRef<boolean>(false);
  const lastScannedPayloadRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'duplicate' | 'invalid' | 'idle';
    message: string;
    member?: any;
    time?: string;
  }>({ status: 'idle', message: 'Terminal ready. Use Live Camera, upload QR badge, or enter Member ID.' });

  const activeSession = attendanceSessions.find(s => s.id === selectedSessionId) || attendanceSessions[0];
  const sessionRecords = attendanceRecords.filter(r => r.sessionId === activeSession?.id);

  const presentCount = sessionRecords.filter(r => r.status === 'Present').length;
  const lateCount = sessionRecords.filter(r => r.status === 'Late').length;
  const absentCount = sessionRecords.filter(r => r.status === 'Absent').length;

  const playFeedbackSound = (type: 'success' | 'duplicate' | 'error') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'duplicate') {
        osc.frequency.setValueAtTime(349.23, audioCtx.currentTime); // F4
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (_) {}
  };

  const handleProcessScan = (qrValue: string) => {
    if (!qrValue.trim() || !activeSession) return;

    const result = scanAttendanceQR(qrValue.trim(), activeSession.id);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (result.success && result.record) {
      playFeedbackSound('success');
      setScanResult({
        status: 'success',
        message: `Check-in successful! Welcome, ${result.record.memberName}.`,
        member: result.record,
        time: nowTime
      });
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      } catch (_) {}
    } else if (result.alreadyCheckedIn || result.isDuplicate) {
      playFeedbackSound('duplicate');
      setScanResult({
        status: 'duplicate',
        message: result.message || 'Notice: Already Checked In',
        time: nowTime
      });
    } else {
      playFeedbackSound('error');
      setScanResult({
        status: 'invalid',
        message: `Verification Failed: ${result.message}`,
        time: nowTime
      });
    }
    setScannedQRInput('');
  };

  // Camera Management
  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    isCameraActiveRef.current = false;
    setIsCameraActive(false);
  };

  const startCamera = async (deviceId?: string) => {
    try {
      setCameraError(null);
      stopCamera();

      const constraints: MediaStreamConstraints = {
        video: deviceId 
          ? { deviceId: { exact: deviceId } }
          : { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      isCameraActiveRef.current = true;
      setIsCameraActive(true);

      // Enumerate camera devices for switching
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (_) {}

      // Begin QR scanning loop
      scanFrame();
    } catch (err: any) {
      console.error('Camera initialization failed:', err);
      setCameraError(err.name === 'NotAllowedError' 
        ? 'Camera access permission denied in browser.'
        : err.message || 'Could not start camera video stream.');
      setIsCameraActive(false);
      isCameraActiveRef.current = false;
    }
  };

  const scanFrame = () => {
    if (!isCameraActiveRef.current) return;

    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      let canvas = canvasRef.current;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        try {
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data && code.data.trim()) {
            const rawPayload = code.data.trim();
            const now = Date.now();

            // Prevent spamming identical scans within 3 seconds
            if (rawPayload !== lastScannedPayloadRef.current || now - lastScannedTimeRef.current > 3000) {
              lastScannedPayloadRef.current = rawPayload;
              lastScannedTimeRef.current = now;
              handleProcessScan(rawPayload);
            }
          }
        } catch (_) {}
      }
    }

    if (isCameraActiveRef.current) {
      scanLoopRef.current = requestAnimationFrame(scanFrame);
    }
  };

  // Decode QR from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            handleProcessScan(code.data);
            addToast('Decoded QR badge from image!', 'success');
          } else {
            addToast('No valid QR code found in uploaded image.', 'error');
            setScanResult({
              status: 'invalid',
              message: 'No readable QR code found in image. Please use a clearer photo.',
              time: new Date().toLocaleTimeString()
            });
          }
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        addToast('Failed to load image file.', 'error');
        setIsProcessingFile(false);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualCheckInSubmit = (member: any) => {
    if (!activeSession) return;
    const ok = manualCheckIn(activeSession.id, member.memberId, manualStatus);
    if (ok) {
      playFeedbackSound('success');
      addToast(`Checked in ${member.fullName} (${manualStatus})`, 'success');
      setManualMemberQuery('');
    }
  };

  const filteredSearchMembers = manualMemberQuery.trim()
    ? members.filter(m => (m.fullName || '').toLowerCase().includes(manualMemberQuery.toLowerCase().trim()) || (m.memberId || '').toLowerCase().includes(manualMemberQuery.toLowerCase().trim()))
    : [];

  return (
    <div className="space-y-8">
      {/* Hidden file input for QR image processing */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header & Session Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Live QR Attendance Scanner
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant check-in terminal with camera optical reader, duplicate prevention, and municipal logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer shadow-xs"
            title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Session Switcher */}
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 shadow-xs focus:ring-2 focus:ring-blue-600"
          >
            {attendanceSessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.eventTitle} ({s.date})
              </option>
            ))}
          </select>

          {/* Print Attendance Sheet */}
          <button
            onClick={() => setIsSheetModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Attendance Sheet</span>
          </button>
        </div>
      </div>

      {/* Session Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Total Check-Ins</span>
          <p className="text-2xl font-bold font-display text-slate-900 mt-1">{sessionRecords.length}</p>
          <span className="text-[10px] text-slate-500">for {activeSession?.eventTitle || 'Current Session'}</span>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider">Present</span>
          <p className="text-2xl font-bold font-display text-emerald-900 mt-1">{presentCount}</p>
          <span className="text-[10px] text-emerald-700">Verified on-time</span>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider">Late</span>
          <p className="text-2xl font-bold font-display text-amber-900 mt-1">{lateCount}</p>
          <span className="text-[10px] text-amber-700">Admitted past schedule</span>
        </div>
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-blue-800 tracking-wider">Terminal Status</span>
          <p className="text-lg font-bold font-display text-blue-900 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {isCameraActive ? 'Camera Live' : 'Optical Standby'}
          </p>
          <span className="text-[10px] text-blue-700">PAGASA Guimba MIS</span>
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: Live Camera / Scanner Terminal */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5">
            
            {/* Terminal Top Bar & Camera Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  {isCameraActive ? 'Camera Scanner Live' : 'Scanner Terminal Standby'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Camera Toggle Button */}
                {!isCameraActive ? (
                  <button
                    onClick={() => startCamera(selectedCameraId)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Start Camera</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Stop Camera</span>
                  </button>
                )}

                {/* Upload QR Image */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Upload image containing QR code"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isProcessingFile ? 'Decoding...' : 'Upload Image'}</span>
                </button>
              </div>
            </div>

            {/* Camera Selector (if multiple available) */}
            {availableCameras.length > 1 && isCameraActive && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Camera:</span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => {
                    setSelectedCameraId(e.target.value);
                    startCamera(e.target.value);
                  }}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs"
                >
                  {availableCameras.map(cam => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || `Camera ${cam.deviceId.slice(0, 5)}...`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Camera Viewfinder Box */}
            <div className="relative h-64 sm:h-72 bg-slate-900 rounded-2xl border-2 border-dashed border-sky-500/50 flex flex-col items-center justify-center overflow-hidden">
              {/* Hidden rendering canvas for video frame inspection */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Real Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {isCameraActive ? (
                <>
                  {/* Viewfinder Target Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-44 sm:w-52 sm:h-52 border-2 border-sky-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                      {/* Corner Accents */}
                      <span className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
                      <span className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
                      <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />
                      
                      {/* Animated Laser Scanning Beam */}
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] top-1/2 animate-bounce opacity-90" />
                    </div>
                  </div>

                  {/* Scanning Prompt Badge */}
                  <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
                    <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-xs text-sky-300 text-[11px] font-semibold rounded-full border border-sky-500/30">
                      Align Member QR Badge inside frame
                    </span>
                  </div>
                </>
              ) : (
                /* Standby / Initial State Viewfinder */
                <div className="p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Present Member QR Code to Scanner</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Click <strong className="text-emerald-400">"Start Camera"</strong> to scan physically with your webcam, or use the manual input below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Activate Live Camera</span>
                  </button>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-x-4 bottom-4 p-3 bg-rose-950/90 border border-rose-700/80 rounded-xl text-rose-200 text-xs flex items-start gap-2 shadow-lg backdrop-blur-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Camera Access Notice:</p>
                    <p className="text-[11px] leading-relaxed">{cameraError}</p>
                    <p className="text-[10px] text-slate-300">
                      Tip: You can still scan using a handheld USB barcode scanner, upload a badge screenshot, or use manual search.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input / Hardware Scanner Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleProcessScan(scannedQRInput);
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scannedQRInput}
                  onChange={(e) => setScannedQRInput(e.target.value)}
                  placeholder="Scan QR with barcode gun or type Member ID (e.g. PAGASA-2026-0042)..."
                  autoFocus
                  className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono shadow-inner"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer flex-shrink-0"
                >
                  Check In
                </button>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Compatible with USB laser scanners, camera optical decoding, and direct ID entry.</span>
              </p>
            </form>

            {/* Quick 1-Click Simulation Buttons */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                ⚡ Rapid Test Simulator (1-Click Member Scan):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {members.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleProcessScan(m.qrCode || m.memberId)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold text-left truncate flex items-center gap-2 border border-slate-800 transition-colors cursor-pointer"
                  >
                    <img src={m.profilePicture} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                    <span className="truncate">{m.fullName.split(' ')[0]} ({m.memberId})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback Status Box */}
          <div className={`p-5 rounded-3xl border transition-all ${
            scanResult.status === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' :
            scanResult.status === 'duplicate' ? 'bg-amber-50 border-amber-300 text-amber-950' :
            scanResult.status === 'invalid' ? 'bg-rose-50 border-rose-300 text-rose-950' :
            'bg-white border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-start gap-3">
              {scanResult.status === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />}
              {scanResult.status === 'duplicate' && <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />}
              {scanResult.status === 'invalid' && <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />}
              {scanResult.status === 'idle' && <Clock className="w-6 h-6 text-slate-400 flex-shrink-0" />}

              <div className="space-y-1">
                <p className="font-bold text-sm">{scanResult.message}</p>
                {scanResult.time && (
                  <p className="text-[11px] opacity-75 font-mono">Timestamp: {scanResult.time}</p>
                )}
                {scanResult.member && (
                  <p className="text-xs font-semibold text-emerald-800">
                    Brgy. {scanResult.member.memberBarangay} • Status: {scanResult.member.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Live Session Log & Manual Check-in */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Manual Member Check-In Fallback */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Manual Member Search & Check-in
            </h3>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualMemberQuery}
                  onChange={(e) => setManualMemberQuery(e.target.value)}
                  placeholder="Search member name or ID..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <select
                value={manualStatus}
                onChange={(e) => setManualStatus(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Excused">Excused</option>
              </select>
            </div>

            {/* Quick manual match dropdown */}
            {filteredSearchMembers.length > 0 && (
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200 max-h-48 overflow-y-auto">
                {filteredSearchMembers.map((m) => (
                  <div key={m.id} className="py-2 px-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{m.fullName} ({m.memberId})</p>
                      <p className="text-[10px] text-slate-500">Brgy. {m.barangay}</p>
                    </div>
                    <button
                      onClick={() => handleManualCheckInSubmit(m)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Log Check-in
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Check-in Activity Stream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Session Check-In Stream ({sessionRecords.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Auto-synced</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {sessionRecords.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No attendees logged yet for this session.</p>
              ) : (
                sessionRecords.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{r.memberName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {r.memberId} • Brgy. {r.memberBarangay} • {r.checkInTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {r.status}
                        </span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">
                          {r.method === 'QR_SCAN' ? 'QR Code' : 'Manual'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          confirmAction({
                            title: 'Remove Attendance Record',
                            message: `Are you sure you want to remove the attendance log for ${r.memberName}?`,
                            confirmText: 'Delete Record',
                            cancelText: 'Cancel',
                            variant: 'danger',
                            itemDetails: {
                              label: 'Attendance Entry',
                              value: `${r.memberName} (${r.memberId})`,
                              subValue: `Checked in at ${r.checkInTime} • Status: ${r.status}`
                            },
                            onConfirm: () => {
                              deleteAttendanceRecord(r.id);
                              addToast(`Attendance record for ${r.memberName} deleted.`, 'info');
                            }
                          });
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Attendance Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Attendance Sheet Modal */}
      {isSheetModalOpen && (
        <AttendanceSheetModal
          isOpen={isSheetModalOpen}
          session={activeSession}
          records={attendanceRecords}
          onClose={() => setIsSheetModalOpen(false)}
        />
      )}
    </div>
  );
};
