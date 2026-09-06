import React, { useState } from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  Calendar, 
  FolderGit2, 
  Megaphone, 
  Image as ImageIcon, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  History, 
  Settings, 
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    currentRole, 
    logoutUser, 
    effectiveTheme,
    toggleTheme,
    members
  } = useApp();

  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);

  const pendingMembersCount = members.filter(m => m.membershipStatus === 'Pending').length;

  const menuItems: { label: string; page: ActivePage; icon: any; badge?: string; badgeColor?: string }[] = [
    { label: 'MIS Dashboard', page: 'admin-dashboard', icon: LayoutDashboard },
    { 
      label: 'Member Directory', 
      page: 'admin-members', 
      icon: Users,
      badge: pendingMembersCount > 0 ? `${pendingMembersCount}` : undefined,
      badgeColor: 'bg-amber-500 text-amber-950 font-bold'
    },
    { label: 'Live QR Attendance', page: 'admin-attendance', icon: QrCode, badge: 'Live', badgeColor: 'bg-emerald-500 text-slate-950' },
    { label: 'Events & Assemblies', page: 'admin-events', icon: Calendar },
    { label: 'Community Projects', page: 'admin-projects', icon: FolderGit2 },
    { label: 'Announcements', page: 'admin-announcements', icon: Megaphone },
    { label: 'Media Gallery', page: 'admin-gallery', icon: ImageIcon },
    { label: 'Official Roster', page: 'admin-officials', icon: ShieldCheck },
    { label: 'Certificate System', page: 'admin-certificates', icon: Award },
    { label: 'Analytics & Reports', page: 'admin-reports', icon: BarChart3 },
    { label: 'Audit Trail Logs', page: 'admin-audit', icon: History },
    { label: 'System Settings', page: 'admin-settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-950 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 no-print">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <PagasaLogo size={42} showText={false} />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm tracking-tight font-display truncate">
                PAGASA MIS
              </h2>
              <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider block truncate">
                {currentRole === 'SUPER_ADMIN' ? 'Super Admin Portal' : 'Admin & Officer Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => setCurrentPage(item.page)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase animate-pulse flex-shrink-0 ${item.badgeColor || 'bg-emerald-500 text-slate-950'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 space-y-3 bg-slate-950/60">
          <div className="flex items-center justify-between px-2 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">Theme Mode</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-[10px] font-bold transition-colors cursor-pointer"
              title="Toggle Light / Dark Mode"
            >
              {effectiveTheme === 'dark' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-sky-300" />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('member-dashboard')}
            className="w-full py-2 px-3 bg-blue-950/80 hover:bg-blue-900/90 text-sky-200 border border-blue-800/60 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              <span className="truncate">Member Portal</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="truncate">Public Website</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </button>

          {/* Current Admin User Status & Avatar Modal Trigger */}
          <div className="flex items-center justify-between gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={() => setIsProfilePicModalOpen(true)}
              className="flex items-center gap-2 min-w-0 flex-1 p-1 -m-1 rounded-lg hover:bg-slate-900 transition-colors text-left group cursor-pointer"
              title="Click to change profile avatar"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser?.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover border border-slate-700 group-hover:border-sky-400 transition-colors"
                />
                <span className="absolute -bottom-1 -right-1 bg-slate-800 text-sky-400 rounded-full p-0.5 shadow-xs group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-white block truncate group-hover:text-sky-300 transition-colors">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">
                  Click to edit avatar
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={logoutUser}
              className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-950/40 transition-colors flex-shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        userType="admin"
        initialAvatar={currentUser?.avatar}
      />
    </div>
  );
};
