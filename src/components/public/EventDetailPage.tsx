import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles,
  Award,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventDetailPage: React.FC = () => {
  const { 
    events, 
    selectedEventId, 
    setCurrentPage, 
    currentUser, 
    currentRole, 
    registerForEvent, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    addToast 
  } = useApp();

  const [isGuestRegOpen, setIsGuestRegOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestBarangay, setGuestBarangay] = useState('Poblacion');
  const [guestContact, setGuestContact] = useState('');

  const event = events.find(e => e.id === selectedEventId) || events[0];

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Event not found.</p>
        <button onClick={() => setCurrentPage('events')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Events
        </button>
      </div>
    );
  }

  const isRegistered = currentUser?.registeredEventIds?.includes(event.id);
  const isFull = event.currentParticipants >= event.maxParticipants;

  const handleMemberRegister = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    const ok = registerForEvent(event.id, currentUser.name, currentUser.barangay || 'Poblacion', currentUser.memberId);
    if (ok) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (_) {}
    }
  };

  const handleGuestRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;

    registerForEvent(event.id, guestName, guestBarangay);
    setIsGuestRegOpen(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Event link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('events')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>

        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Event</span>
        </button>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative h-72 sm:h-96">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-blue-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
              {event.category}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs ${
              event.status === 'Upcoming' ? 'bg-emerald-500 text-white' :
              event.status === 'Ongoing' ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse' :
              'bg-slate-700 text-white'
            }`}>
              {event.status}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                {event.date} • {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Action / Registration Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Status</span>
              <span className="font-bold text-slate-900 text-sm">
                {event.currentParticipants} of {event.maxParticipants} slots filled
              </span>
            </div>
            <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, (event.currentParticipants / event.maxParticipants) * 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isRegistered ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold w-full sm:w-auto justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You are Registered for this Event</span>
              </div>
            ) : isFull ? (
              <div className="px-5 py-2.5 bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold">
                Registration Closed (Full Capacity)
              </div>
            ) : (
              <button
                onClick={currentUser ? handleMemberRegister : () => setIsGuestRegOpen(true)}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Register for Event</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">About this Event</h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Speakers / Resource Persons */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 font-display">Featured Resource Speakers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((spk, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{spk.role}</p>
                    <h3 className="font-bold text-slate-900 text-sm">{spk.name}</h3>
                    <p className="text-xs text-slate-500">{spk.affiliation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Breakdown */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 font-display">Program Schedule</h2>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold font-mono">
                      {item.time}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.activity}</h4>
                      <p className="text-xs text-slate-500">{item.speaker}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Logistics, QR Verification, Organizer */}
        <div className="space-y-6">
          {/* Organizer Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
              Event Organizing Committee
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                PG
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{event.organizer}</p>
                <p className="text-[11px] text-slate-500">PAGASA Guimba Secretariat</p>
              </div>
            </div>
          </div>

          {/* Certificate & Attendance Notice */}
          <div className="bg-blue-50/80 rounded-3xl p-6 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Award className="w-4 h-4 text-blue-700" />
              <span>Digital Certificate Available</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Attending this event grants you official attendance credits. A verified digital Certificate of Participation will be issued automatically to your Member Portal upon QR check-in.
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Reminders & Dress Code
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Please arrive at least 15 minutes before opening.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Present your Digital QR Pass at the secretariat desk.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Dress code: Smart Casual or Official PAGASA Org Shirt.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guest Registration Modal */}
      {isGuestRegOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display">Guest Event Registration</h3>
              <button onClick={() => setIsGuestRegOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              Register for <strong>{event.title}</strong> as a youth participant.
            </p>

            <form onSubmit={handleGuestRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="maria@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    value={guestBarangay}
                    onChange={(e) => setGuestBarangay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact No.</label>
                  <input
                    type="tel"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    placeholder="0917-000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors mt-2"
              >
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
