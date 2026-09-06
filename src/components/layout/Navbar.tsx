import React, { useState } from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  Shield, 
  Search, 
  Bell, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  QrCode, 
  ChevronDown, 
  Sparkles,
  LayoutDashboard,
  Calendar,
  Layers,
  Award,
  Users,
  Megaphone,
  Image as ImageIcon,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentPage,
    setCurrentPage,
    setIsAuthModalOpen,
    setAuthModalMode,
    setIsGlobalSearchOpen,
    logoutUser,
    switchRole,
    notifications,
    settings,
    theme,
    effectiveTheme,
    toggleTheme
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const navLinks: { label: string; page: ActivePage; icon: any }[] = [
    { label: 'Home', page: 'home', icon: Sparkles },
    { label: 'About Us', page: 'about', icon: Users },
    { label: 'Officials', page: 'officials', icon: Shield },
    { label: 'Events', page: 'events', icon: Calendar },
    { label: 'Projects', page: 'projects', icon: Layers },
    { label: 'Activities', page: 'activities', icon: Award },
    { label: 'Announcements', page: 'announcements', icon: Megaphone },
    { label: 'Gallery', page: 'gallery', icon: ImageIcon }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      {/* Top Municipal Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-left">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-medium text-sky-400 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              Municipality of Guimba, Nueva Ecija
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400 whitespace-nowrap">
              Official Youth Organization Portal (PAGASA)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium hidden sm:flex">
            <span>Guimba Zip 3115</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 flex-shrink"
          >
            <div className="group-hover:scale-105 transition-transform flex-shrink-0">
              <PagasaLogo size={42} showText={false} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-black text-slate-950 text-sm sm:text-base md:text-lg tracking-tight group-hover:text-sky-600 transition-colors truncate">
                  PAGASA GUIMBA
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 rounded-full hidden xs:inline-block flex-shrink-0">
                  MIS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block truncate">
                Youth Organization • Inspire. Learn. Lead.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => setCurrentPage(link.page)}
                  className={`px-2.5 2xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setIsGlobalSearchOpen(true)}
              className="p-1.5 sm:p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-semibold transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              title="Search records"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden 2xl:inline">Search</span>
              <kbd className="hidden 2xl:inline-block text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white rounded-full text-[8px] sm:text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* Quick Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>

            {/* Authentication States */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white shadow-xs flex-shrink-0"
                  />
                  <div className="text-left hidden md:block min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[9px] font-semibold text-blue-700 uppercase tracking-wider truncate">
                      {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' :
                       currentUser.role === 'ADMIN' ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 z-40 py-2 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        {currentUser.memberId && (
                          <span className="inline-block mt-1 font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {currentUser.memberId}
                          </span>
                        )}
                      </div>

                      {/* Change Profile Avatar Option */}
                      <div className="px-2 py-1 border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfilePicModalOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                          <span>Change Profile Avatar</span>
                        </button>
                      </div>

                      {/* Role Specific Shortcuts */}
                      {currentRole === 'MEMBER' && (
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('member-dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span>Member Dashboard</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('member-qr');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>My QR Attendance Pass</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('member-profile');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <User className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <span>My Profile & Certificates</span>
                          </button>
                        </div>
                      )}

                      {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') && (
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('admin-dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span>Admin MIS Control Center</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('admin-attendance');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>Live Attendance Scanner</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentPage('admin-members');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Users className="w-4 h-4 text-slate-600 flex-shrink-0" />
                            <span>Member Directory</span>
                          </button>
                        </div>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            logoutUser();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 flex-shrink-0" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Sign in with authorized Gmail and assigned password"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Member Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('admin-login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-sky-300 transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                  title="Sign in with PAGASA_ADMIN master credentials"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Admin MIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hidden md:flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  <span>Join PAGASA</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 xl:hidden transition-colors cursor-pointer ml-0.5"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 py-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => {
                    setCurrentPage(link.page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                    isActive ? 'bg-blue-50 text-blue-700 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Member / Admin Access in Mobile */}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            {currentRole === 'MEMBER' ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('member-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold text-center cursor-pointer"
              >
                Go to Member Dashboard
              </button>
            ) : (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold text-center cursor-pointer"
              >
                Go to Admin MIS Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold text-center cursor-pointer"
                >
                  Portal Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold text-center cursor-pointer"
                >
                  Join Organization
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Profile Picture Modal for Current User */}
      <ChangeProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        userType={currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' ? 'admin' : 'member'}
        initialAvatar={currentUser?.avatar}
      />
    </header>
  );
};
