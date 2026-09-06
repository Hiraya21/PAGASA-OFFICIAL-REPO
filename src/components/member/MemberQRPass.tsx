import React from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { PagasaLogo } from '../common/PagasaLogo';
import { Shield, Printer, Download, ArrowLeft, CheckCircle2, QrCode, Sparkles, MapPin } from 'lucide-react';

export const MemberQRPass: React.FC = () => {
  const { currentUser, currentMember, setCurrentPage, settings, addToast } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('member-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `PAGASA_QR_${currentMember.memberId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      addToast('QR Code image downloaded successfully!', 'success');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => setCurrentPage('member-dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadQR}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Badge</span>
          </button>
        </div>
      </div>

      {/* ID Badge Container */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-center relative">
          
          {/* Card Header Top Graphic */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-sky-950 p-6 text-white relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PagasaLogo size={36} showText={false} />
              <span className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                {settings.orgName}
              </span>
            </div>
            <p className="text-[10px] text-sky-300 uppercase tracking-widest font-bold">
              OFFICIAL MUNICIPAL YOUTH ID PASS
            </p>
            <p className="text-[9px] text-slate-300 italic font-serif">
              Municipality of Guimba, Nueva Ecija
            </p>
          </div>

          {/* Photo & Main Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Avatar */}
            <div className="-mt-14 relative inline-block">
              <img
                src={currentMember.profilePicture}
                alt={currentMember.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl mx-auto"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]" title="Active Status">
                ✓
              </span>
            </div>

            {/* Member Info */}
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
                {currentMember.memberId}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {currentMember.fullName}
              </h2>
              <p className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Brgy. {currentMember.barangay}, Guimba</span>
              </p>
              <p className="text-xs text-blue-700 font-medium">{currentMember.organizationPosition}</p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl inline-block shadow-inner">
              <QRCodeSVG
                id="member-qr-svg"
                value={currentMember.qrCode}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <p className="font-medium text-slate-700">
                Present this QR Pass to event secretariat scanners for automatic check-in.
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Member Since {currentMember.dateJoined}</span>
                <span>Valid: 2025–2027</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Stripe */}
          <div className="bg-slate-950 py-2.5 px-4 text-center">
            <span className="text-[10px] font-mono text-sky-400 font-semibold uppercase tracking-wider">
              OFFICIALLY SEALED & VERIFIED BY SECRETARIAT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
