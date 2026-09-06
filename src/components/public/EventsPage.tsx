import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Search, 
  MapPin, 
  Users, 
  Clock, 
  Filter, 
  LayoutGrid, 
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, setCurrentPage, setSelectedEventId, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  const categories = ['ALL', 'Leadership', 'Environmental', 'Sports', 'Education', 'Workshop', 'Community'];
  const statuses = ['ALL', 'Upcoming', 'Ongoing', 'Completed'];

  const filteredEvents = events.filter(e => {
    if (!e.isPublished) return false;
    const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesStat = selectedStatus === 'ALL' || e.status === selectedStatus;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Municipal Youth Events & Seminars
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Events Calendar & Registration
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Participate in capacity building summits, sports tournaments, and community caravans. Earn attendance hours and verified certificates.
        </p>
      </div>

      {/* Control Bar: Search, Filter, View Mode */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title, venue, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Card View</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  viewMode === 'calendar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Timeline View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories and Status Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 hidden sm:inline">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 hidden sm:inline">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedStatus === stat ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-bold text-slate-700">No matching events found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search keywords.</p>
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const percentFilled = Math.round((evt.currentParticipants / evt.maxParticipants) * 100);
              const isRegistered = currentUser?.registeredEventIds?.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={evt.bannerImage}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-blue-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      {evt.category}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs ${
                        evt.status === 'Upcoming' ? 'bg-emerald-500 text-white' :
                        evt.status === 'Ongoing' ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse' :
                        'bg-slate-700 text-white'
                      }`}>
                        {evt.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-slate-950/80 p-2 rounded-xl backdrop-blur-xs">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        {evt.currentParticipants}/{evt.maxParticipants} slots ({percentFilled}%)
                      </span>
                      {isRegistered && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <p className="flex items-center gap-2 font-medium">
                          <CalendarIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setCurrentPage('event-detail');
                        }}
                        className="text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                      >
                        Details & Agenda
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setCurrentPage('event-detail');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                          isRegistered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isRegistered ? 'View Pass' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Timeline View Mode */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Guimba Youth Events Timeline
          </h2>
          <div className="space-y-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  setSelectedEventId(evt.id);
                  setCurrentPage('event-detail');
                }}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl text-center min-w-[64px] sm:min-w-[70px] flex-shrink-0">
                    <span className="text-[10px] uppercase font-bold block">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black font-display block">
                      {new Date(evt.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                        {evt.category}
                      </span>
                      <span className="text-xs text-slate-500">{evt.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 break-words">{evt.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right text-xs hidden sm:block">
                    <span className="font-bold text-slate-800">{evt.currentParticipants} Registered</span>
                    <span className="text-slate-400 block text-[10px]">Max {evt.maxParticipants}</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
