import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  QrCode,
  Tag,
  AlertCircle
} from 'lucide-react';
import { EventItem } from '../../types';

export const MemberEvents: React.FC = () => {
  const { 
    currentUser, 
    currentMember, 
    events, 
    registrations, 
    registerForEvent, 
    cancelEventRegistration,
    setCurrentPage,
    setSelectedEventId,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'registered' | 'all'>('registered');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Youth Assembly', 'Training', 'Community Service', 'Sports', 'Cultural', 'Leadership'];

  // Check if registered
  const isRegistered = (eventId: string) => {
    return registrations.some(r => r.eventId === eventId && r.memberId === currentMember.memberId && r.status === 'Registered');
  };

  const handleRegister = (event: EventItem) => {
    const res = registerForEvent(event.id, {
      memberId: currentMember.memberId,
      name: currentMember.fullName,
      email: currentMember.email
    });
    if (!res.success) {
      addToast(res.message, 'error');
    }
  };

  const handleCancelRegistration = (eventId: string) => {
    cancelEventRegistration(eventId, currentMember.memberId);
    addToast('Registration cancelled.', 'info');
  };

  const filteredEvents = events.filter(e => {
    const matchesTab = activeTab === 'all' ? true : isRegistered(e.id);
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const myRegisteredCount = events.filter(e => isRegistered(e.id)).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-sky-200">
              Member Schedule
            </span>
            <span className="text-xs text-sky-200">•</span>
            <span className="text-xs text-sky-200">{myRegisteredCount} Registered Activities</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold font-display text-white">
            Youth Events & Assemblies
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
            Browse upcoming municipal youth gatherings, seminars, workshops, and volunteer drives in Guimba.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('member-qr')}
          className="px-5 py-2.5 bg-white text-blue-900 hover:bg-sky-50 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all self-stretch sm:self-auto justify-center cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-blue-700" />
          <span>My Check-in QR Pass</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'registered'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Registered Events ({myRegisteredCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore All Events ({events.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'registered'
              ? "You haven't registered for any events matching this filter. Switch to 'Explore All Events' to find open activities."
              : "No upcoming events match your search criteria."}
          </p>
          {activeTab === 'registered' && (
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 mt-2"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const registered = isRegistered(evt.id);
            const isFull = evt.currentParticipants >= evt.maxParticipants;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Event Image */}
                <div className="relative h-44 overflow-hidden group">
                  <img
                    src={evt.bannerImage || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/90 text-blue-900 shadow-xs">
                      {evt.category}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase text-white shadow-xs ${
                      evt.status === 'Upcoming' ? 'bg-blue-600' :
                      evt.status === 'Ongoing' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-600'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  {registered && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Registered</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-bold text-sky-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{evt.startTime}</span>
                    </p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-slate-900 font-display line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.currentParticipants} / {evt.maxParticipants} Attendees</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {Math.round((evt.currentParticipants / evt.maxParticipants) * 100)}% filled
                      </span>
                    </div>
                    {/* Capacity bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (evt.currentParticipants / evt.maxParticipants) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {registered ? (
                      <>
                        <button
                          onClick={() => setCurrentPage('member-qr')}
                          className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Check-in Pass</span>
                        </button>
                        <button
                          onClick={() => handleCancelRegistration(evt.id)}
                          className="py-2 px-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          title="Cancel RSVP"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRegister(evt)}
                        disabled={isFull}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isFull ? (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            <span>Event Capacity Full</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Register / RSVP for Event</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
