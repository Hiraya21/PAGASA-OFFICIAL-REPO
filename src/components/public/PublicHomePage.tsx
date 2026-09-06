import React from 'react';
import { useApp } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { HeroSection } from './HeroSection';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Megaphone, 
  FolderGit2, 
  Award, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Trophy, 
  Leaf, 
  HeartHandshake, 
  Activity, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  const { 
    events, 
    announcements, 
    projects, 
    activities, 
    officials, 
    gallery, 
    setCurrentPage, 
    setSelectedEventId,
    setIsAuthModalOpen,
    setAuthModalMode,
    settings 
  } = useApp();

  const whatWeDoCards = [
    {
      title: 'Youth Leadership',
      description: 'Nurturing ethical, civic-minded young leaders through summits, public governance workshops, and barangay representation.',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Community Service',
      description: 'Mobilizing youth for barangay relief drives, health missions, and vulnerable sector aid across Guimba.',
      icon: HeartHandshake,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Education & Literacy',
      description: 'Bridging learning gaps with Project Dunong mobile library, tutoring caravans, and scholarship guidance.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Sports & Recreation',
      description: 'Promoting healthy drug-free lifestyles via inter-barangay basketball, volleyball leagues, and wellness clinics.',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      title: 'Skills Development',
      description: 'Digital literacy, vocational TVET skills, creative design workshops, and modern freelance career preparation.',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Environmental Activities',
      description: 'Tree planting caravans, riverbank clean-ups, eco-brick drives, and waste segregation campaigns.',
      icon: Leaf,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Volunteerism',
      description: 'Organized volunteer brigades tracking hours, rewarding civic dedication with verified certificates.',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Social Development',
      description: 'Mental health advocacies, youth inclusion, arts & culture, and empowering out-of-school youth.',
      icon: Activity,
      color: 'bg-sky-50 text-sky-700 border-sky-200'
    }
  ];

  const upcomingEvents = events.filter(e => e.status === 'Upcoming' && e.isPublished).slice(0, 3);
  const latestAnnouncements = announcements.filter(a => a.isPublished).slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredActivities = activities.slice(0, 4);
  const featuredOfficials = officials.slice(0, 4);
  const featuredPhotos = gallery.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 2. Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* 3. Organization Introduction */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About Our Movement</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
                United for the Advancement of Guimba Youth
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                PAGASA Guimba Youth Organization is the premier youth federation established to unite, empower, and represent young Guimbeños across all 64 rural and urban barangays. We spearhead civic initiatives, leadership programs, community volunteer drives, and digital systems that transform youthful energy into sustainable municipal progress.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Democratically Organized Committees</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Digital Attendance & Certifications</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Inclusive Barangay Clusters</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-blue-950 via-slate-900 to-sky-950 text-white p-6 sm:p-7 rounded-2xl shadow-xl space-y-4 border border-sky-500/20 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <PagasaLogo size={56} showText={false} className="flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base text-yellow-300 font-display tracking-tight">Core Mission</h3>
                  <p className="text-[10px] text-sky-300 uppercase tracking-widest font-semibold">Inspire • Learn • Lead</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To equip Guimba's youth with leadership capabilities, moral integrity, practical skillsets, and meaningful civic opportunities, nurturing them as proactive architects of our town's future.
              </p>
              <button
                onClick={() => setCurrentPage('about')}
                className="text-xs font-bold text-sky-300 hover:text-white flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer w-full sm:w-auto pt-1"
              >
                <span>Read Full Vision & History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. What We Do */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Core Programs</span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              What We Do
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Comprehensive pillars designed to touch every facet of youth life and community development in Guimba.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whatWeDoCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Upcoming Events */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Youth Assemblies</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Upcoming Events
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Join our municipal summits, capacity building seminars, and community gatherings.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('events')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Events ({events.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={evt.bannerImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-blue-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    {evt.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/85 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>{evt.currentParticipants}/{evt.maxParticipants} slots</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    <div className="space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-slate-700">{evt.date} • {evt.time}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setCurrentPage('event-detail');
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEventId(evt.id);
                        setCurrentPage('event-detail');
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Latest Announcements */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Official Notices</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Latest Announcements
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Stay updated with the latest news, deadlines, and advisories from PAGASA Guimba.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('announcements')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>All Announcements ({announcements.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestAnnouncements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => setCurrentPage('announcements')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">{ann.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors line-clamp-2">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>By {ann.author} ({ann.authorRole})</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Current Projects */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Impact In Action</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Community Projects
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Sustainable civic initiatives spearheaded by youth volunteers across Guimba.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('projects')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((prj) => (
              <div
                key={prj.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <img
                  src={prj.image}
                  alt={prj.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {prj.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        prj.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {prj.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{prj.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{prj.description}</p>
                  </div>
                  <div className="text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
                    <span>Lead: <strong className="text-slate-700">{prj.projectLeader}</strong></span>
                    <span>{prj.participantsCount} volunteers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Youth Activities */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Weekly Schedule</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Youth Activities & Workshops
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Regular fellowship meetings, skills clinics, and barangay clean-up caravans.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('activities')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Activity Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {act.category}
                  </span>
                  <span className="text-slate-400 font-medium">{act.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{act.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{act.description}</p>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Organization Officials */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Executive Leadership</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Organization Officials
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Dedicated youth leaders serving the Municipality of Guimba for Term 2025–2027.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('officials')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Officials ({officials.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOfficials.map((off) => (
              <div
                key={off.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all text-center p-6 space-y-3"
              >
                <img
                  src={off.profilePicture}
                  alt={off.fullName}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-50 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display">{off.fullName}</h3>
                  <p className="text-xs font-semibold text-blue-700 mt-0.5">{off.position}</p>
                  <p className="text-[11px] text-slate-500">{off.committee}</p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  "{off.bio}"
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Photo Gallery */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Moments In Action</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Photo Gallery
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Snapshots from our community outreach, sports tournaments, and leadership summits.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('gallery')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setCurrentPage('gallery')}
                className="relative rounded-xl overflow-hidden h-32 group cursor-pointer border border-slate-200"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-[10px] text-white font-semibold line-clamp-2 leading-tight">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Call-to-Action */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-sky-900 text-white p-8 sm:p-14 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
              Youth Movement
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
              Be Part of the Youth Movement
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Are you a young resident of Guimba ready to make a tangible difference in your barangay? Join PAGASA Guimba today and unlock leadership opportunities, training workshops, and verified volunteer credentials.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-amber-400/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Join PAGASA Guimba
              </button>
              <button
                onClick={() => setCurrentPage('events')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-sm border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              >
                Browse Upcoming Events
              </button>
            </div>
          </div>
        </section>

        {/* 12. Contact Section */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Get In Touch</span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
              Contact Guimba Youth Secretariat
            </h2>
            <p className="text-slate-500 text-xs">
              Have questions, partnership proposals, or barangay youth inquiries? Reach out to us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Office Location</h3>
              <p className="text-xs text-slate-600">{settings.address}</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Email Address</h3>
              <p className="text-xs text-slate-600">{settings.email}</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Hotline & Mobile</h3>
              <p className="text-xs text-slate-600">{settings.phone}</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
