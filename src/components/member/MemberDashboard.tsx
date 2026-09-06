import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  MapPin,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const MemberDashboard: React.FC = () => {
  const { 
    currentUser, 
    currentMember, 
    events, 
    attendanceRecords, 
    certificates, 
    setCurrentPage, 
    setSelectedEventId 
  } = useApp();

  const memberRecords = attendanceRecords.filter(r => r.memberId === currentMember.memberId);
  const memberCerts = certificates.filter(c => c.memberId === currentMember.memberId);
  const myRegisteredEvents = events.filter(e => currentMember.registeredEventIds?.includes(e.id));
  const upcomingRegistered = myRegisteredEvents.filter(e => e.status === 'Upcoming');

  const presentCount = memberRecords.filter(r => r.status === 'Present').length;
  const lateCount = memberRecords.filter(r => r.status === 'Late').length;
  const attendanceRate = memberRecords.length > 0 ? Math.round(((presentCount + lateCount * 0.8) / memberRecords.length) * 100) : 100;
  const civicHours = presentCount * 3 + lateCount * 2;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Member Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={currentMember.profilePicture}
            alt={currentMember.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-sky-200">
                {currentMember.memberId}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                {currentMember.membershipStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display mt-1 text-white">
              Mabuhay, {currentMember.fullName}!
            </h1>
            <p className="text-xs text-sky-200 flex items-center gap-2 mt-0.5">
              <span>Brgy. {currentMember.barangay}, Guimba</span>
              <span>•</span>
              <span>{currentMember.organizationPosition || 'Active Youth Member'}</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 relative z-10 self-stretch sm:self-auto">
          <button
            onClick={() => setCurrentPage('member-qr')}
            className="flex-1 sm:flex-initial px-5 py-3 bg-white text-blue-900 hover:bg-sky-50 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-blue-700" />
            <span>Show My QR Pass</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => setCurrentPage('member-events')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Registered Events</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-display">{myRegisteredEvents.length}</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[11px] text-slate-500">{upcomingRegistered.length} upcoming assemblies</p>
        </div>

        <div 
          onClick={() => setCurrentPage('member-attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-emerald-300 transition-colors cursor-pointer"
        >
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Attendance Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 font-display">{attendanceRate}%</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-slate-500">{presentCount} verified sessions attended</p>
        </div>

        <div 
          onClick={() => setCurrentPage('member-certificates')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-amber-300 transition-colors cursor-pointer"
        >
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Certificates Earned</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 font-display">{memberCerts.length}</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500">Official verified e-credentials</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Civic Service</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600 font-display">{civicHours} hrs</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-slate-500">{currentMember.committee || 'Youth Volunteer'}</p>
        </div>
      </div>

      {/* Main 2-Column Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Upcoming Registered Events & Activity History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Registered Events */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                My Registered Events ({myRegisteredEvents.length})
              </h3>
              <button
                onClick={() => setCurrentPage('member-events')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                View All Events →
              </button>
            </div>

            {myRegisteredEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-medium">You haven't registered for any events yet.</p>
                <button
                  onClick={() => setCurrentPage('member-events')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors inline-block cursor-pointer"
                >
                  Explore Open Events
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRegisteredEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEventId(evt.id);
                      setCurrentPage('member-events');
                    }}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img src={evt.bannerImage} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {evt.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5 truncate">{evt.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{evt.startDate} • {evt.startTime}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Attendance History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Recent Attendance Logs ({memberRecords.length})
              </h3>
              <button
                onClick={() => setCurrentPage('member-attendance')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Logbook History →
              </button>
            </div>

            {memberRecords.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No attendance logs recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {memberRecords.slice(0, 4).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-bold text-slate-900 truncate">{rec.sessionTitle}</p>
                      <p className="text-[11px] text-slate-500">{rec.timestamp} • Time: {rec.timeIn || 'Logged'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${
                      rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                      rec.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Digital QR Preview & Certificates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick QR Card Widget */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-sm text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
              PAGASA Dynamic QR Pass
            </span>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <QRCodeSVG value={`PAGASA:MEMBER:${currentMember.memberId}:${currentMember.fullName}`} size={140} />
            </div>
            <div>
              <p className="font-mono font-bold text-sm text-yellow-300">{currentMember.memberId}</p>
              <p className="text-xs font-semibold text-white mt-0.5">{currentMember.fullName}</p>
              <p className="text-[10px] text-slate-400 mt-1">Present to Event Staff for instant verified attendance</p>
            </div>
            <button
              onClick={() => setCurrentPage('member-qr')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Open Fullscreen ID Badge
            </button>
          </div>

          {/* Earned Certificates Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                Recent Certificates ({memberCerts.length})
              </h3>
              <button
                onClick={() => setCurrentPage('member-certificates')}
                className="text-xs font-bold text-amber-600 hover:text-amber-800 cursor-pointer"
              >
                View All →
              </button>
            </div>

            {memberCerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Attend events to earn official certificates.</p>
            ) : (
              <div className="space-y-2.5">
                {memberCerts.slice(0, 3).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Certificate of {cert.certificateType}
                      </span>
                      <p className="text-xs font-bold text-slate-900 mt-1 truncate">{cert.eventOrActivityTitle}</p>
                      <p className="text-[10px] text-slate-500">{cert.issueDate}</p>
                    </div>
                    <button
                      onClick={() => setCurrentPage('member-certificates')}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 flex-shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
