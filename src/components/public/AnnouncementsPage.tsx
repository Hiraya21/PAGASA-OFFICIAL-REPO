import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { 
  Megaphone, 
  Search, 
  Calendar, 
  User, 
  Pin, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Share2 
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalAnn, setActiveModalAnn] = useState<Announcement | null>(null);

  const categories = ['ALL', 'Urgent Advisory', 'General Notice', 'Event Advisory', 'Project Update', 'Opportunities'];

  const filteredAnnouncements = announcements.filter(a => {
    if (!a.isPublished) return false;
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch = (a.title || '').toLowerCase().includes(q) ||
                          (a.content || '').toLowerCase().includes(q) ||
                          (a.author || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Official Municipal Bulletins
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Public Announcements & Advisories
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Stay informed on municipal youth policies, event advisories, scholarship deadlines, and disaster response bulletins.
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
            placeholder="Search bulletins and advisories..."
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
              {cat === 'ALL' ? 'All Bulletins' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setActiveModalAnn(ann)}
            className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all cursor-pointer hover:shadow-md flex flex-col sm:flex-row items-start justify-between gap-6 ${
              ann.isPinned ? 'border-amber-300 bg-amber-50/20 shadow-xs' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {ann.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    <Pin className="w-3 h-3 fill-current" /> Pinned Bulletin
                  </span>
                )}
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  ann.category === 'Urgent Advisory' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {ann.date}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-snug">
                {ann.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {ann.summary || ann.content}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Issued by: <strong className="text-slate-800">{ann.author}</strong> ({ann.authorRole})</span>
              </div>
            </div>

            <button className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-center">
              Read Full Notice →
            </button>
          </div>
        ))}
      </div>

      {/* Full Modal */}
      {activeModalAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {activeModalAnn.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-2">
                  {activeModalAnn.title}
                </h3>
                <p className="text-xs text-slate-400">Published on {activeModalAnn.date}</p>
              </div>
              <button
                onClick={() => setActiveModalAnn(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {activeModalAnn.content}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-900">{activeModalAnn.author}</p>
                <p className="text-[11px] text-slate-500">{activeModalAnn.authorRole}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  addToast('Announcement link copied!', 'info');
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold flex items-center gap-1.5 hover:bg-slate-100"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
