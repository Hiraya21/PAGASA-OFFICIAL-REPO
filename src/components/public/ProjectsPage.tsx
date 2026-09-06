import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project } from '../../types';
import { 
  FolderGit2, 
  Search, 
  Users, 
  Calendar, 
  Target, 
  HeartHandshake, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVolunteerModal, setActiveVolunteerModal] = useState<Project | null>(null);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');

  const categories = ['ALL', 'Education & Literacy', 'Environmental Stewardship', 'Civic Governance', 'Sports & Wellness', 'Disaster Resilience'];

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch = (p.title || '').toLowerCase().includes(q) ||
                          (p.description || '').toLowerCase().includes(q) ||
                          (p.projectLeader || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerEmail) return;
    addToast(`Thank you ${volunteerName}! You have signed up as volunteer for ${activeVolunteerModal?.title}.`, 'success');
    setActiveVolunteerModal(null);
    setVolunteerName('');
    setVolunteerEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Grassroots Civic Initiatives
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Community Projects & Programs
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Discover long-term youth-driven projects delivering tangible community impact, literacy, environmental care, and civic governance across Guimba.
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
            placeholder="Search project title, leader, or keyword..."
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
              {cat === 'ALL' ? 'All Initiatives' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
          >
            <div className="relative h-56 overflow-hidden bg-slate-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-indigo-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                {project.category}
              </div>
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  project.status === 'Ongoing' ? 'bg-emerald-500 text-white' :
                  project.status === 'Planning' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-white'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500 text-[11px]">Milestone Completion</span>
                    <span className="text-blue-700 font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables tags */}
                {project.deliverables && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {project.deliverables.slice(0, 2).map((del, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {del}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Lead: <strong className="text-slate-800">{project.projectLeader}</strong></span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {project.participantsCount} volunteers
                  </span>
                </div>

                <button
                  onClick={() => setActiveVolunteerModal(project)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Join this Project as Volunteer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Volunteer Modal */}
      {activeVolunteerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display">Volunteer Registration</h3>
              <button onClick={() => setActiveVolunteerModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-600">
              Sign up as a community volunteer for <strong>{activeVolunteerModal.title}</strong>.
            </p>

            <form onSubmit={handleVolunteerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={volunteerEmail}
                  onChange={(e) => setVolunteerEmail(e.target.value)}
                  placeholder="juan@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-800">
                You will be connected directly with project leader <strong>{activeVolunteerModal.projectLeader}</strong> for coordination.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm Volunteer Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
