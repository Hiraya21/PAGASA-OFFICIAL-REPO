import React, { useState } from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  LayoutDashboard, 
  QrCode, 
  Calendar, 
  Clock, 
  Award, 
  User, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  Copy,
  Check,
  Camera
} from 'lucide-react';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    currentMember, 
    currentRole, 
    logoutUser, 
    switchRole,
    settings, 
    effectiveTheme, 
    toggleTheme,
    notifications,
    setIsGlobalSearchOpen,
    addToast
  } = useApp();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleCopyMemberId = () => {
    navigator.clipboard.writeText(currentMember.memberId);
    setCopiedId(true);
    addToast('Member ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const navItems: { label: string; page: ActivePage; icon: any; badge?: string }[] = [
    { label: 'Member Overview', page: 'member-dashboard', icon: LayoutDashboard },
    { label: 'Digital ID & QR Pass', page: 'member-qr', icon: QrCode, badge: 'Live ID' },
    { label: 'My Registered Events', page: 'member-events', icon: Calendar },
    { label: 'Attendance Logbook', page: 'member-attendance', icon: Clock },
    { label: 'Digital Certificates', page: 'member-certificates', icon: Award },
    { label: 'Profile & Settings', page: 'member-profile', icon: User },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'member-dashboard': return 'Member Dashboard';
      case 'member-qr': return 'Digital Member ID & QR Pass';
      case 'member-events': return 'My Events & Registrations';
      case 'member-attendance': return 'Attendance History & Sessions';
      case 'member-certificates': return 'My Digital Certificates';
      case 'member-profile': return 'My Profile & Account Preferences';
      default: return 'Youth Member Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <PagasaLogo size={32} showText={false} />
            </div>
            <div>
              <p className="font-display font-extrabold text-xs text-slate-900 leading-tight">PAGASA GUIMBA</p>
              <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Member Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('member-qr')}
            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            title="My QR Pass"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Toggle theme"
          >
            {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <img
            src={currentMember.profilePicture}
            alt={currentMember.fullName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Member Sidebar Navigation */}
      <aside className={`
        fixed lg:sticky top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out no-print
        ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <PagasaLogo size={42} showText={false} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 font-display tracking-tight">
                  {settings.acronym || 'PAGASA'} GUIMBA
                </h2>
                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-500" />
                  Youth Member Portal
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Identity Card Widget */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              <button
                type="button"
                onClick={() => setIsProfilePicModalOpen(true)}
                className="relative group flex-shrink-0 cursor-pointer text-left"
                title="Click to change profile avatar"
              >
                <img
                  src={currentMember.profilePicture}
                  alt={currentMember.fullName}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-white/20 shadow-xs group-hover:border-sky-400 transition-colors"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-sky-400 border border-slate-700 flex items-center justify-center shadow-xs group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate font-display">
                  {currentMember.fullName}
                </p>
                <p className="text-[10px] text-sky-200/80 truncate">
                  Brgy. {currentMember.barangay}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono text-[10px] text-sky-300 font-bold bg-white/10 px-2 py-0.5 rounded truncate">
                  {currentMember.memberId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyMemberId}
                  className="p-1 rounded hover:bg-white/15 text-slate-300 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                  title="Copy Member ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                {currentMember.membershipStatus}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Member Workspace
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/70">
          {/* Admin Switcher if role allows */}
          {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' || currentRole === 'EVENT_STAFF') && (
            <button
              onClick={() => {
                setCurrentPage('admin-dashboard');
                setIsMobileDrawerOpen(false);
              }}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-xs"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Switch to Admin MIS</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Return to Public Website */}
          <button
            onClick={() => {
              setCurrentPage('home');
              setIsMobileDrawerOpen(false);
            }}
            className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Theme & Logout */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Toggle Theme"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
              <span className="text-[11px] capitalize">{effectiveTheme} Mode</span>
            </button>

            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[11px]">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Member Portal Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-xs no-print">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => setCurrentPage('member-dashboard')}>Member Portal</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{getPageTitle()}</span>
            </div>
            <h1 className="text-lg font-bold font-display text-slate-900 leading-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Portal</span>
              <kbd className="text-[9px] bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-500">⌘K</kbd>
            </button>

            {/* Quick QR Pass Action */}
            <button
              onClick={() => setCurrentPage('member-qr')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentPage === 'member-qr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>My QR Pass</span>
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* Theme Quick Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Toggle theme mode"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="h-6 w-px bg-slate-200" />

            {/* Member Quick Profile Pill */}
            <button
              onClick={() => setCurrentPage('member-profile')}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors text-left"
            >
              <img
                src={currentMember.profilePicture}
                alt={currentMember.fullName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {currentMember.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </header>

        {/* Main View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        userType="member"
        memberId={currentMember.id}
        initialAvatar={currentMember.profilePicture}
      />
    </div>
  );
};
