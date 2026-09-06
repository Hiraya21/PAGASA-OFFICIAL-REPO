import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, FolderGit2, Megaphone, Users, Award, X, ChevronRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    events,
    projects,
    announcements,
    activities,
    officials,
    members,
    currentRole,
    setCurrentPage,
    setSelectedEventId,
    setSelectedMemberId
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { events: [], projects: [], announcements: [], activities: [], officials: [], members: [] };

    const q = query.toLowerCase();

    return {
      events: events.filter(e => (e.title || '').toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q) || (e.location || e.venue || '').toLowerCase().includes(q)),
      projects: projects.filter(p => (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q) || (p.projectLeader || '').toLowerCase().includes(q)),
      announcements: announcements.filter(a => (a.title || '').toLowerCase().includes(q) || (a.content || '').toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q)),
      activities: activities.filter(act => (act.title || '').toLowerCase().includes(q) || (act.leader || '').toLowerCase().includes(q) || (act.description || '').toLowerCase().includes(q)),
      officials: officials.filter(o => (o.fullName || '').toLowerCase().includes(q) || (o.position || '').toLowerCase().includes(q) || (o.committee || '').toLowerCase().includes(q)),
      members: (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' || currentRole === 'EVENT_STAFF')
        ? members.filter(m => (m.fullName || '').toLowerCase().includes(q) || (m.memberId || '').toLowerCase().includes(q) || (m.barangay || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q))
        : []
    };
  }, [query, events, projects, announcements, activities, officials, members, currentRole]);

  if (!isGlobalSearchOpen) return null;

  const totalResults = 
    searchResults.events.length + 
    searchResults.projects.length + 
    searchResults.announcements.length + 
    searchResults.activities.length + 
    searchResults.officials.length + 
    searchResults.members.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, projects, announcements, officials, members..."
            autoFocus
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-base focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="text-xs px-2.5 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg font-medium transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600">Quick Global Search</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Type keywords like "Leadership", "Tree planting", "Juan", "Triala", or "Barangay"
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600">No matching results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try refining your search terms.</p>
            </div>
          ) : (
            <>
              {/* Events */}
              {searchResults.events.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5" /> Events ({searchResults.events.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.events.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          setSelectedEventId(e.id);
                          setCurrentPage('event-detail');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-blue-50/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{e.title}</p>
                          <p className="text-xs text-slate-500">{e.date} • {e.location}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members (Admin / Staff only) */}
              {searchResults.members.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                    <UserCheck className="w-3.5 h-3.5" /> Members ({searchResults.members.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.members.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          setCurrentPage('admin-members');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-emerald-50/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={m.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">{m.fullName}</p>
                            <p className="text-xs text-slate-500">{m.memberId} • Brgy. {m.barangay}</p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                          {m.membershipStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {searchResults.projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                    <FolderGit2 className="w-3.5 h-3.5" /> Community Projects ({searchResults.projects.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.projects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setCurrentPage('projects');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-indigo-50/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.category} • Lead: {p.projectLeader}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Announcements */}
              {searchResults.announcements.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                    <Megaphone className="w-3.5 h-3.5" /> Announcements ({searchResults.announcements.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.announcements.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setCurrentPage('announcements');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-amber-50/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800 group-hover:text-amber-800">{a.title}</p>
                          <p className="text-xs text-slate-500">{a.date} • {a.category}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Officials */}
              {searchResults.officials.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" /> Officials ({searchResults.officials.length})
                  </div>
                  <div className="space-y-1">
                    {searchResults.officials.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setCurrentPage('officials');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-3 rounded-xl hover:bg-slate-100 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img src={o.profilePicture} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">{o.fullName}</p>
                            <p className="text-xs text-slate-500">{o.position} • {o.committee}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Search municipal youth records</span>
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="hover:text-slate-800 font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
