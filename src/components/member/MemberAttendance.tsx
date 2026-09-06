import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  QrCode, 
  Search, 
  Filter, 
  Award, 
  ShieldCheck,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';

export const MemberAttendance: React.FC = () => {
  const { 
    currentUser, 
    currentMember, 
    attendanceRecords, 
    events, 
    setCurrentPage, 
    addToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const memberRecords = attendanceRecords.filter(r => r.memberId === currentMember.memberId);
  const presentCount = memberRecords.filter(r => r.status === 'Present').length;
  const lateCount = memberRecords.filter(r => r.status === 'Late').length;
  const excusedCount = memberRecords.filter(r => r.status === 'Excused').length;
  const absentCount = memberRecords.filter(r => r.status === 'Absent').length;

  const totalSessions = memberRecords.length;
  const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount * 0.8) / totalSessions) * 100) : 100;
  const estimatedHours = presentCount * 3 + lateCount * 2;

  const filteredRecords = memberRecords.filter(rec => {
    const event = events.find(e => e.id === rec.eventId);
    const eventTitle = event?.title || rec.sessionTitle || '';
    const matchesSearch = eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.remarks.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportAttendanceCSV = () => {
    if (memberRecords.length === 0) {
      addToast('No attendance records to export.', 'info');
      return;
    }
    const headers = ['Date', 'Event / Session', 'Status', 'Time In', 'Verified By', 'Remarks'];
    const rows = memberRecords.map(r => [
      r.timestamp,
      `"${r.sessionTitle.replace(/"/g, '""')}"`,
      r.status,
      r.timeIn || 'N/A',
      r.verifiedBy,
      `"${r.remarks.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAGASA_Attendance_${currentMember.memberId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Attendance logbook downloaded as CSV!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Attendance Record
            </span>
            <span className="text-xs text-sky-300">•</span>
            <span className="text-xs text-sky-300">{currentMember.memberId}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold font-display text-white">
            Attendance Logbook & Records
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
            Track your verified presence at official general assemblies, youth training workshops, and community outreach.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={exportAttendanceCSV}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCurrentPage('member-qr')}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Open QR Pass</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Attendance Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 font-display">{attendanceRate}%</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-500">Based on registered sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Present Sessions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600 font-display">{presentCount}</span>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[11px] text-slate-500">{lateCount} logged with late arrival</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Civic Service Hours</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600 font-display">{estimatedHours} hrs</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">Municipal youth contribution</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Excused Absences</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-700 font-display">{excusedCount}</span>
            <Info className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500">Official notice filed</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {['All', 'Present', 'Late', 'Excused', 'Absent'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search session or remarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-display">No Attendance Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No verified attendance logs match your current search and filter settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Event / Session Title</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verification Method</th>
                  <th className="px-6 py-4">Officer / Signee</th>
                  <th className="px-6 py-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  const isPresent = rec.status === 'Present';
                  const isLate = rec.status === 'Late';
                  const isExcused = rec.status === 'Excused';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs font-display">{rec.sessionTitle}</p>
                        <p className="text-[10px] text-slate-400 font-mono">REC #{rec.id}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{rec.timestamp}</p>
                        {rec.timeIn && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>In: {rec.timeIn}</span>
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          isLate ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          isExcused ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPresent ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> :
                           isLate ? <AlertTriangle className="w-3 h-3 text-amber-600" /> :
                           <Info className="w-3 h-3 text-blue-600" />}
                          <span>{rec.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 font-medium">
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>QR Scanner</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium">
                        {rec.verifiedBy}
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                        {rec.remarks || 'Standard verified entry'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Check-in Tip Card */}
      <div className="bg-blue-50/60 rounded-3xl p-6 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-blue-950 font-display">
              Fast Check-In at Municipal Assemblies
            </h4>
            <p className="text-xs text-blue-700/90 mt-0.5 max-w-xl">
              Always present your personal dynamic QR Pass to the designated Event Staff or Officers at the entrance desk to automatically record your verified timestamp.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('member-qr')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap self-stretch sm:self-auto cursor-pointer"
        >
          View QR Pass
        </button>
      </div>
    </div>
  );
};
