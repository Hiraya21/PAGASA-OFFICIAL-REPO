import React from 'react';
import { useApp } from '../../context/AppContext';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  Shield, 
  Target, 
  Compass, 
  Heart, 
  Award, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Flag,
  Globe
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage, setIsAuthModalOpen, setAuthModalMode, settings } = useApp();

  const coreValues = [
    { title: 'Patriotism & Civic Duty', desc: 'Deep love for Guimba and the Philippines, expressed through proactive community participation.', icon: Flag },
    { title: 'Integrity & Transparency', desc: 'Upholding honesty, ethical governance, and public accountability in all youth initiatives.', icon: Shield },
    { title: 'Inclusivity & Unity', desc: 'Providing equal voice and opportunity to youth from all 64 barangays, backgrounds, and walks of life.', icon: Users },
    { title: 'Excellence & Innovation', desc: 'Embracing modern technology, creative problem solving, and relentless pursuit of excellence.', icon: Sparkles },
    { title: 'Servant Leadership', desc: 'Leading with humility, placing the welfare and empowerment of our fellow Guimbeños first.', icon: Heart }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header Banner with Official Seal */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-2">
          <PagasaLogo size={96} showText={false} className="hover:scale-105 transition-transform" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
          Official Youth Federation • Guimba, Nueva Ecija
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Empowering Guimba's Youth
        </h1>
        <p className="text-sky-800 font-bold text-sm sm:text-base tracking-wide">
          "INSPIRE • LEARN • LEAD"
        </p>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The premier municipal youth federation of Guimba, Nueva Ecija, dedicated to nurturing visionary leaders, fostering community solidarity, and driving grassroots progress.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-yellow-300">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Our Vision</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            "A progressive, united, and empowered youth community in the Municipality of Guimba, where every young individual is equipped with leadership skills, moral values, and civic opportunities to actively shape a resilient and prosperous town."
          </p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            "To institutionalize dynamic programs in leadership, education, sports, environmental stewardship, and social welfare; bridging opportunities across all 64 barangays and fostering transparent, youth-led local governance."
          </p>
        </div>
      </div>

      {/* History & Organizational Background */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Our Journey & Roots</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          History of PAGASA Guimba
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            Founded in 2018 by an inspired group of student leaders, community volunteers, and Sangguniang Kabataan representatives, PAGASA Guimba was conceived out of a shared realization: that while Guimba boasts one of the largest and most dynamic youth populations in Nueva Ecija, there was a crucial need for an overarching, non-partisan management and development network to coordinate initiatives across its diverse 64 rural and town proper barangays.
          </p>
          <p>
            Over the years, the organization has spearheaded flagship initiatives including the annual <em>Guimba Youth Leadership Summit</em>, the <em>Project Dunong Mobile Library</em>, inter-barangay ecological tree-planting caravans, and emergency disaster relief drives. Today, PAGASA Guimba operates an integrated digital Management Information System (MIS) with QR attendance tracking, digital membership accreditation, and verified volunteer certificates.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Our Guiding Pillars</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Core Values & Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base font-display">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Coverage: 64 Barangays of Guimba */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
              <MapPin className="w-3.5 h-3.5" />
              <span>Municipal Geographic Scope</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-2">
              Serving All 64 Barangays of Guimba
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Organized into 4 strategic youth clusters to guarantee every barangay has active representation and support.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">64</span>
            <span className="text-xs text-slate-400 block font-medium">Barangays Covered</span>
          </div>
        </div>

        {/* Barangay Grid */}
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
            Official Municipal Barangay Roster:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 text-[11px] text-slate-300">
            {GUIMBA_BARANGAYS.map((brgy) => (
              <div key={brgy} className="p-1.5 bg-slate-900/60 hover:bg-blue-900/40 rounded border border-slate-800/80 text-center truncate hover:text-white transition-colors">
                {brgy}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Join */}
      <div className="text-center bg-blue-50 rounded-3xl p-8 sm:p-12 border border-blue-200 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          Want to represent your barangay in PAGASA Guimba?
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          We are constantly looking for energetic youth coordinators, committee volunteers, and event staff across Guimba.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          Submit Membership Application
        </button>
      </div>
    </div>
  );
};
