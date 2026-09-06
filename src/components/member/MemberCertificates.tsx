import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Award, 
  Search, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  Printer, 
  Download, 
  Sparkles, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const MemberCertificates: React.FC = () => {
  const { currentUser, currentMember, certificates, addToast } = useApp();

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const memberCerts = certificates.filter(c => c.memberId === currentMember.memberId);

  const categories = ['All', 'Leadership', 'Participation', 'Excellence', 'Volunteerism', 'Special Recognition'];

  const filteredCerts = memberCerts.filter(cert => {
    const matchesSearch = cert.eventOrActivityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || cert.certificateType === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-yellow-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/30 text-amber-200 border border-amber-400/30">
              Verified E-Credentials
            </span>
            <span className="text-xs text-amber-300">•</span>
            <span className="text-xs text-amber-300">{memberCerts.length} Official Awards</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-bold font-display text-white">
            Digital Certificates & Recognitions
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl">
            Official municipal e-certificates authenticated with digital cryptographic QR codes and municipal officer signatures.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-2xl border border-white/15 backdrop-blur-xs">
          <Award className="w-8 h-8 text-yellow-300 flex-shrink-0" />
          <div>
            <p className="text-lg font-black text-white font-display leading-tight">{memberCerts.length}</p>
            <p className="text-[10px] text-amber-200 uppercase font-semibold">Total Certificates</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title or cert #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No Certificates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {memberCerts.length === 0
              ? "Attend more PAGASA assemblies, volunteer drives, and leadership seminars to earn official verifiable certificates!"
              : "No certificates match your search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => {
            return (
              <div
                key={cert.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Visual Certificate Card Header */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100/70 p-6 border-b border-amber-200/60 relative">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-600 text-white shadow-xs">
                      {cert.certificateType}
                    </span>
                    <span className="font-mono text-[10px] text-amber-900 font-bold bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                      {cert.certificateNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/30 flex-shrink-0">
                      <Award className="w-6 h-6 text-yellow-200" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                        CERTIFICATE OF {cert.certificateType.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-amber-700">
                        {cert.organization || 'PAGASA Guimba Youth'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 font-display line-clamp-2">
                      {cert.eventOrActivityTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Issued: {cert.issueDate}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate">
                      <span className="font-semibold text-slate-700">Signatories: </span>
                      {cert.signatories.map(s => s.name).join(', ')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print Official Certificate</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
