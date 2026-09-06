import React from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceSession, AttendanceRecord } from '../../types';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2, Clock } from 'lucide-react';

interface AttendanceSheetModalProps {
  isOpen?: boolean;
  session: AttendanceSession | null;
  records: AttendanceRecord[];
  onClose: () => void;
}

export const AttendanceSheetModal: React.FC<AttendanceSheetModalProps> = ({ 
  isOpen = true,
  session, 
  records, 
  onClose 
}) => {
  const { settings } = useApp();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const sessionRecords = records.filter(r => r.sessionId === session.id);
  const presentCount = sessionRecords.filter(r => r.status === 'Present').length;
  const lateCount = sessionRecords.filter(r => r.status === 'Late').length;
  const absentCount = sessionRecords.filter(r => r.status === 'Absent').length;
  const excusedCount = sessionRecords.filter(r => r.status === 'Excused').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No.', 'Member ID', 'Full Name', 'Barangay', 'Time In', 'Status', 'Method', 'Remarks'];
    const rows = sessionRecords.map((r, index) => [
      index + 1,
      `"${r.memberId}"`,
      `"${r.memberName}"`,
      `"${r.memberBarangay}"`,
      `"${r.checkInTime}"`,
      `"${r.status}"`,
      `"${r.method}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${session.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${session.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Controls (Sticky Header - Hidden during print) */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 no-print flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">Official Municipal Attendance Sheet</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Export</span> CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Attendance Log"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document (Scrollable Area) */}
        <div className="p-4 sm:p-8 md:p-10 bg-white text-slate-900 space-y-6 overflow-y-auto flex-1">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-600 font-semibold">
              Republic of the Philippines • Province of Nueva Ecija • Municipality of Guimba
            </p>
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-blue-950 font-display mt-1">
              {settings.orgName}
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1 uppercase tracking-widest">
              OFFICIAL ACTIVITY ATTENDANCE LOG SHEET
            </p>
          </div>

          {/* Event Details Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Event / Activity:</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{session.eventTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Date & Time:</span>
              <span className="font-bold text-slate-900">{session.date} ({session.startTime} – {session.endTime})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Venue / Location:</span>
              <span className="font-bold text-slate-900">{session.location}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Session Status:</span>
              <span className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[10px] ${session.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'}`}>
                {session.isOpen ? 'Active / Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Statistical Breakdown Bar */}
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[9px] sm:text-[10px]">TOTAL REGISTERED</span>
              <span className="text-sm sm:text-base font-bold text-slate-900">{session.totalRegistered}</span>
            </div>
            <div className="p-2 border border-emerald-200 bg-emerald-50 rounded-lg">
              <span className="text-emerald-700 block text-[9px] sm:text-[10px]">PRESENT</span>
              <span className="text-sm sm:text-base font-bold text-emerald-800">{presentCount}</span>
            </div>
            <div className="p-2 border border-amber-200 bg-amber-50 rounded-lg">
              <span className="text-amber-700 block text-[9px] sm:text-[10px]">LATE</span>
              <span className="text-sm sm:text-base font-bold text-amber-800">{lateCount}</span>
            </div>
            <div className="p-2 border border-rose-200 bg-rose-50 rounded-lg">
              <span className="text-rose-700 block text-[9px] sm:text-[10px]">ABSENT</span>
              <span className="text-sm sm:text-base font-bold text-rose-800">{absentCount}</span>
            </div>
            <div className="col-span-2 xs:col-span-1 sm:col-span-1 p-2 border border-blue-200 bg-blue-50 rounded-lg">
              <span className="text-blue-700 block text-[9px] sm:text-[10px]">ATTENDANCE RATE</span>
              <span className="text-sm sm:text-base font-bold text-blue-900">{session.attendanceRate}%</span>
            </div>
          </div>

          {/* Records Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[640px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Member ID</th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3">Barangay</th>
                    <th className="py-2.5 px-3">Time In</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Remarks / Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sessionRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-slate-400">
                        No attendance records logged yet for this session.
                      </td>
                    </tr>
                  ) : (
                    sessionRecords.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center text-slate-500 font-medium">{i + 1}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-800">{r.memberId}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{r.memberName}</td>
                        <td className="py-2 px-3 text-slate-600">Brgy. {r.memberBarangay}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{r.checkInTime}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            r.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            r.status === 'Excused' ? 'bg-blue-100 text-blue-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[10px] text-slate-500">{r.method === 'QR_SCAN' ? 'QR Code' : 'Manual'}</td>
                        <td className="py-2 px-3 text-slate-500 italic">{r.remarks || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures for Attendance Certification */}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 text-xs">
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                CAMILLE JOY RAMOS
              </div>
              <p className="text-[11px] text-slate-600">Attendance Officer / Secretariat Head</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                GIAN CARLO MAGAT
              </div>
              <p className="text-[11px] text-slate-600">President, PAGASA Guimba Youth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
