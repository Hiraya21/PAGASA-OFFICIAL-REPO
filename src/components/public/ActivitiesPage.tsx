import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityItem } from '../../types';
import { 
  Award, 
  Search, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { activities, setCurrentPage, setSelectedEventId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Skills Training', 'Environmental Caravan', 'Sports Clinic', 'Literacy Workshop', 'Youth Fellowship', 'Community Health'];

  const filteredActivities = activities.filter(act => {
    const matchesCat = selectedCategory === 'ALL' || act.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch = (act.title || '').toLowerCase().includes(q) ||
                          (act.description || '').toLowerCase().includes(q) ||
                          (act.leader || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Regular Programs & Workshops
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Youth Activities & Schedule
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Participate in regular skills sessions, clean-up drives, and barangay clinics organized weekly by PAGASA Guimba committees.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, workshops, topics..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Activities' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {act.category}
                </span>
                <span className="text-xs font-bold text-slate-400">{act.date}</span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                {act.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {act.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{act.time}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{act.location}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Leader: <strong className="text-slate-800">{act.leader}</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {act.attendeesCount} attended
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
