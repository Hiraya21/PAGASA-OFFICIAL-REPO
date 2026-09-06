import React, { useEffect } from 'react';
import { AppProvider, useApp, ActivePage } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { Shield, Lock, UserCheck, LogIn, Sparkles, Home } from 'lucide-react';

// Public Pages
import { PublicHomePage } from './components/public/PublicHomePage';
import { AboutPage } from './components/public/AboutPage';
import { OfficialsPage } from './components/public/OfficialsPage';
import { EventsPage } from './components/public/EventsPage';
import { EventDetailPage } from './components/public/EventDetailPage';
import { ProjectsPage } from './components/public/ProjectsPage';
import { ActivitiesPage } from './components/public/ActivitiesPage';
import { AnnouncementsPage } from './components/public/AnnouncementsPage';
import { GalleryPage } from './components/public/GalleryPage';
import { JoinPage } from './components/public/JoinPage';

// Member Layout & Pages
import { MemberLayout } from './components/member/MemberLayout';
import { MemberDashboard } from './components/member/MemberDashboard';
import { MemberQRPass } from './components/member/MemberQRPass';
import { MemberEvents } from './components/member/MemberEvents';
import { MemberAttendance } from './components/member/MemberAttendance';
import { MemberCertificates } from './components/member/MemberCertificates';
import { MemberProfile } from './components/member/MemberProfile';

// Admin Layout & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMembers } from './components/admin/AdminMembers';
import { AdminAttendance } from './components/admin/AdminAttendance';
import { AdminEvents } from './components/admin/AdminEvents';
import { AdminProjects } from './components/admin/AdminProjects';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';
import { AdminGallery } from './components/admin/AdminGallery';
import { AdminOfficials } from './components/admin/AdminOfficials';
import { AdminCertificates } from './components/admin/AdminCertificates';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminSettings } from './components/admin/AdminSettings';

import { motion } from 'motion/react';

const PageRenderer: React.FC = () => {
  const { 
    currentUser,
    currentRole,
    currentPage, 
    setCurrentPage,
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen 
  } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const isAdminRoute = currentPage.startsWith('admin-');
  const isMemberRoute = currentPage.startsWith('member-');

  // 1. Admin Portal Layout & Pages (Protected: Super Admin & Admin only)
  if (isAdminRoute) {
    const isAuthorizedAdmin = (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') &&
      currentUser &&
      (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') &&
      (currentUser.email === 'admin@pagasaguimba.org' || currentUser.id === 'usr-admin-1');

    if (!isAuthorizedAdmin) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-700 shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  Admin MIS Portal
                </span>
                <h2 className="text-2xl font-display font-bold text-slate-900">Administrator Access Required</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access strictly restricted to administrator account. Credentials required: Username: <strong className="text-slate-900">PAGASA_ADMIN</strong>, Password: <strong className="text-slate-900">TayoAngPagasa2026</strong>.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('admin-login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In as Administrator</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('home')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  Return to Public Website
                </button>
              </div>
            </div>
          </main>
          <Footer />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
        </div>
      );
    }

    let adminContent = <AdminDashboard />;
    switch (currentPage) {
      case 'admin-dashboard':
        adminContent = <AdminDashboard />;
        break;
      case 'admin-members':
        adminContent = <AdminMembers />;
        break;
      case 'admin-attendance':
        adminContent = <AdminAttendance />;
        break;
      case 'admin-events':
        adminContent = <AdminEvents />;
        break;
      case 'admin-projects':
        adminContent = <AdminProjects />;
        break;
      case 'admin-announcements':
        adminContent = <AdminAnnouncements />;
        break;
      case 'admin-gallery':
        adminContent = <AdminGallery />;
        break;
      case 'admin-officials':
        adminContent = <AdminOfficials />;
        break;
      case 'admin-certificates':
        adminContent = <AdminCertificates />;
        break;
      case 'admin-reports':
        adminContent = <AdminReports />;
        break;
      case 'admin-audit':
        adminContent = <AdminAuditLogs />;
        break;
      case 'admin-settings':
        adminContent = <AdminSettings />;
        break;
      default:
        adminContent = <AdminDashboard />;
    }

    return (
      <AdminLayout>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {adminContent}
        </motion.div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
      </AdminLayout>
    );
  }

  // 2. Member Portal Layout & Pages (Protected: Registered Members or Admins)
  if (isMemberRoute) {
    if (!currentUser || (currentRole !== 'MEMBER' && currentRole !== 'SUPER_ADMIN' && currentRole !== 'ADMIN')) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
              <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-700 shadow-inner">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  Member Portal
                </span>
                <h2 className="text-2xl font-display font-bold text-slate-900">Member Sign In Required</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please log in with your registered PAGASA youth member account to view your digital QR pass, certificates, and attendance history.
                </p>
              </div>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Member Portal Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('join')}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Apply for Membership
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('home')}
                  className="w-full py-2 bg-transparent hover:bg-slate-100 text-slate-600 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                >
                  Return to Public Website
                </button>
              </div>
            </div>
          </main>
          <Footer />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
          <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
        </div>
      );
    }

    let memberContent = <MemberDashboard />;
    switch (currentPage) {
      case 'member-dashboard':
        memberContent = <MemberDashboard />;
        break;
      case 'member-qr':
        memberContent = <MemberQRPass />;
        break;
      case 'member-events':
        memberContent = <MemberEvents />;
        break;
      case 'member-attendance':
        memberContent = <MemberAttendance />;
        break;
      case 'member-certificates':
        memberContent = <MemberCertificates />;
        break;
      case 'member-profile':
        memberContent = <MemberProfile />;
        break;
      default:
        memberContent = <MemberDashboard />;
    }

    return (
      <MemberLayout>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {memberContent}
        </motion.div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
      </MemberLayout>
    );
  }

  // 3. Public Website Views
  let publicContent = <PublicHomePage />;

  switch (currentPage) {
    case 'home':
      publicContent = <PublicHomePage />;
      break;
    case 'about':
      publicContent = <AboutPage />;
      break;
    case 'officials':
      publicContent = <OfficialsPage />;
      break;
    case 'events':
      publicContent = <EventsPage />;
      break;
    case 'event-detail':
      publicContent = <EventDetailPage />;
      break;
    case 'projects':
      publicContent = <ProjectsPage />;
      break;
    case 'activities':
      publicContent = <ActivitiesPage />;
      break;
    case 'announcements':
      publicContent = <AnnouncementsPage />;
      break;
    case 'gallery':
      publicContent = <GalleryPage />;
      break;
    case 'join':
      publicContent = <JoinPage />;
      break;
    default:
      publicContent = <PublicHomePage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0 w-full min-w-0">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full min-w-0"
        >
          {publicContent}
        </motion.div>
      </main>

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <GlobalSearchModal isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PageRenderer />
      <ToastContainer />
    </AppProvider>
  );
}
