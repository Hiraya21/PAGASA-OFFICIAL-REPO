import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Award,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  QrCode,
  HeartHandshake,
  BookOpen,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSlide {
  id: string;
  badge: string;
  badgeIcon: React.ElementType;
  badgeColor: string;
  tagline: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  description: string;
  bgImage: string;
  accentGradient: string;
  primaryBtnText: string;
  primaryBtnAction: 'events' | 'register' | 'projects' | 'activities' | 'gallery';
  secondaryBtnText: string;
  secondaryBtnAction: 'register' | 'events' | 'projects' | 'about' | 'verify';
  statsPill1: { icon: React.ElementType; label: string; sub: string };
  statsPill2: { icon: React.ElementType; label: string; sub: string };
}

export const HeroSection: React.FC = () => {
  const { 
    setCurrentPage, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    members, 
    events, 
    projects,
    activities 
  } = useApp();

  const slides: HeroSlide[] = [
    {
      id: 'slide-1',
      badge: 'Official Youth Portal • Guimba, Nueva Ecija',
      badgeIcon: MapPin,
      badgeColor: 'bg-blue-900/80 border-blue-700/60 text-sky-300',
      tagline: 'Municipal Youth Federation',
      titlePrefix: 'PAGASA GUIMBA',
      titleHighlight: 'YOUTH ORGANIZATION',
      titleSuffix: '',
      description: 'Empowering the youth across all 64 barangays through leadership summits, civic governance, and transformative community services. "Kabataan. Pagkakaisa. Pag-asa."',
      bgImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80',
      accentGradient: 'from-sky-400 via-blue-300 to-amber-300',
      primaryBtnText: 'Explore Events',
      primaryBtnAction: 'events',
      secondaryBtnText: 'Join the Organization',
      secondaryBtnAction: 'register',
      statsPill1: { icon: Users, label: `${members.length}+ Active Members`, sub: 'Across 64 Barangays' },
      statsPill2: { icon: Award, label: '92.4% Avg Attendance', sub: 'QR-Verified System' }
    },
    {
      id: 'slide-2',
      badge: 'Community Action & Grassroots Impact',
      badgeIcon: HeartHandshake,
      badgeColor: 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300',
      tagline: 'Civic Service & Volunteer Brigades',
      titlePrefix: 'COMMUNITY IMPACT',
      titleHighlight: '& YOUTH OUTREACH',
      titleSuffix: 'CARAVAN',
      description: 'Mobilizing youth volunteer brigades for educational mobile libraries, calamity relief drives, student scholarships, and healthcare assistance in rural Guimba.',
      bgImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1920&q=80',
      accentGradient: 'from-emerald-300 via-teal-200 to-amber-300',
      primaryBtnText: 'View Community Projects',
      primaryBtnAction: 'projects',
      secondaryBtnText: 'Sign Up as Volunteer',
      secondaryBtnAction: 'register',
      statsPill1: { icon: Layers, label: `${projects.length} Active Projects`, sub: 'Community & Literacy' },
      statsPill2: { icon: BookOpen, label: 'Project Dunong', sub: 'Mobile Learning Caravan' }
    },
    {
      id: 'slide-3',
      badge: 'Next-Gen Youth MIS Technology',
      badgeIcon: QrCode,
      badgeColor: 'bg-indigo-950/80 border-indigo-700/60 text-indigo-300',
      tagline: 'Modern Digital Governance',
      titlePrefix: 'SMART DIGITAL QR',
      titleHighlight: 'MIS ATTENDANCE',
      titleSuffix: '& CERTIFICATES',
      description: 'Streamlining organization operations with instant QR badge check-ins, automated attendance reports, and tamper-proof digital certificates for active participants.',
      bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
      accentGradient: 'from-indigo-300 via-purple-300 to-sky-300',
      primaryBtnText: 'Upcoming Assemblies',
      primaryBtnAction: 'events',
      secondaryBtnText: 'Member Portal Login',
      secondaryBtnAction: 'about',
      statsPill1: { icon: QrCode, label: 'Real-Time QR Engine', sub: 'Contactless Verification' },
      statsPill2: { icon: ShieldCheck, label: 'LGU Endorsed', sub: 'Certified Service Records' }
    },
    {
      id: 'slide-4',
      badge: 'Sports, Culture & Climate Stewardship',
      badgeIcon: Leaf,
      badgeColor: 'bg-teal-950/80 border-teal-700/60 text-teal-300',
      tagline: 'Wellness & Environmental Care',
      titlePrefix: 'SPORTS, NATURE',
      titleHighlight: '& YOUTH ADVOCACY',
      titleSuffix: '',
      description: 'Promoting drug-free healthy lifestyles through inter-barangay sports tournaments, tree planting caravans, river cleanups, and creative arts festivals.',
      bgImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80',
      accentGradient: 'from-teal-300 via-emerald-200 to-amber-200',
      primaryBtnText: 'Youth Activities',
      primaryBtnAction: 'activities',
      secondaryBtnText: 'View Photo Gallery',
      secondaryBtnAction: 'projects',
      statsPill1: { icon: Leaf, label: `${activities.length} Weekly Activities`, sub: 'Sports & Cleanups' },
      statsPill2: { icon: Sparkles, label: 'Guimba Green Brigade', sub: 'Eco Action Network' }
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPausedByUser, setIsPausedByUser] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay loop timer
  useEffect(() => {
    if (!isAutoPlaying || isPausedByUser) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPausedByUser, nextSlide]);

  const handleAction = (action: string) => {
    if (action === 'register') {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    } else if (action === 'events') {
      setCurrentPage('events');
    } else if (action === 'projects') {
      setCurrentPage('projects');
    } else if (action === 'activities') {
      setCurrentPage('activities');
    } else if (action === 'gallery') {
      setCurrentPage('gallery');
    } else if (action === 'about') {
      setCurrentPage('about');
    }
  };

  const currentSlide = slides[currentSlideIndex];
  const BadgeIcon = currentSlide.badgeIcon;
  const StatsIcon1 = currentSlide.statsPill1.icon;
  const StatsIcon2 = currentSlide.statsPill2.icon;

  return (
    <section 
      id="hero-carousel-section"
      className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center justify-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        if (!isPausedByUser) setIsAutoPlaying(true);
      }}
    >
      {/* Background Carousel Slides with cross-fade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentSlide.bgImage}
              alt={currentSlide.titlePrefix}
              className="w-full h-full object-cover object-center brightness-[0.35]"
            />
            {/* Cinematic dark gradient overlays for high text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Slide Typography & Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-content'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Badge Tag with Official Seal */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-400/30 bg-slate-900/90 text-xs font-semibold backdrop-blur-md shadow-lg shadow-sky-950/40">
                  <PagasaLogo size={24} showText={false} />
                  <span className="text-sky-300 font-bold tracking-wide">{currentSlide.badge}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-[56px] font-display font-black tracking-tight leading-[1.12]">
                  <span className="text-white block">{currentSlide.titlePrefix}</span>
                  <span className={`bg-gradient-to-r ${currentSlide.accentGradient} bg-clip-text text-transparent block mt-1`}>
                    {currentSlide.titleHighlight}
                  </span>
                  {currentSlide.titleSuffix && (
                    <span className="text-slate-200 block text-2xl sm:text-3xl md:text-4xl mt-1 font-extrabold">
                      {currentSlide.titleSuffix}
                    </span>
                  )}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                  {currentSlide.description}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                  <button
                    onClick={() => handleAction(currentSlide.primaryBtnAction)}
                    className="w-full xs:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentSlide.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAction(currentSlide.secondaryBtnAction)}
                    className="w-full xs:w-auto px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentSlide.secondaryBtnText}</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('projects')}
                    className="w-full xs:w-auto px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Projects</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>64 Barangays Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>QR-Enabled MIS Attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>LGU Accredited</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase & Structured Metrics */}
          <div className="lg:col-span-5 relative space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + '-card'}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl group"
              >
                {/* Showcase Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src={currentSlide.bgImage}
                    alt={currentSlide.titlePrefix}
                    className="w-full h-full object-cover brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Top-Left Category Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-sky-300 text-xs font-bold border border-slate-700/80 backdrop-blur-md shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      {currentSlide.tagline}
                    </span>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left space-y-1.5 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
                      {currentSlide.titlePrefix} {currentSlide.titleHighlight}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                      <span className="truncate">Official Programs & Summits • Guimba, Nueva Ecija</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Non-overlapping Metric Cards Grid (cleanly structured directly below image) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3 text-left">
                <div className="p-2.5 bg-sky-500/15 text-sky-400 rounded-xl flex-shrink-0 border border-sky-500/20">
                  <StatsIcon1 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{currentSlide.statsPill1.label}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{currentSlide.statsPill1.sub}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3 text-left">
                <div className="p-2.5 bg-emerald-500/15 text-emerald-400 rounded-xl flex-shrink-0 border border-emerald-500/20">
                  <StatsIcon2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{currentSlide.statsPill2.label}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">{currentSlide.statsPill2.sub}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Toolbar & Slide Indicators */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Slide Category Quick Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  currentSlideIndex === index
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="text-[10px] opacity-70">0{index + 1}</span>
                <span>{slide.tagline.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Arrow Controls, Progress Dots, & Play/Pause */}
          <div className="flex items-center gap-3">
            {/* Play / Pause Autoplay toggle */}
            <button
              onClick={() => {
                setIsPausedByUser(!isPausedByUser);
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause carousel' : 'Resume carousel'}
              aria-label="Toggle autoplay"
            >
              {isAutoPlaying && !isPausedByUser ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Previous Slide Arrow */}
            <button
              onClick={prevSlide}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'w-6 bg-blue-500 shadow-xs shadow-blue-500/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Slide Arrow */}
            <button
              onClick={nextSlide}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Next slide"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
