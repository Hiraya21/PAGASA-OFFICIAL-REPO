import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Calendar, 
  QrCode, 
  Bell, 
  User, 
  LayoutDashboard, 
  Users, 
  Layers, 
  FolderGit2, 
  Menu 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRole, currentPage, setCurrentPage, notifications, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  if (currentRole === 'MEMBER') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg no-print">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'home' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('events')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'events' || currentPage === 'event-detail' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => setCurrentPage('member-qr')}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-blue-700 to-sky-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
        >
          <QrCode className="w-6 h-6" />
          <span className="text-[9px] font-extrabold mt-0.5">My Pass</span>
        </button>

        <button
          onClick={() => setCurrentPage('member-dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold relative ${
            currentPage === 'member-dashboard' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadNotifs > 0 && (
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-rose-500" />
          )}
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentPage('member-profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'member-profile' ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    );
  }

  if (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg no-print">
        <button
          onClick={() => setCurrentPage('admin-dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'admin-dashboard' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentPage('admin-members')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'admin-members' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Members</span>
        </button>

        <button
          onClick={() => setCurrentPage('admin-attendance')}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-sky-500 to-blue-600 text-white p-3 rounded-full shadow-lg shadow-sky-500/30 active:scale-95 transition-transform"
        >
          <QrCode className="w-6 h-6" />
          <span className="text-[9px] font-extrabold mt-0.5">Scan QR</span>
        </button>

        <button
          onClick={() => setCurrentPage('admin-events')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'admin-events' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => setCurrentPage('admin-reports')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentPage === 'admin-reports' ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Reports</span>
        </button>
      </div>
    );
  }

  // Guest Mobile Navigation
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg no-print">
      <button
        onClick={() => setCurrentPage('home')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentPage === 'home' ? 'text-blue-700' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setCurrentPage('events')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentPage === 'events' ? 'text-blue-700' : 'text-slate-500'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Events</span>
      </button>

      <button
        onClick={() => {
          setAuthModalMode('register');
          setIsAuthModalOpen(true);
        }}
        className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-blue-700 to-sky-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
      >
        <User className="w-6 h-6" />
        <span className="text-[9px] font-extrabold mt-0.5">Join</span>
      </button>

      <button
        onClick={() => setCurrentPage('projects')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentPage === 'projects' ? 'text-blue-700' : 'text-slate-500'
        }`}
      >
        <FolderGit2 className="w-5 h-5" />
        <span>Projects</span>
      </button>

      <button
        onClick={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500"
      >
        <User className="w-5 h-5" />
        <span>Login</span>
      </button>
    </div>
  );
};
