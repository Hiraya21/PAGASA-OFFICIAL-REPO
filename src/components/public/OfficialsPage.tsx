import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Official } from '../../types';
import { Shield, Mail, Phone, MapPin, Award, Search, Filter, MessageCircle } from 'lucide-react';

export const OfficialsPage: React.FC = () => {
  const { officials } = useApp();
  const [selectedCommittee, setSelectedCommittee] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOfficialModal, setActiveOfficialModal] = useState<Official | null>(null);

  const committees = ['ALL', ...Array.from(new Set(officials.map(o => o.committee)))];

  const filteredOfficials = officials.filter(o => {
    const matchesComm = selectedCommittee === 'ALL' || o.committee === selectedCommittee;
    const name = (o.fullName || (o as any).name || '').toLowerCase();
    const pos = (o.position || '').toLowerCase();
    const bgy = (o.barangay || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || pos.includes(q) || bgy.includes(q);
    return matchesComm && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Executive Directorate & Committees
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Organization Officials
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Meet the dedicated youth leaders and committee directors driving civic development for the Municipality of Guimba (Term 2025–2027).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, title, or barangay..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Committee Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {committees.map((comm) => (
            <button
              key={comm}
              onClick={() => setSelectedCommittee(comm)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCommittee === comm
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {comm === 'ALL' ? 'All Officers' : comm}
            </button>
          ))}
        </div>
      </div>

      {/* Officials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOfficials.map((off) => (
          <div
            key={off.id}
            onClick={() => setActiveOfficialModal(off)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col group"
          >
            <div className="relative h-60 overflow-hidden bg-slate-100">
              <img
                src={off.profilePicture}
                alt={off.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Term {off.term}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 text-white">
                <span className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider block">
                  {off.committee}
                </span>
                <h3 className="font-bold text-base leading-tight font-display">{off.fullName}</h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-xs font-bold text-blue-700">{off.position}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Brgy. {off.barangay || 'Poblacion'}, Guimba</span>
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                  "{off.bio}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>View Full Profile</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Detail Modal */}
      {activeOfficialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 relative">
            <div className="flex items-center gap-4">
              <img
                src={activeOfficialModal.profilePicture}
                alt=""
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{activeOfficialModal.fullName}</h3>
                <p className="text-xs font-bold text-blue-700">{activeOfficialModal.position}</p>
                <p className="text-xs text-slate-500">{activeOfficialModal.committee} • Term {activeOfficialModal.term}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-700 border border-slate-200">
              <p className="font-semibold text-slate-900">Leadership Biography & Mandate:</p>
              <p className="leading-relaxed">{activeOfficialModal.bio}</p>
              <div className="pt-2 border-t border-slate-200/80 space-y-1 text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Brgy. {activeOfficialModal.barangay || 'Poblacion'}, Guimba, Nueva Ecija</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeOfficialModal.contactEmail || activeOfficialModal.email || 'secretariat@pagasaguimba.org'}</span>
                </p>
                {activeOfficialModal.contactNumber && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeOfficialModal.contactNumber}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveOfficialModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
