import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  FolderGit2, 
  Award, 
  QrCode, 
  Plus, 
  TrendingUp, 
  MapPin, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle,
  KeyRound,
  Send,
  Mail
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    members, 
    events, 
    attendanceRecords, 
    projects, 
    certificates, 
    auditLogs, 
    setCurrentPage, 
    setSelectedEventId 
  } = useApp();

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.membershipStatus === 'Active').length;
  const pendingMembers = members.filter(m => m.membershipStatus === 'Pending').length;
  const pendingCredentialsCount = members.filter(m => m.credentialStatus === 'PENDING_ASSIGNMENT' || !m.username).length;
  const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;

  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const avgAttendance = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 92;

  // Barangay distribution calculation
  const barangayCounts: Record<string, number> = {};
  members.forEach(m => {
    barangayCounts[m.barangay] = (barangayCounts[m.barangay] || 0) + 1;
  });
  const topBarangays = Object.entries(barangayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Mabuhay, {currentUser?.name || 'Administrator'} ({currentUser?.role || 'SUPER_ADMIN'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            PAGASA Guimba MIS Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time municipal youth management information system, attendance verification, and audit logs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage('admin-attendance')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Launch QR Scanner</span>
          </button>

          <button
            onClick={() => setCurrentPage('admin-events')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Pending Credential Actions Alert */}
      {pendingCredentialsCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <span>{pendingCredentialsCount} Youth Member{pendingCredentialsCount > 1 ? 's' : ''} Awaiting Credentials</span>
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                New member registration requests have been submitted. Assign usernames and passwords to dispatch portal access emails.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('admin-members')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs flex-shrink-0 cursor-pointer"
          >
            <span>Review & Assign Credentials</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Members */}
        <div 
          onClick={() => setCurrentPage('admin-members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Members</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-display">{totalMembers}</span>
            {pendingMembers > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                {pendingMembers} pending
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">{activeMembers} active youth verified</p>
        </div>

        {/* Card 2: Events */}
        <div 
          onClick={() => setCurrentPage('admin-events')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Events & Summits</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-display">{events.length}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              {upcomingEvents} upcoming
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Municipal youth gatherings</p>
        </div>

        {/* Card 3: Attendance Rate */}
        <div 
          onClick={() => setCurrentPage('admin-attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">QR Attendance Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 font-display">{avgAttendance}%</span>
            <span className="text-[10px] font-bold text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 inline mr-0.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">{presentCount} check-in logs recorded</p>
        </div>

        {/* Card 4: Projects */}
        <div 
          onClick={() => setCurrentPage('admin-projects')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Community Projects</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-display">{projects.length}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Grassroots initiatives</p>
        </div>

        {/* Card 5: Certificates */}
        <div 
          onClick={() => setCurrentPage('admin-certificates')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates Issued</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-display">{certificates.length}</span>
            <span className="text-[10px] font-bold text-amber-700">Verified</span>
          </div>
          <p className="text-[11px] text-slate-500">QR-verifiable credentials</p>
        </div>
      </div>

      {/* 2-Column Analytics and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Active Attendance Session & Demographic Insights */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Scanner Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Session Active</span>
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                Guimba Youth Leadership Summit 2026
              </h3>
              <p className="text-xs text-slate-300">
                Municipal Gymnasium • QR check-in terminal active
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('admin-attendance')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all self-stretch sm:self-auto justify-center cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Open Scanner Terminal</span>
            </button>
          </div>

          {/* Top Barangay Coverage Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Top Barangay Youth Distribution
              </h3>
              <span className="text-xs text-slate-400">64 Barangays covered</span>
            </div>

            <div className="space-y-3">
              {topBarangays.map(([brgy, count]) => {
                const pct = Math.round((count / totalMembers) * 100);
                return (
                  <div key={brgy} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">Brgy. {brgy}</span>
                      <span className="text-slate-500">{count} members ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(15, pct * 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Recent Audit Trail Feed */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 font-display">Recent System Activity</h3>
              </div>
              <button
                onClick={() => setCurrentPage('admin-audit')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Full Trail →
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="py-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  <p className="text-[10px] text-slate-400">By: {log.performedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
