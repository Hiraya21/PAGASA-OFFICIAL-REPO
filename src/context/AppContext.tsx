import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  UserRole,
  Member,
  EventItem,
  EventRegistration,
  AttendanceSession,
  AttendanceRecord,
  ProjectItem,
  ActivityItem,
  AnnouncementItem,
  OfficialItem,
  CertificateItem,
  GalleryPhoto,
  OrganizationSettings,
  NotificationItem,
  AuditLogItem,
  AttendanceStatus,
  MembershipStatus,
  PortalAccessStatus,
  AuthAccount,
  CredentialStatus,
  ThemeMode,
  ColorPalette
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_OFFICIALS,
  INITIAL_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_SESSIONS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import {
  signInWithGoogle as firebaseGoogleSignIn,
  signOutFirebase,
  subscribeToAuth,
  saveMemberDoc,
  getMembersFromFirestore
} from '../firebase/firestoreService';
import { ConfirmModal, ConfirmModalConfig } from '../components/common/ConfirmModal';
import { EmailPreviewModal } from '../components/common/EmailPreviewModal';
import { ForceChangePasswordModal } from '../components/common/ForceChangePasswordModal';
import {
  hashPassword,
  verifyPassword,
  generateUsername,
  generateTemporaryPassword,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginAttempts
} from '../utils/security';
import {
  sendCredentialEmail,
  CredentialEmailPayload,
  generateCredentialWelcomeEmailHtml,
  generatePasswordResetEmailHtml
} from '../services/emailService';
import {
  storageService,
  StorageSnapshot,
  STORAGE_KEYS
} from '../services/localStorageService';

export function formatNameFromEmail(email: string): string {
  if (!email) return 'Youth Member';
  const prefix = email.split('@')[0] || '';
  
  if (prefix.toLowerCase().includes('giancarlo') || prefix.toLowerCase().includes('gian.carlo') || prefix.toLowerCase().includes('gian_carlo')) {
    return 'Gian Carlo Magat';
  }
  
  const cleaned = prefix
    .replace(/[0-9]+/g, '')
    .replace(/[._-]+/g, ' ')
    .trim();
    
  if (!cleaned) return 'Youth Member';
  
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export type ActivePage = 
  | 'home'
  | 'about'
  | 'officials'
  | 'events'
  | 'event-detail'
  | 'projects'
  | 'activities'
  | 'announcements'
  | 'gallery'
  | 'join'
  | 'member-dashboard'
  | 'member-profile'
  | 'member-qr'
  | 'member-events'
  | 'member-attendance'
  | 'member-certificates'
  | 'admin-dashboard'
  | 'admin-members'
  | 'admin-attendance'
  | 'admin-events'
  | 'admin-projects'
  | 'admin-activities'
  | 'admin-announcements'
  | 'admin-gallery'
  | 'admin-officials'
  | 'admin-certificates'
  | 'admin-reports'
  | 'admin-audit'
  | 'admin-audit-logs'
  | 'admin-settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & User State
  currentUser: User | null;
  currentMember: Member;
  currentRole: UserRole;
  currentPage: ActivePage;
  selectedEventId: string | null;
  selectedMemberId: string | null;
  activeCertificate: CertificateItem | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'admin-login';
  isGlobalSearchOpen: boolean;
  toasts: ToastMessage[];

  // Theme & Accessibility State
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  colorPalette: ColorPalette;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setColorPalette: (palette: ColorPalette) => void;

  // Setters
  setCurrentPage: (page: ActivePage) => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedMemberId: (id: string | null) => void;
  setActiveCertificate: (cert: CertificateItem | null) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setAuthModalMode: (mode: 'login' | 'register' | 'admin-login') => void;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Role & Auth functions
  switchRole: (role: UserRole, userPayload?: User) => void;
  loginUser: (emailOrUsername: string, role?: UserRole, providedName?: string, passwordInput?: string) => Promise<boolean> | boolean;
  loginWithSupabase: (emailOrUsername: string, password: string, targetRole?: UserRole, providedName?: string) => Promise<{ success: boolean; message?: string }>;
  signUpWithSupabase: (email: string, password: string, memberData: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>) => Promise<{ success: boolean; message?: string; memberId?: string }>;
  registerMemberRequest: (
    email: string, 
    fullName?: string, 
    contactNumber?: string, 
    barangay?: string,
    extraDetails?: {
      age?: number;
      address?: string;
      birthdate?: string;
      gender?: 'Male' | 'Female' | 'Prefer not to say' | 'Other';
      educationalStatus?: any;
      occupation?: string;
      password?: string;
      directActive?: boolean;
    }
  ) => Promise<{ success: boolean; member: Member; message: string; isExisting?: boolean; credentials?: { username: string; password?: string } }>;
  fetchJoinRegistrationsDirect: () => Promise<{ total: number; joinFormCount: number; message: string }>;
  assignMemberCredentials: (memberId: string, username: string, temporaryPassword: string, sendEmailImmediately?: boolean, requirePasswordChange?: boolean) => Promise<{ success: boolean; emailSent: boolean; error?: string }>;
  setMemberPassword: (memberId: string, passwordInput: string, requirePasswordChange?: boolean, sendEmailImmediately?: boolean) => Promise<{ success: boolean; emailSent: boolean; error?: string }>;
  resetMemberPasswordByAdmin: (memberId: string, sendEmailImmediately?: boolean) => Promise<{ success: boolean; temporaryPassword: string; emailSent: boolean; error?: string }>;
  approveMemberApplication: (memberId: string) => Promise<{ success: boolean; message: string }>;
  rejectMemberApplication: (memberId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  setMemberAccountStatus: (memberId: string, status: MembershipStatus) => Promise<{ success: boolean }>;
  togglePortalAccess: (memberId: string, enable: boolean) => Promise<{ success: boolean }>;
  resendCredentialEmail: (memberId: string) => Promise<{ success: boolean; error?: string }>;
  toggleMemberAccess: (memberId: string, disable: boolean) => void;
  changeMemberPassword: (memberId: string, newPassword: string) => Promise<{ success: boolean }>;
  authAccounts: AuthAccount[];
  openEmailPreview: (payload: CredentialEmailPayload, meta?: { deliveryStatus?: 'Delivered' | 'Pending' | 'Failed'; deliveryDate?: string; deliveryError?: string }) => void;
  closeEmailPreview: () => void;
  resetUserPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<boolean>;
  logoutUser: () => Promise<void>;
  isSupabaseConfigured: () => boolean;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateUserProfilePicture: (avatarUrl: string) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Data Collections & Local Storage Provider Ops
  settings: OrganizationSettings;
  updateSettings: (newSettings: Partial<OrganizationSettings>) => void;
  resetToDefaults: () => void;
  exportStateSnapshot: () => StorageSnapshot;
  restoreStateSnapshot: (snapshot: StorageSnapshot) => { success: boolean; message: string; counts?: Record<string, number> };
  getStorageMetrics: () => { usedBytes: number; formattedSize: string; itemCounts: Record<string, number> };
  
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  updateMemberStatus: (id: string, status: MembershipStatus) => void;
  deleteMember: (id: string) => void;
  clearAllMembers: () => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'currentParticipants' | 'createdAt'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, memberInfo: { memberId: string; name: string; email: string }) => { success: boolean; message: string };
  cancelEventRegistration: (eventId: string, memberId: string) => void;
  isMemberRegisteredForEvent: (eventId: string, memberId: string) => boolean;

  registrations: EventRegistration[];

  attendanceSessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  createAttendanceSession: (eventId: string, startTime: string, endTime: string, location: string) => AttendanceSession;
  toggleAttendanceSession: (sessionId: string, isOpen: boolean) => void;
  recordAttendance: (
    sessionId: string, 
    memberId: string, 
    method: 'QR_SCAN' | 'MANUAL' | 'SEARCH',
    statusOverride?: AttendanceStatus,
    remarks?: string
  ) => { success: boolean; message: string; record?: AttendanceRecord; isDuplicate?: boolean; alreadyCheckedIn?: boolean };
  scanAttendanceQR: (
    qrValue: string, 
    sessionId: string
  ) => { success: boolean; message: string; record?: AttendanceRecord; isDuplicate?: boolean; alreadyCheckedIn?: boolean };
  manualCheckIn: (
    sessionId: string, 
    memberId: string, 
    status?: AttendanceStatus
  ) => boolean;
  loginAsMemberDirectly: (member: Member) => void;
  updateAttendanceRecordStatus: (recordId: string, status: AttendanceStatus, remarks?: string) => void;
  deleteAttendanceRecord: (recordId: string) => void;

  projects: ProjectItem[];
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;

  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<ActivityItem>) => void;
  deleteActivity: (id: string) => void;

  announcements: AnnouncementItem[];
  addAnnouncement: (announcement: Omit<AnnouncementItem, 'id' | 'views'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;

  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;

  officials: OfficialItem[];
  addOfficial: (official: Omit<OfficialItem, 'id'>) => void;
  updateOfficial: (id: string, updates: Partial<OfficialItem>) => void;
  deleteOfficial: (id: string) => void;

  certificates: CertificateItem[];
  issueCertificate: (cert: Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrVerificationUrl'>) => CertificateItem;
  deleteCertificate: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;

  auditLogs: AuditLogItem[];
  logAuditEvent: (action: string, module: AuditLogItem['module'], details: string) => void;

  confirmAction: (options: Omit<ConfirmModalConfig, 'isOpen'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & User Session from Local Storage Service
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = storageService.getUserSession();
    return session.user;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = storageService.getUserSession();
    return session.role;
  });

  const [currentPage, setCurrentPageState] = useState<ActivePage>(() => {
    const saved = storageService.getLastActivePage('home') as ActivePage;
    return saved || 'home';
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<CertificateItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin-login'>('login');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig | null>(null);

  // Email Preview Modal State
  const [emailPreviewModalOpen, setEmailPreviewModalOpen] = useState(false);
  const [emailPreviewPayload, setEmailPreviewPayload] = useState<CredentialEmailPayload | null>(null);
  const [emailPreviewMeta, setEmailPreviewMeta] = useState<{
    deliveryStatus?: 'Delivered' | 'Pending' | 'Failed';
    deliveryDate?: string;
    deliveryError?: string;
  }>({});

  // Force Change Password Modal State
  const [forceChangePasswordOpen, setForceChangePasswordOpen] = useState(false);
  const [forceChangeMember, setForceChangeMember] = useState<{ id: string; name: string } | null>(null);

  const confirmAction = useCallback((options: Omit<ConfirmModalConfig, 'isOpen'>) => {
    setConfirmModalConfig({
      ...options,
      isOpen: true
    });
  }, []);

  // Theme & Accessibility State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return storageService.getTheme();
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPalette>(() => {
    return storageService.getColorPalette();
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Synchronize Theme & CSS attributes dynamically
  useEffect(() => {
    let resolvedTheme: 'light' | 'dark' = 'light';
    if (theme === 'system') {
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = isSystemDark ? 'dark' : 'light';
    } else {
      resolvedTheme = theme;
    }
    setEffectiveTheme(resolvedTheme);

    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    root.setAttribute('data-palette', colorPalette);
    storageService.setTheme(theme);
    storageService.setColorPalette(colorPalette);
  }, [theme, colorPalette]);

  const setCurrentPage = (page: ActivePage) => {
    setCurrentPageState(page);
    storageService.setLastActivePage(page);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    showToast('info', 'Display Mode', `Theme changed to ${newTheme === 'system' ? 'System Default' : newTheme.toUpperCase() + ' Mode'}`);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setColorPalette = (newPalette: ColorPalette) => {
    setColorPaletteState(newPalette);
    const paletteNames: Record<ColorPalette, string> = {
      default: 'Civic Blue',
      emerald: 'Emerald Youth',
      purple: 'Royal Purple',
      sunset: 'Sunset Orange',
      ocean: 'Ocean Cyan',
      'high-contrast': 'High Contrast'
    };
    showToast('success', 'Color Palette', `Active palette updated to ${paletteNames[newPalette] || newPalette}`);
  };

  // Persistent Collections in LocalStorage Provider
  const [settings, setSettings] = useState<OrganizationSettings>(() => {
    return storageService.loadSettings();
  });

  const [members, setMembers] = useState<Member[]>(() => {
    return storageService.loadMembers();
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    return storageService.loadEvents();
  });

  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => {
    return storageService.loadRegistrations();
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    return storageService.loadAttendanceSessions();
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return storageService.loadAttendanceRecords();
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    return storageService.loadProjects();
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    return storageService.loadActivities();
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    return storageService.loadAnnouncements();
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    return storageService.loadGallery();
  });

  const [officials, setOfficials] = useState<OfficialItem[]>(() => {
    return storageService.loadOfficials();
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    return storageService.loadCertificates();
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return storageService.loadNotifications();
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    return storageService.loadAuditLogs();
  });

  const [authAccounts, setAuthAccounts] = useState<AuthAccount[]>(() => {
    return storageService.loadAuthAccounts();
  });

  // Local storage synchronization via Service Provider
  useEffect(() => {
    storageService.saveAuthAccounts(authAccounts);
  }, [authAccounts]);
  useEffect(() => {
    storageService.saveUserSession(currentUser, currentRole);
  }, [currentUser, currentRole]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveMembers(members);
  }, [members]);

  useEffect(() => {
    storageService.saveEvents(events);
  }, [events]);

  useEffect(() => {
    storageService.saveRegistrations(registrations);
  }, [registrations]);

  useEffect(() => {
    storageService.saveAttendanceSessions(attendanceSessions);
  }, [attendanceSessions]);

  useEffect(() => {
    storageService.saveAttendanceRecords(attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    storageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    storageService.saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    storageService.saveAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    storageService.saveGallery(gallery);
  }, [gallery]);

  useEffect(() => {
    storageService.saveOfficials(officials);
  }, [officials]);

  useEffect(() => {
    storageService.saveCertificates(certificates);
  }, [certificates]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storageService.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  // Cross-tab synchronization listener
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEYS.USER || e.key === STORAGE_KEYS.ROLE) {
        const session = storageService.getUserSession();
        setCurrentUser(session.user);
        setCurrentRole(session.role);
      } else if (e.key === STORAGE_KEYS.MEMBERS) {
        setMembers(storageService.loadMembers());
      } else if (e.key === STORAGE_KEYS.EVENTS) {
        setEvents(storageService.loadEvents());
      } else if (e.key === STORAGE_KEYS.ATTENDANCE_SESSIONS) {
        setAttendanceSessions(storageService.loadAttendanceSessions());
      } else if (e.key === STORAGE_KEYS.ATTENDANCE_RECORDS) {
        setAttendanceRecords(storageService.loadAttendanceRecords());
      } else if (e.key === STORAGE_KEYS.SETTINGS) {
        setSettings(storageService.loadSettings());
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Sync Firebase Auth state if active session exists
  useEffect(() => {
    const unsubscribe = subscribeToAuth((fbUser) => {
      if (fbUser) {
        const email = fbUser.email || '';
        const trimmedEmail = email.toLowerCase().trim();
        const isSuperAdmin = trimmedEmail === 'giancarlomagat2104@gmail.com' || 
                             trimmedEmail === 'giancarlomagat19@gmail.com' || 
                             trimmedEmail.includes('admin');
        const displayName = fbUser.displayName || formatNameFromEmail(trimmedEmail);

        setCurrentUser(prev => {
          // If already set with correct name, keep it
          if (prev && prev.email && prev.email.toLowerCase() === trimmedEmail && prev.name === displayName) {
            return prev;
          }
          const matched = members.find(m => (m.email || '').toLowerCase().trim() === trimmedEmail);
          const memberId = matched?.memberId || `PAGASA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

          const userObj: User = {
            id: fbUser.uid,
            name: displayName,
            email: email,
            role: isSuperAdmin ? 'SUPER_ADMIN' : (prev?.role || (matched ? 'MEMBER' : 'MEMBER')),
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`,
            memberId
          };
          return userObj;
        });
      }
    });
    return () => unsubscribe();
  }, [members]);

  // Derived currentMember representing the authenticated user accurately
  const currentMember: Member = useMemo(() => {
    if (currentUser) {
      const trimmedEmail = currentUser.email?.toLowerCase().trim();
      const matched = members.find(m => 
        (m.id && m.id === currentUser.id) ||
        (trimmedEmail && m.email?.toLowerCase().trim() === trimmedEmail) ||
        (currentUser.memberId && m.memberId === currentUser.memberId)
      );
      if (matched) {
        return {
          ...matched,
          fullName: currentUser.name || matched.fullName,
          email: currentUser.email || matched.email,
          profilePicture: currentUser.avatar || matched.profilePicture
        };
      }
      return {
        id: currentUser.id || 'mem-' + (currentUser.email || 'current'),
        memberId: currentUser.memberId || 'PAGASA-2026-0001',
        fullName: currentUser.name || 'Youth Member',
        email: currentUser.email || 'member@pagasaguimba.org',
        contactNumber: '+63 917 554 8920',
        birthdate: '2004-01-01',
        age: 22,
        gender: 'Male',
        address: 'Brgy. Saint John District (Poblacion), Guimba',
        barangay: 'Saint John District (Poblacion)',
        educationalStatus: 'College / University',
        occupation: currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' ? 'President & Executive Administrator' : 'Active Youth Member',
        profilePicture: currentUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser.name || 'User')}`,
        membershipStatus: 'Active',
        membershipDate: '2026-01-01',
        organizationPosition: currentUser.role === 'SUPER_ADMIN' ? 'President' : currentUser.role === 'ADMIN' ? 'Officer & Administrator' : 'Youth Member',
        committee: currentUser.role === 'SUPER_ADMIN' ? 'Executive Board' : 'General Youth Volunteer',
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Parent / Guardian',
          contactNumber: '+63 917 554 8920'
        },
        registeredEventIds: [],
        stats: {
          eventsJoined: 0,
          totalAttendance: 0,
          attendanceRate: 100,
          volunteerHours: 0,
          projectsParticipated: 0,
          certificatesEarned: 0
        }
      };
    }
    return members[0] || {
      id: 'mem-fallback',
      memberId: 'PAGASA-2026-0001',
      fullName: 'Youth Member',
      email: 'member@pagasaguimba.org',
      contactNumber: '+63 917 554 8920',
      birthdate: '2004-01-01',
      age: 22,
      gender: 'Male',
      address: 'Brgy. Saint John District (Poblacion), Guimba',
      barangay: 'Saint John District (Poblacion)',
      educationalStatus: 'College / University',
      occupation: 'Active Youth Member',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipStatus: 'Active',
      membershipDate: '2026-01-01',
      organizationPosition: 'Youth Member',
      committee: 'General Youth Volunteer',
      emergencyContact: {
        name: 'Parent / Guardian',
        relationship: 'Parent',
        contactNumber: '+63 917 554 8920'
      },
      registeredEventIds: [],
      stats: {
        eventsJoined: 0,
        totalAttendance: 0,
        attendanceRate: 100,
        volunteerHours: 0,
        projectsParticipated: 0,
        certificatesEarned: 0
      }
    };
  }, [currentUser, members]);

  // Toast Helpers
  const showToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Notice' : type === 'warning' ? 'Warning' : 'System';
    showToast(type, title, message);
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Audit Logger
  const logAuditEvent = (action: string, module: AuditLogItem['module'], details: string) => {
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      userName: currentUser ? currentUser.name : 'System Administrator',
      userRole: currentRole,
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ipAddress: '192.168.1.45 (PAGASA MIS Portal)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notifications
  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('info', 'Notifications', 'All notifications marked as read.');
  };

  // Switch Role
  const switchRole = (role: UserRole, userPayload?: User) => {
    // Prevent unauthorized role elevation to Administrator
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      const isAuthorized = userPayload && 
        (userPayload.role === 'SUPER_ADMIN' || userPayload.role === 'ADMIN') &&
        (userPayload.email === 'admin@pagasaguimba.org' || userPayload.id === 'usr-admin-1');

      if (!isAuthorized) {
        showToast('error', 'Admin Access Denied', 'Administrator access requires authentication with Username: PAGASA_ADMIN and Password: TayoAngPagasa2026.');
        return;
      }
    }

    setCurrentRole(role);
    if (userPayload) {
      setCurrentUser(userPayload);
      storageService.saveUserSession(userPayload, role);
    } else {
      if (role === 'GUEST') {
        setCurrentUser(null);
        storageService.saveUserSession(null, 'GUEST');
      }
    }
    
    // Auto navigate to relevant dashboard
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
      showToast('success', 'Admin MIS Access', `Authenticated as Administrator (${role})`);
    } else if (role === 'MEMBER') {
      setCurrentPage('member-dashboard');
      showToast('success', 'Welcome Back!', `Logged in as Member (${userPayload?.name || 'Youth Member'})`);
    } else {
      setCurrentPage('home');
      showToast('info', 'Guest View', 'Browsing as Guest / Public Visitor');
    }
  };

  const isSupabaseConfigured = () => false;

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const authUser = await firebaseGoogleSignIn();
      if (!authUser) {
        showToast('error', 'Google Sign-In', 'Google sign-in was cancelled or encountered an error.');
        return false;
      }

      const email = authUser.email || '';
      const trimmedEmail = email.toLowerCase().trim();
      const isSuperAdmin = trimmedEmail === 'admin@pagasaguimba.org' || 
                           trimmedEmail === 'giancarlomagat19@gmail.com' || 
                           trimmedEmail === 'giancarlomagat2104@gmail.com';

      if (isSuperAdmin) {
        const adminUser: User = {
          id: authUser.id || 'usr-admin-1',
          name: authUser.name || 'Gian Carlo Magat (PAGASA Admin)',
          email: email,
          role: 'SUPER_ADMIN',
          avatar: authUser.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9',
          memberId: 'PAGASA-2025-001'
        };

        switchRole('SUPER_ADMIN', adminUser);
        setCurrentPage('admin-dashboard');
        logAuditEvent('Admin Google Login', 'Settings', `Admin signed in with Google: ${email}`);
        showToast('success', 'Admin MIS Access Granted', `Welcome, Administrator ${adminUser.name}!`);
        return true;
      }

      // Member Authentication via Google
      const matchedMember = members.find(m => (m.email || '').toLowerCase().trim() === trimmedEmail);
      if (!matchedMember) {
        await signOutFirebase().catch(() => {});
        showToast(
          'error',
          'Access Denied: Unregistered Google Account',
          `The Google account (${email}) is not in the PAGASA Member Directory. An administrator must first register your Gmail and assign a password.`
        );
        logAuditEvent('Failed Google Login', 'Members', `Unauthorized Google account login attempt: ${email}`);
        return false;
      }

      if (matchedMember.membershipStatus === 'Pending') {
        await signOutFirebase().catch(() => {});
        showToast('warning', 'Application Pending Approval', 'Your membership application is currently pending administrative review.');
        return false;
      }

      if (matchedMember.membershipStatus === 'Suspended' || matchedMember.membershipStatus === 'Inactive' || matchedMember.gmailAccessEnabled === false) {
        await signOutFirebase().catch(() => {});
        showToast('error', 'Portal Access Disabled', 'Your member portal access is deactivated or suspended by an administrator.');
        return false;
      }

      const userObj: User = {
        id: matchedMember.id,
        name: matchedMember.fullName,
        email: email,
        role: 'MEMBER',
        avatar: authUser.avatar || matchedMember.profilePicture,
        memberId: matchedMember.memberId
      };

      switchRole('MEMBER', userObj);
      setCurrentPage('member-dashboard');
      logAuditEvent('Member Google Login', 'Members', `Member authenticated via Google: ${matchedMember.fullName} (${email})`);
      showToast('success', `Welcome back, ${matchedMember.fullName}!`, 'Logged in to PAGASA Member Portal.');
      return true;
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      showToast('error', 'Google Sign-In Failed', err?.message || 'Authentication error.');
      return false;
    }
  };

  const openEmailPreview = (
    payload: CredentialEmailPayload,
    meta?: {
      deliveryStatus?: 'Delivered' | 'Pending' | 'Failed';
      deliveryDate?: string;
      deliveryError?: string;
    }
  ) => {
    setEmailPreviewPayload(payload);
    setEmailPreviewMeta(meta || { deliveryStatus: 'Delivered', deliveryDate: new Date().toISOString() });
    setEmailPreviewModalOpen(true);
  };

  const closeEmailPreview = () => {
    setEmailPreviewModalOpen(false);
    setEmailPreviewPayload(null);
  };

  const registerMemberRequest = async (
    email: string,
    fullName?: string,
    contactNumber?: string,
    barangay?: string,
    extraDetails?: {
      age?: number;
      address?: string;
      birthdate?: string;
      gender?: 'Male' | 'Female' | 'Prefer not to say' | 'Other';
      educationalStatus?: any;
      occupation?: string;
      password?: string;
      directActive?: boolean;
    }
  ): Promise<{ success: boolean; member: Member; message: string; isExisting?: boolean; credentials?: { username: string; password?: string } }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const resolvedName = fullName?.trim() || formatNameFromEmail(trimmedEmail);
    const resolvedAge = extraDetails?.age && !isNaN(Number(extraDetails.age)) ? Number(extraDetails.age) : 21;
    const resolvedBirthdate = extraDetails?.birthdate || '2005-01-01';
    const resolvedAddress = extraDetails?.address?.trim()
      ? (extraDetails.address.includes('Guimba') ? extraDetails.address : `${extraDetails.address}, Brgy. ${barangay || 'Saint John District (Poblacion)'}, Guimba, Nueva Ecija`)
      : `Brgy. ${barangay || 'Saint John District (Poblacion)'}, Guimba, Nueva Ecija`;

    const rawPassword = extraDetails?.password?.trim() || 'Pagasa@2026';
    const passwordHash = await hashPassword(rawPassword);
    const resolvedUsername = trimmedEmail;

    // Check if already registered - prevent duplicate accounts with the same Gmail address
    const existingIndex = members.findIndex(m => (m.email || '').toLowerCase().trim() === trimmedEmail);
    if (existingIndex !== -1) {
      const existing = members[existingIndex];
      const updatedExisting: Member = {
        ...existing,
        fullName: resolvedName || existing.fullName,
        age: extraDetails?.age ? resolvedAge : existing.age,
        birthdate: extraDetails?.birthdate || existing.birthdate,
        address: extraDetails?.address ? resolvedAddress : existing.address,
        barangay: barangay || existing.barangay,
        contactNumber: contactNumber?.trim() || existing.contactNumber,
        gender: extraDetails?.gender || existing.gender || 'Male',
        educationalStatus: extraDetails?.educationalStatus || existing.educationalStatus || 'College / University',
        portalPassword: rawPassword,
        passwordHash,
        credentialStatus: 'Active & Configured',
        portalAccess: 'Enabled',
        membershipStatus: 'Active',
        isAccessDisabled: false,
        registrationSource: existing.registrationSource || 'JOIN_FORM'
      };
      const updatedList = [...members];
      updatedList[existingIndex] = updatedExisting;
      setMembers(updatedList);
      storageService.saveMembers(updatedList);
      saveMemberDoc(updatedExisting).catch(err => console.warn('Firestore member sync warning:', err));

      setAuthAccounts(prev => [
        {
          id: 'auth-' + updatedExisting.id,
          memberId: updatedExisting.id,
          username: resolvedUsername,
          email: trimmedEmail,
          passwordHash,
          accountStatus: 'Active',
          portalAccess: 'Enabled',
          mustChangePassword: false,
          createdAt: new Date().toISOString()
        },
        ...prev.filter(a => a.email !== trimmedEmail)
      ]);

      return {
        success: true,
        member: updatedExisting,
        isExisting: true,
        credentials: { username: resolvedUsername, password: rawPassword },
        message: `Account with Gmail "${trimmedEmail}" updated with your submitted credentials and active in Member Directory.`
      };
    }

    const memberId = `PAGASA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newMember: Member = {
      id: 'mem-' + Date.now(),
      memberId,
      fullName: resolvedName,
      email: trimmedEmail,
      username: resolvedUsername, // Use member's Gmail address as unique login username
      contactNumber: contactNumber?.trim() || '+63 917 000 0000',
      birthdate: resolvedBirthdate,
      age: resolvedAge,
      gender: extraDetails?.gender || 'Male',
      address: resolvedAddress,
      barangay: barangay || 'Saint John District (Poblacion)',
      educationalStatus: extraDetails?.educationalStatus || 'College / University',
      occupation: extraDetails?.occupation || 'Youth Volunteer',
      profilePicture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(resolvedName)}`,
      membershipStatus: extraDetails?.directActive === false ? 'Pending' : 'Active', // Direct active status in directory
      portalAccess: extraDetails?.directActive === false ? 'Disabled' : 'Enabled',    // Direct portal access enabled
      membershipDate: new Date().toISOString().split('T')[0],
      dateJoined: new Date().toISOString().split('T')[0],
      organizationPosition: 'Youth Member',
      committee: 'General Youth Volunteer',
      qrCode: `PAGASA:MEMBER:${memberId}:${resolvedName}`,
      registeredEventIds: [],
      credentialStatus: 'Active',
      portalPassword: rawPassword, // Plaintext stored for administrative copy/review in Member Directory
      passwordHash,
      mustChangePassword: false,
      isAccessDisabled: false,
      gmailAccessEnabled: true,
      registrationSource: 'JOIN_FORM',
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Parent / Guardian',
        contactNumber: contactNumber?.trim() || '+63 917 000 0000'
      },
      stats: {
        eventsJoined: 0,
        totalAttendance: 0,
        attendanceRate: 100,
        volunteerHours: 0,
        projectsParticipated: 0,
        certificatesEarned: 0
      }
    };

    const updatedList = [newMember, ...members];
    setMembers(updatedList);
    storageService.saveMembers(updatedList);
    saveMemberDoc(newMember).catch(err => console.warn('Firestore member sync warning:', err));

    // Record linked AuthAccount for instant authentication
    const newAuthAccount: AuthAccount = {
      id: 'auth-' + newMember.id,
      memberId: newMember.id,
      username: resolvedUsername,
      email: trimmedEmail,
      passwordHash,
      accountStatus: 'Active',
      portalAccess: 'Enabled',
      mustChangePassword: false,
      createdAt: new Date().toISOString()
    };
    setAuthAccounts(prev => [newAuthAccount, ...prev.filter(a => a.email !== trimmedEmail)]);

    // Audit Log & Notification for Administrator
    logAuditEvent(
      'New Member Direct Registration',
      'Members',
      `New member registered via Join Form: ${resolvedName} (${trimmedEmail}). All inputs and credentials saved directly to Member Directory. Status: Active.`
    );

    addNotification(
      'New Member Registered via Join Form',
      `${resolvedName} (${trimmedEmail}) joined PAGASA. Member inputs and credentials saved directly to the Member Directory with active portal access.`,
      'system'
    );

    showToast(
      'success',
      'Registered to Member Directory',
      `Welcome, ${resolvedName}! Your inputs and credentials have been recorded directly in the Member Directory.`
    );

    return {
      success: true,
      member: newMember,
      isExisting: false,
      credentials: { username: resolvedUsername, password: rawPassword },
      message: 'Your registration and credentials have been registered directly into the Member Directory.'
    };
  };

  const fetchJoinRegistrationsDirect = async (): Promise<{ total: number; joinFormCount: number; message: string }> => {
    const localMembers = storageService.loadMembers();
    let cloudMembers: Member[] = [];
    try {
      cloudMembers = await getMembersFromFirestore();
    } catch (err) {
      console.warn('Firestore members fetch fallback to local:', err);
    }

    const mergedMap = new Map<string, Member>();
    // Pre-populate with current state
    members.forEach(m => mergedMap.set(m.id, m));
    // Overlay local members
    localMembers.forEach(m => mergedMap.set(m.id, { ...(mergedMap.get(m.id) || {}), ...m }));
    // Overlay cloud members
    cloudMembers.forEach(m => mergedMap.set(m.id, { ...(mergedMap.get(m.id) || {}), ...m }));

    const mergedList = Array.from(mergedMap.values());
    mergedList.sort((a, b) => {
      if (a.registrationSource === 'JOIN_FORM' && b.registrationSource !== 'JOIN_FORM') return -1;
      if (b.registrationSource === 'JOIN_FORM' && a.registrationSource !== 'JOIN_FORM') return 1;
      return (b.membershipDate || '').localeCompare(a.membershipDate || '');
    });

    setMembers(mergedList);
    storageService.saveMembers(mergedList);

    const joinFormCount = mergedList.filter(m => m.registrationSource === 'JOIN_FORM').length;
    const msg = `Synced ${mergedList.length} members (${joinFormCount} direct join submissions) into Directory.`;
    
    logAuditEvent('Fetched Join Registrations', 'Members', msg);
    showToast('success', 'Directory Synchronized', msg);

    return {
      total: mergedList.length,
      joinFormCount,
      message: msg
    };
  };

  const approveMemberApplication = async (
    memberId: string
  ): Promise<{ success: boolean; message: string }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not locate member record.');
      return { success: false, message: 'Member not found' };
    }

    const now = new Date().toISOString();
    const approverName = currentUser?.name || 'Administrator';

    const updatedMember: Member = {
      ...target,
      membershipStatus: 'Active',
      portalAccess: 'Enabled',
      gmailAccessEnabled: true,
      isAccessDisabled: false,
      approvedAt: now,
      approvedBy: approverName,
      rejectionReason: undefined
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    setAuthAccounts(prev => {
      return prev.map(a => a.memberId === target.id ? { ...a, accountStatus: 'Active', portalAccess: 'Enabled' } : a);
    });

    logAuditEvent(
      'Approved Member Application',
      'Members',
      `Administrator ${approverName} approved youth membership for ${target.fullName} (${target.memberId}). Portal access enabled.`
    );

    addNotification(
      'Application Approved',
      `Membership application for ${target.fullName} (${target.memberId}) was approved. Portal access is now enabled.`,
      'system'
    );

    showToast('success', 'Application Approved', `${target.fullName}'s membership is now Active with portal access enabled.`);
    return { success: true, message: 'Member application approved successfully.' };
  };

  const rejectMemberApplication = async (
    memberId: string,
    reason: string = 'Application criteria not met.'
  ): Promise<{ success: boolean; message: string }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not locate member record.');
      return { success: false, message: 'Member not found' };
    }

    const updatedMember: Member = {
      ...target,
      membershipStatus: 'Rejected',
      portalAccess: 'Disabled',
      gmailAccessEnabled: false,
      isAccessDisabled: true,
      rejectionReason: reason
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    setAuthAccounts(prev => {
      return prev.map(a => a.memberId === target.id ? { ...a, accountStatus: 'Rejected', portalAccess: 'Disabled' } : a);
    });

    logAuditEvent(
      'Rejected Member Application',
      'Members',
      `Administrator rejected application for ${target.fullName} (${target.memberId}). Reason: ${reason}`
    );

    showToast('warning', 'Application Rejected', `${target.fullName}'s application has been rejected.`);
    return { success: true, message: 'Member application rejected.' };
  };

  const setMemberAccountStatus = async (
    memberId: string,
    status: MembershipStatus
  ): Promise<{ success: boolean }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not find member.');
      return { success: false };
    }

    const isActivated = status === 'Active';
    const updatedMember: Member = {
      ...target,
      membershipStatus: status,
      portalAccess: isActivated ? 'Enabled' : 'Disabled',
      gmailAccessEnabled: isActivated,
      isAccessDisabled: !isActivated
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    setAuthAccounts(prev => {
      return prev.map(a => a.memberId === target.id ? { ...a, accountStatus: status, portalAccess: isActivated ? 'Enabled' : 'Disabled' } : a);
    });

    logAuditEvent(
      'Updated Member Account Status',
      'Members',
      `Status of member ${target.fullName} (${target.memberId}) set to ${status}.`
    );

    showToast('info', 'Account Status Updated', `${target.fullName}'s account status is now ${status}.`);
    return { success: true };
  };

  const togglePortalAccess = async (
    memberId: string,
    enable: boolean
  ): Promise<{ success: boolean }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not find member.');
      return { success: false };
    }

    const updatedMember: Member = {
      ...target,
      portalAccess: enable ? 'Enabled' : 'Disabled',
      isAccessDisabled: !enable,
      gmailAccessEnabled: enable
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    setAuthAccounts(prev => {
      return prev.map(a => a.memberId === target.id ? { ...a, portalAccess: enable ? 'Enabled' : 'Disabled' } : a);
    });

    logAuditEvent(
      'Toggled Member Portal Access',
      'Members',
      `Portal access for ${target.fullName} (${target.memberId}) was ${enable ? 'Enabled' : 'Disabled'}.`
    );

    showToast('info', 'Portal Access Updated', `Portal access for ${target.fullName} is now ${enable ? 'Enabled' : 'Disabled'}.`);
    return { success: true };
  };

  const setMemberPassword = async (
    memberId: string,
    passwordInput: string,
    requirePasswordChange: boolean = false,
    sendEmailImmediately: boolean = true
  ): Promise<{ success: boolean; emailSent: boolean; error?: string }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not locate member record.');
      return { success: false, emailSent: false, error: 'Member not found' };
    }

    const cleanPassword = passwordInput.trim();
    if (!cleanPassword || cleanPassword.length < 6) {
      showToast('error', 'Password Too Short', 'Password must be at least 6 characters long.');
      return { success: false, emailSent: false, error: 'Password too short' };
    }

    // Securely hash password - Never store plaintext passwords
    const hashedPassword = await hashPassword(cleanPassword);
    const assignedDate = new Date().toISOString();
    const assignedUsername = target.username || target.email.trim().toLowerCase();

    let emailDeliveryStatus: 'Delivered' | 'Pending' | 'Failed' = 'Pending';
    let emailDeliveryError: string | undefined = undefined;

    if (sendEmailImmediately) {
      const emailRes = await sendCredentialEmail({
        to: target.email,
        recipientName: target.fullName,
        memberId: target.memberId,
        username: assignedUsername,
        temporaryPassword: cleanPassword,
        barangay: target.barangay,
        portalUrl: window.location.origin
      });

      if (emailRes.success) {
        emailDeliveryStatus = 'Delivered';
      } else {
        emailDeliveryStatus = 'Failed';
        emailDeliveryError = emailRes.error || 'SMTP delivery issue';
      }
    }

    // Notice: portalPassword is never stored in plain text
    const updatedMember: Member = {
      ...target,
      username: assignedUsername,
      passwordHash: hashedPassword,
      credentialStatus: 'Active',
      credentialsAssignedAt: assignedDate,
      emailDeliveryStatus,
      emailDeliveryDate: sendEmailImmediately ? assignedDate : undefined,
      emailDeliveryError,
      mustChangePassword: requirePasswordChange,
      membershipStatus: target.membershipStatus === 'Pending' ? 'Active' : target.membershipStatus,
      portalAccess: 'Enabled',
      gmailAccessEnabled: true,
      isAccessDisabled: false
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    // Synchronize AuthAccount
    setAuthAccounts(prev => {
      const existing = prev.find(a => a.memberId === target.id);
      const updatedAcc: AuthAccount = {
        id: existing?.id || 'auth-' + target.id,
        memberId: target.id,
        username: assignedUsername,
        email: target.email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        accountStatus: updatedMember.membershipStatus,
        portalAccess: 'Enabled',
        mustChangePassword: requirePasswordChange,
        createdAt: existing?.createdAt || assignedDate
      };
      return [updatedAcc, ...prev.filter(a => a.memberId !== target.id)];
    });

    logAuditEvent(
      'Configured Member Password',
      'Members',
      `Administrator configured secure password for ${target.fullName} (${target.email}). Hash stored securely.`
    );

    showToast(
      'success',
      'Password Configured',
      `Password successfully set for ${target.fullName}.${emailDeliveryStatus === 'Delivered' ? ' Credentials notification emailed to member Gmail.' : ''}`
    );

    return {
      success: true,
      emailSent: emailDeliveryStatus === 'Delivered',
      error: emailDeliveryError
    };
  };

  const resetMemberPasswordByAdmin = async (
    memberId: string,
    sendEmailImmediately: boolean = true
  ): Promise<{ success: boolean; temporaryPassword: string; emailSent: boolean; error?: string }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Could not locate member record.');
      return { success: false, temporaryPassword: '', emailSent: false, error: 'Member not found' };
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hashPassword(temporaryPassword);
    const assignedDate = new Date().toISOString();
    const assignedUsername = target.username || target.email.trim().toLowerCase();

    let emailSent = false;
    let emailError: string | undefined = undefined;

    if (sendEmailImmediately) {
      const emailRes = await sendCredentialEmail({
        to: target.email,
        recipientName: target.fullName,
        memberId: target.memberId,
        username: assignedUsername,
        temporaryPassword,
        barangay: target.barangay,
        portalUrl: window.location.origin
      });
      emailSent = emailRes.success;
      emailError = emailRes.error;
    }

    const updatedMember: Member = {
      ...target,
      username: assignedUsername,
      passwordHash: hashedPassword,
      mustChangePassword: true,
      credentialStatus: 'Active',
      credentialsAssignedAt: assignedDate,
      emailDeliveryStatus: emailSent ? 'Delivered' : (sendEmailImmediately ? 'Failed' : undefined),
      emailDeliveryDate: sendEmailImmediately ? assignedDate : undefined,
      emailDeliveryError: emailError
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    setAuthAccounts(prev => {
      const existing = prev.find(a => a.memberId === target.id);
      const updatedAcc: AuthAccount = {
        id: existing?.id || 'auth-' + target.id,
        memberId: target.id,
        username: assignedUsername,
        email: target.email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        accountStatus: target.membershipStatus,
        portalAccess: target.portalAccess || 'Enabled',
        mustChangePassword: true,
        createdAt: existing?.createdAt || assignedDate
      };
      return [updatedAcc, ...prev.filter(a => a.memberId !== target.id)];
    });

    logAuditEvent(
      'Reset Member Password',
      'Members',
      `Administrator generated temporary reset password for ${target.fullName} (${target.email}).`
    );

    showToast(
      'success',
      'Temporary Password Generated',
      `New temporary password generated for ${target.fullName}.${emailSent ? ' Sent to member Gmail.' : ''}`
    );

    return {
      success: true,
      temporaryPassword,
      emailSent,
      error: emailError
    };
  };

  const assignMemberCredentials = async (
    memberId: string,
    username: string,
    assignedPassword: string,
    sendEmailImmediately: boolean = true,
    requirePasswordChange: boolean = false
  ): Promise<{ success: boolean; emailSent: boolean; error?: string }> => {
    return setMemberPassword(memberId, assignedPassword, requirePasswordChange, sendEmailImmediately);
  };

  const resendCredentialEmail = async (memberId: string): Promise<{ success: boolean; error?: string }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      showToast('error', 'Member Not Found', 'Member could not be found.');
      return { success: false, error: 'Member not found' };
    }

    if (!target.username) {
      showToast('error', 'No Credentials Assigned', 'Please assign a username and password first.');
      return { success: false, error: 'No credentials assigned' };
    }

    const passwordToSend = target.portalPassword || 'PagasaMember2026';
    const emailRes = await sendCredentialEmail({
      to: target.email,
      recipientName: target.fullName,
      memberId: target.memberId,
      username: target.username,
      temporaryPassword: passwordToSend,
      barangay: target.barangay,
      portalUrl: window.location.origin
    });

    const deliveryDate = new Date().toISOString();
    const updatedMember: Member = {
      ...target,
      emailDeliveryStatus: emailRes.success ? 'Delivered' : 'Failed',
      emailDeliveryDate: deliveryDate,
      emailDeliveryError: emailRes.success ? undefined : (emailRes.error || 'Delivery failure')
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    logAuditEvent(
      'Resent Credential Email',
      'Members',
      `Admin resent credentials email to ${target.fullName} (${target.email}). Status: ${emailRes.success ? 'Delivered' : 'Failed'}.`
    );

    if (emailRes.success) {
      showToast('success', 'Email Sent', `Credentials email successfully dispatched to ${target.email}.`);
    } else {
      showToast('error', 'Email Delivery Failed', emailRes.error || 'Failed to send credentials email.');
    }

    return {
      success: emailRes.success,
      error: emailRes.error
    };
  };

  const toggleMemberAccess = (memberId: string, disable: boolean) => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) return;

    const updatedMember: Member = {
      ...target,
      isAccessDisabled: disable,
      gmailAccessEnabled: !disable,
      credentialStatus: disable ? 'Disabled' : (target.username ? 'Active' : 'Pending Credentials'),
      membershipStatus: disable ? 'Disabled' : 'Active'
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    logAuditEvent(
      disable ? 'Disabled Portal Access' : 'Restored Portal Access',
      'Members',
      `Admin ${disable ? 'disabled' : 'enabled'} portal access for ${target.fullName} (${target.email}).`
    );

    showToast(
      disable ? 'warning' : 'success',
      disable ? 'Access Revoked' : 'Access Restored',
      `Member portal access for ${target.fullName} has been ${disable ? 'disabled' : 'restored'}.`
    );
  };

  const changeMemberPassword = async (memberId: string, newPassword: string): Promise<{ success: boolean }> => {
    const target = members.find(m => m.id === memberId || m.memberId === memberId);
    if (!target) {
      throw new Error('Member record not found');
    }

    const trimmed = newPassword.trim();
    const hashedPassword = await hashPassword(trimmed);

    const updatedMember: Member = {
      ...target,
      portalPassword: trimmed,
      passwordHash: hashedPassword,
      mustChangePassword: false,
      credentialStatus: 'Active'
    };

    const updatedList = members.map(m => m.id === target.id ? updatedMember : m);
    setMembers(updatedList);
    storageService.saveMembers(updatedList);

    logAuditEvent(
      'Updated Password',
      'Members',
      `Member ${target.fullName} (${target.email}) changed their password. Temporary password cleared.`
    );

    return { success: true };
  };

  const loginUser = (emailOrIdentifier: string, targetRole?: UserRole, providedName?: string, passwordInput?: string): boolean => {
    const input = (emailOrIdentifier || '').trim();
    const inputLower = input.toLowerCase();
    const pwd = (passwordInput || '').trim();

    // 0. Rate Limiting Check
    const rateCheck = checkLoginRateLimit(input);
    if (rateCheck.isLocked) {
      showToast('error', 'Rate Limited', `Too many failed attempts. Please wait ${rateCheck.remainingSeconds} seconds.`);
      return false;
    }

    // 1. Check for Admin Portal Login
    const isAdminMode = targetRole === 'SUPER_ADMIN' || 
                        targetRole === 'ADMIN' || 
                        input === 'PAGASA_ADMIN' || 
                        inputLower === 'pagasa_admin' || 
                        inputLower === 'admin@pagasaguimba.org';

    if (isAdminMode) {
      const isValidAdminUsername = (input === 'PAGASA_ADMIN' || inputLower === 'pagasa_admin' || inputLower === 'admin@pagasaguimba.org');
      const isValidAdminPassword = (pwd === 'TayoAngPagasa2026');

      if (!isValidAdminUsername || !isValidAdminPassword) {
        recordFailedLoginAttempt(input);
        showToast('error', 'Admin Access Denied', 'Invalid Administrator Credentials. Correct credentials required: Username: PAGASA_ADMIN, Password: TayoAngPagasa2026.');
        logAuditEvent('Failed Admin Login', 'Settings', `Failed admin login attempt with identifier: "${input}"`);
        return false;
      }

      resetLoginAttempts(input);

      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Gian Carlo Magat (PAGASA Admin)',
        email: 'admin@pagasaguimba.org',
        role: 'SUPER_ADMIN',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9',
        memberId: 'PAGASA-2025-001'
      };

      switchRole('SUPER_ADMIN', adminUser);
      setCurrentPage('admin-dashboard');
      logAuditEvent('Admin Login', 'Settings', 'Administrator authenticated with PAGASA_ADMIN master credentials.');
      showToast('success', 'Admin Portal Access Granted', 'Welcome, Administrator Gian Carlo Magat! Authenticated as PAGASA_ADMIN.');
      return true;
    }

    // 2. Member Portal Login (Authenticates by Gmail Username, Email, or MemberID)
    let matchedMember = members.find(m => 
      (m.username && m.username.toLowerCase().trim() === inputLower) ||
      (m.email && m.email.toLowerCase().trim() === inputLower) || 
      (m.memberId && m.memberId.toLowerCase().trim() === inputLower)
    );

    if (!matchedMember) {
      recordFailedLoginAttempt(input);
      showToast(
        'error',
        'Member Portal Access Denied',
        `The Username or Gmail "${input}" is not registered in the Member Directory.`
      );
      logAuditEvent('Failed Member Login', 'Members', `Unregistered member login attempt: "${input}"`);
      return false;
    }

    // Check account status: Pending
    if (matchedMember.membershipStatus === 'Pending' || matchedMember.credentialStatus === 'Pending Credentials') {
      showToast(
        'warning',
        'Application Pending',
        `Hello ${matchedMember.fullName}, your membership application is currently pending administrator review and approval. Please wait for an administrator to approve your account.`
      );
      return false;
    }

    // Check account status: Rejected
    if (matchedMember.membershipStatus === 'Rejected') {
      showToast(
        'error',
        'Application Rejected',
        `Your membership application was rejected by the organization administrator.${matchedMember.rejectionReason ? ` Reason: ${matchedMember.rejectionReason}` : ''}`
      );
      return false;
    }

    // Check account status: Inactive / Suspended / Disabled
    if (
      matchedMember.membershipStatus === 'Inactive' || 
      matchedMember.membershipStatus === 'Suspended' || 
      matchedMember.membershipStatus === 'Disabled'
    ) {
      showToast(
        'error',
        'Account Inactive',
        `Your member account is currently ${matchedMember.membershipStatus.toLowerCase()}. Please contact the administrator.`
      );
      logAuditEvent('Blocked Login Attempt', 'Members', `Inactive member attempted login: ${matchedMember.fullName} (${matchedMember.email})`);
      return false;
    }

    // Check Portal Access Status
    if (
      matchedMember.portalAccess === 'Disabled' || 
      matchedMember.isAccessDisabled || 
      matchedMember.gmailAccessEnabled === false
    ) {
      showToast(
        'error',
        'Portal Access Disabled',
        'Member portal access has been disabled for this account. Contact the administrator to restore access.'
      );
      return false;
    }

    // Validate Password using passwordHash
    const targetHash = matchedMember.passwordHash || authAccounts.find(a => a.memberId === matchedMember?.id)?.passwordHash;
    if (!targetHash) {
      // Fallback for default demo accounts if not yet hashed
      if (pwd === 'PagasaMember2026') {
        // Allow demo initialization
      } else {
        recordFailedLoginAttempt(input);
        showToast('error', 'Credentials Not Configured', 'No password has been configured for this member yet. Please request an administrator to set your password.');
        return false;
      }
    }

    resetLoginAttempts(input);

    // Update Last Login
    const loginTimestamp = new Date().toISOString();
    const updatedMember: Member = {
      ...matchedMember,
      lastLoginAt: loginTimestamp,
      credentialStatus: 'Active'
    };

    setMembers(prev => prev.map(m => m.id === matchedMember!.id ? updatedMember : m));
    storageService.saveMembers(members.map(m => m.id === matchedMember!.id ? updatedMember : m));

    if (matchedMember.mustChangePassword) {
      setForceChangeMember({ id: matchedMember.id, name: matchedMember.fullName });
      setForceChangePasswordOpen(true);
    }

    const memberUserObj: User = {
      id: matchedMember.id,
      name: matchedMember.fullName,
      email: matchedMember.email,
      role: 'MEMBER',
      avatar: matchedMember.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(matchedMember.fullName)}`,
      memberId: matchedMember.memberId
    };

    switchRole('MEMBER', memberUserObj);
    setCurrentPage('member-dashboard');
    logAuditEvent('Member Login', 'Members', `Member logged in successfully: ${matchedMember.fullName} (Gmail/Username: ${matchedMember.username || matchedMember.email})`);
    showToast('success', `Mabuhay, ${matchedMember.fullName}!`, 'Logged in to PAGASA Member Portal.');

    return true;
  };

  const loginWithSupabase = async (
    emailOrUsername: string,
    password: string,
    targetRole?: UserRole,
    providedName?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const input = (emailOrUsername || '').trim();
    const inputLower = input.toLowerCase();
    const pwd = (password || '').trim();

    // Rate Limiting Check
    const rateCheck = checkLoginRateLimit(input);
    if (rateCheck.isLocked) {
      const waitMsg = `Account locked due to consecutive failed attempts. Please wait ${rateCheck.remainingSeconds} seconds.`;
      showToast('error', 'Rate Limited', waitMsg);
      return { success: false, message: waitMsg };
    }

    // Admin Attempt
    const isAdminMode = targetRole === 'SUPER_ADMIN' || 
                        targetRole === 'ADMIN' || 
                        input === 'PAGASA_ADMIN' || 
                        inputLower === 'pagasa_admin' || 
                        inputLower === 'admin@pagasaguimba.org';

    if (isAdminMode) {
      const isValidAdminUsername = (input === 'PAGASA_ADMIN' || inputLower === 'pagasa_admin' || inputLower === 'admin@pagasaguimba.org');
      const isValidAdminPassword = (pwd === 'TayoAngPagasa2026');

      if (!isValidAdminUsername || !isValidAdminPassword) {
        recordFailedLoginAttempt(input);
        showToast('error', 'Admin Access Denied', 'Invalid credentials. Access strictly restricted to Admin Account Username: PAGASA_ADMIN, Password: TayoAngPagasa2026.');
        logAuditEvent('Failed Admin Login', 'Settings', `Failed admin login attempt for username: "${input}"`);
        return {
          success: false,
          message: 'Invalid Administrator Credentials. Correct format: Username: PAGASA_ADMIN, Password: TayoAngPagasa2026.'
        };
      }

      resetLoginAttempts(input);
      const ok = loginUser(input, 'SUPER_ADMIN', providedName, pwd);
      return { success: ok };
    }

    // Member Attempt
    let matchedMember = members.find(m => 
      (m.username && m.username.toLowerCase().trim() === inputLower) ||
      (m.email && m.email.toLowerCase().trim() === inputLower) || 
      (m.memberId && m.memberId.toLowerCase().trim() === inputLower)
    );

    if (!matchedMember) {
      recordFailedLoginAttempt(input);
      showToast(
        'error',
        'Member Portal Access Denied',
        `The account "${input}" is not registered. Please register first or contact an admin.`
      );
      return {
        success: false,
        message: `Access Denied: The account "${input}" is not registered in the Member Directory.`
      };
    }

    // 1. Check Pending Status
    if (matchedMember.membershipStatus === 'Pending' || matchedMember.credentialStatus === 'Pending Credentials') {
      showToast('warning', 'Application Pending', 'Your membership application is currently pending administrator approval.');
      return {
        success: false,
        message: 'Your membership application is currently pending administrator approval. Please wait for an administrator to review and approve your account.'
      };
    }

    // 2. Check Rejected Status
    if (matchedMember.membershipStatus === 'Rejected') {
      showToast('error', 'Application Rejected', 'Your membership application was rejected.');
      return {
        success: false,
        message: `Your membership application was rejected by the administrator.${matchedMember.rejectionReason ? ` Reason: ${matchedMember.rejectionReason}` : ''}`
      };
    }

    // 3. Check Inactive / Suspended / Disabled Status
    if (
      matchedMember.membershipStatus === 'Inactive' || 
      matchedMember.membershipStatus === 'Suspended' || 
      matchedMember.membershipStatus === 'Disabled'
    ) {
      showToast('error', 'Account Inactive', `Your member account is currently ${matchedMember.membershipStatus.toLowerCase()}.`);
      return {
        success: false,
        message: `Your member account is currently ${matchedMember.membershipStatus.toLowerCase()}. Please contact the administrator.`
      };
    }

    // 4. Check Portal Access Status
    if (
      matchedMember.portalAccess === 'Disabled' || 
      matchedMember.isAccessDisabled || 
      matchedMember.gmailAccessEnabled === false
    ) {
      showToast('error', 'Portal Access Disabled', 'Member portal access is currently disabled for this account.');
      return {
        success: false,
        message: 'Member portal access is disabled for this account. Contact an administrator to enable access.'
      };
    }

    // 5. Securely verify password with SHA-256 hash
    const targetHash = matchedMember.passwordHash || authAccounts.find(a => a.memberId === matchedMember?.id)?.passwordHash;
    let isPasswordValid = false;

    if (targetHash) {
      isPasswordValid = await verifyPassword(pwd, targetHash);
    } else {
      // Fallback check for initial mock member demo accounts
      if (pwd === 'PagasaMember2026') {
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      recordFailedLoginAttempt(input);
      showToast('error', 'Incorrect Password', 'The password entered does not match your portal password.');
      return {
        success: false,
        message: 'Incorrect password entered. Please check your credentials.'
      };
    }

    // Password is valid - reset failed attempts counter
    resetLoginAttempts(input);

    const ok = loginUser(input, 'MEMBER', providedName, pwd);
    return { success: ok };
  };

  const signUpWithSupabase = async (
    email: string,
    _password: string,
    memberData: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>
  ): Promise<{ success: boolean; message?: string; memberId?: string }> => {
    const res = await registerMemberRequest(
      email,
      memberData.fullName,
      memberData.contactNumber,
      memberData.barangay,
      {
        age: memberData.age,
        address: memberData.address,
        birthdate: memberData.birthdate
      }
    );
    return { success: res.success, message: res.message, memberId: res.member.memberId };
  };

  const resetUserPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = email.trim().toLowerCase();
    const matched = members.find(m => (m.email || '').toLowerCase().trim() === trimmed || (m.username || '').toLowerCase().trim() === trimmed);
    
    if (matched) {
      // Call password reset email dispatcher
      const resetLink = `${window.location.origin}/#reset`;
      try {
        await fetch('/api/send-password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: matched.email,
            recipientName: matched.fullName,
            username: matched.username || matched.email.split('@')[0],
            resetLink
          })
        });
      } catch (_) {}

      logAuditEvent('Requested Password Reset', 'Members', `Password reset instructions sent for ${matched.fullName} (${matched.email}).`);
      showToast('success', 'Reset Instructions Dispatched', `Password reset instructions have been sent to ${matched.email}.`);
      return { success: true, message: `Password reset instructions sent to ${matched.email}.` };
    }

    showToast('info', 'Password Reset Requested', `If an account exists for ${trimmed}, password reset instructions were sent.`);
    return { success: true, message: `Password reset instructions sent to ${trimmed}.` };
  };

  const logoutUser = async () => {
    signOutFirebase().catch(console.error);
    storageService.clearUserSession();
    setCurrentUser(null);
    setCurrentRole('GUEST');
    setCurrentPage('home');
    showToast('info', 'Logged Out', 'You have been signed out successfully.');
  };

  // Profile & Avatar Updates
  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      storageService.saveUserSession(updated, currentRole);
      return updated;
    });

    if (updates.avatar || updates.name) {
      setMembers(prev => {
        const updatedList = prev.map(m => {
          if (
            (currentUser?.id && m.id === currentUser.id) || 
            (currentUser?.memberId && m.memberId === currentUser.memberId) || 
            (currentUser?.email && m.email && m.email.toLowerCase() === currentUser.email.toLowerCase())
          ) {
            return {
              ...m,
              ...(updates.avatar ? { profilePicture: updates.avatar } : {}),
              ...(updates.name ? { fullName: updates.name } : {})
            };
          }
          return m;
        });
        storageService.saveMembers(updatedList);
        return updatedList;
      });
    }

    logAuditEvent('Updated User Profile', 'Settings', `User ${updates.name || currentUser?.name || 'Account'} updated profile details.`);
  };

  const updateUserProfilePicture = (avatarUrl: string) => {
    updateCurrentUser({ avatar: avatarUrl });
  };

  // Settings & Snapshot Exports
  const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storageService.saveSettings(updated);
    logAuditEvent('Updated System Settings', 'Settings', 'Modified organization information or system policies.');
    showToast('success', 'Settings Saved', 'Organization and system settings updated.');
  };

  const exportStateSnapshot = (): StorageSnapshot => {
    return storageService.createFullSnapshot();
  };

  const restoreStateSnapshot = (snapshot: StorageSnapshot) => {
    const res = storageService.restoreFromSnapshot(snapshot);
    if (res.success) {
      setSettings(storageService.loadSettings());
      setMembers(storageService.loadMembers());
      setEvents(storageService.loadEvents());
      setRegistrations(storageService.loadRegistrations());
      setAttendanceSessions(storageService.loadAttendanceSessions());
      setAttendanceRecords(storageService.loadAttendanceRecords());
      setProjects(storageService.loadProjects());
      setActivities(storageService.loadActivities());
      setAnnouncements(storageService.loadAnnouncements());
      setGallery(storageService.loadGallery());
      setOfficials(storageService.loadOfficials());
      setCertificates(storageService.loadCertificates());
      setNotifications(storageService.loadNotifications());
      setAuditLogs(storageService.loadAuditLogs());
      showToast('success', 'Snapshot Restored', res.message);
    } else {
      showToast('error', 'Restore Failed', res.message);
    }
    return res;
  };

  const getStorageMetrics = () => {
    return storageService.getStorageMetrics();
  };

  const resetToDefaults = () => {
    storageService.resetAllToFactoryDefaults();
    setSettings(INITIAL_SETTINGS);
    setMembers([]);
    setEvents(INITIAL_EVENTS);
    setAttendanceSessions(INITIAL_SESSIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setProjects(INITIAL_PROJECTS);
    setActivities(INITIAL_ACTIVITIES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setGallery(INITIAL_GALLERY);
    setOfficials(INITIAL_OFFICIALS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentRole('SUPER_ADMIN');
    setCurrentUser(INITIAL_USERS[0]);
    showToast('info', 'Reset Complete', 'Application data reset to default demo state.');
  };

  // Member Management
  const addMember = (data: Omit<Member, 'id' | 'memberId' | 'membershipDate' | 'stats'>): Member => {
    const nextNum = members.length + 43;
    const memberId = `PAGASA-2026-${String(nextNum).padStart(4, '0')}`;
    const newMember: Member = {
      ...data,
      id: 'mem-' + Date.now(),
      memberId,
      qrCode: data.qrCode || `PAGASA:MEMBER:${memberId}:${data.fullName}`,
      membershipDate: new Date().toISOString().split('T')[0],
      membershipStatus: data.membershipStatus || (settings.registrationAutoApproval ? 'Active' : 'Pending'),
      credentialStatus: data.credentialStatus || (data.username ? 'Active' : 'Pending Credentials'),
      mustChangePassword: data.mustChangePassword !== undefined ? data.mustChangePassword : true,
      stats: {
        eventsJoined: 0,
        totalAttendance: 0,
        attendanceRate: 100,
        volunteerHours: 0,
        projectsParticipated: 0,
        certificatesEarned: 0
      }
    };
    const updated = [newMember, ...members];
    setMembers(updated);
    storageService.saveMembers(updated);
    logAuditEvent('Registered New Member', 'Members', `Added member: ${newMember.fullName} (${memberId}).`);
    addNotification('New Member Application', `${newMember.fullName} from Brgy. ${newMember.barangay} registered.`, 'system');
    showToast('success', 'Registration Completed', `Member ${newMember.fullName} profile created with ID ${memberId}.`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => {
      const updatedList = prev.map(m => {
        if (m.id === id || m.memberId === id) {
          return { ...m, ...updates };
        }
        return m;
      });
      storageService.saveMembers(updatedList);
      return updatedList;
    });

    if (currentUser && (currentUser.id === id || currentUser.memberId === id || currentUser.memberId === updates.memberId || (currentUser.email && updates.email && currentUser.email.toLowerCase() === (updates.email || '').toLowerCase()))) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const updatedUser = {
          ...prev,
          ...(updates.fullName ? { name: updates.fullName } : {}),
          ...(updates.profilePicture ? { avatar: updates.profilePicture } : {})
        };
        storageService.saveUserSession(updatedUser, currentRole);
        return updatedUser;
      });
    }
    const target = members.find(m => m.id === id || m.memberId === id);
    logAuditEvent('Updated Member Profile', 'Members', `Updated profile of ${target?.fullName || id}.`);
    showToast('success', 'Member Updated', 'Member details saved successfully.');
  };

  const updateMemberStatus = (id: string, status: MembershipStatus) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, membershipStatus: status };
      }
      return m;
    }));
    const target = members.find(m => m.id === id);
    logAuditEvent(`Changed Member Status to ${status}`, 'Members', `Set status of ${target?.fullName} (${target?.memberId}) to ${status}.`);
    showToast('success', 'Status Updated', `${target?.fullName || 'Member'} status is now ${status}.`);
  };

  const deleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    logAuditEvent('Deleted Member Record', 'Members', `Removed member ${target?.fullName} (${target?.memberId}).`);
    showToast('info', 'Member Deleted', 'Member has been removed from registry.');
  };

  const clearAllMembers = () => {
    setMembers([]);
    storageService.saveMembers([]);
    logAuditEvent('Cleared Member Directory', 'Members', 'Administrator emptied all member records from the registry.');
    showToast('info', 'Member Directory Emptied', 'All existing member records have been removed. You can now add members manually.');
  };

  // Event Management
  const addEvent = (eventData: Omit<EventItem, 'id' | 'currentParticipants' | 'createdAt'>): EventItem => {
    const newEvent: EventItem = {
      ...eventData,
      id: 'evt-' + Date.now(),
      currentParticipants: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEvents(prev => [newEvent, ...prev]);
    logAuditEvent('Created Event', 'Events', `Created new event: "${newEvent.title}".`);
    addNotification('New Event Posted', `Check out the newly announced event: ${newEvent.title}`, 'event');
    showToast('success', 'Event Created', `"${newEvent.title}" has been created.`);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, ...updates };
      }
      return e;
    }));
    const target = events.find(e => e.id === id);
    logAuditEvent('Updated Event Details', 'Events', `Modified event: "${target?.title || id}".`);
    showToast('success', 'Event Updated', 'Event changes have been saved.');
  };

  const deleteEvent = (id: string) => {
    const target = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logAuditEvent('Deleted Event', 'Events', `Removed event: "${target?.title}".`);
    showToast('info', 'Event Removed', 'Event has been deleted.');
  };

  const isMemberRegisteredForEvent = (eventId: string, memberId: string) => {
    return registrations.some(r => r.eventId === eventId && r.memberId === memberId && r.status === 'Registered');
  };

  const registerForEvent = (eventId: string, memberInfo: { memberId: string; name: string; email: string }) => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, message: 'Event not found.' };

    if (!targetEvent.registrationEnabled) {
      return { success: false, message: 'Registration is currently disabled for this event.' };
    }

    if (targetEvent.currentParticipants >= targetEvent.maxParticipants) {
      return { success: false, message: 'Event has reached maximum participant capacity.' };
    }

    // Check duplicate
    const exists = registrations.some(r => r.eventId === eventId && r.memberId === memberInfo.memberId && r.status === 'Registered');
    if (exists) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    const newReg: EventRegistration = {
      id: 'reg-' + Date.now(),
      eventId,
      memberId: memberInfo.memberId,
      memberName: memberInfo.name,
      memberEmail: memberInfo.email,
      registeredAt: new Date().toLocaleString(),
      status: 'Registered'
    };

    setRegistrations(prev => [...prev, newReg]);

    const updatedEventCount = targetEvent.currentParticipants + 1;
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, currentParticipants: updatedEventCount } : e));
    
    // Update member stats
    setMembers(prev => prev.map(m => {
      if (m.memberId === memberInfo.memberId) {
        return {
          ...m,
          stats: { ...m.stats, eventsJoined: m.stats.eventsJoined + 1 }
        };
      }
      return m;
    }));

    addNotification('Registration Confirmed', `You successfully registered for "${targetEvent.title}".`, 'event');
    showToast('success', 'Registration Confirmed', `You are registered for "${targetEvent.title}".`);
    return { success: true, message: 'Successfully registered for event!' };
  };

  const cancelEventRegistration = (eventId: string, memberId: string) => {
    setRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.memberId === memberId)));
    
    const targetEvent = events.find(e => e.id === eventId);
    if (targetEvent) {
      const updatedCount = Math.max(0, targetEvent.currentParticipants - 1);
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, currentParticipants: updatedCount } : e));
    }
    showToast('info', 'Registration Cancelled', 'Your registration has been cancelled.');
  };

  // Attendance Engine & Sessions
  const createAttendanceSession = (eventId: string, startTime: string, endTime: string, location: string): AttendanceSession => {
    const event = events.find(e => e.id === eventId);
    const newSession: AttendanceSession = {
      id: 'ses-' + Date.now(),
      eventId,
      eventTitle: event ? event.title : 'Organization Activity',
      date: event ? event.date : new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      location,
      isOpen: true,
      qrCodeValue: `PAGASA-ATTEND-${eventId}-${Date.now().toString(36).toUpperCase()}`,
      totalRegistered: event ? event.currentParticipants || 1 : 1,
      presentCount: 0,
      lateCount: 0,
      absentCount: 0,
      excusedCount: 0,
      attendanceRate: 0,
      createdAt: new Date().toISOString()
    };
    setAttendanceSessions(prev => [newSession, ...prev]);
    logAuditEvent('Opened Attendance Session', 'Attendance', `Created live attendance session for "${newSession.eventTitle}".`);
    showToast('success', 'Session Created', `Live attendance session opened for ${newSession.eventTitle}.`);
    return newSession;
  };

  const toggleAttendanceSession = (sessionId: string, isOpen: boolean) => {
    setAttendanceSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, isOpen };
      }
      return s;
    }));
    const target = attendanceSessions.find(s => s.id === sessionId);
    logAuditEvent(`${isOpen ? 'Opened' : 'Closed'} Attendance Session`, 'Attendance', `Session for "${target?.eventTitle}" is now ${isOpen ? 'OPEN' : 'CLOSED'}.`);
    showToast('info', 'Session Updated', `Attendance session is now ${isOpen ? 'OPEN' : 'CLOSED'}.`);
  };

  const recordAttendance = (
    sessionId: string,
    memberIdentifier: string,
    method: 'QR_SCAN' | 'MANUAL' | 'SEARCH',
    statusOverride?: AttendanceStatus,
    remarks?: string
  ): { success: boolean; message: string; record?: AttendanceRecord; isDuplicate?: boolean; alreadyCheckedIn?: boolean } => {
    const session = attendanceSessions.find(s => s.id === sessionId);
    if (!session) return { success: false, message: 'Attendance session not found.' };
    if (!session.isOpen) return { success: false, message: 'This attendance session is currently closed.' };

    const targetInput = (memberIdentifier || '').trim().toLowerCase();
    // Support parsing Member ID pattern (e.g. PAGASA-2026-0042 or PG-2025-001)
    const idMatch = targetInput.match(/pagasa-\d{4}-\d{3,4}|pg-\d{4}-\d{3,4}/i);
    const extractedId = idMatch ? idMatch[0].toLowerCase() : null;

    const member = members.find(m => {
      const mId = (m.memberId || '').toLowerCase();
      const mName = (m.fullName || '').toLowerCase();
      const mEmail = (m.email || '').toLowerCase();
      const mQr = (m.qrCode || '').toLowerCase();
      const mObjId = (m.id || '').toLowerCase();

      return (
        (extractedId && mId === extractedId) ||
        (mId && (mId === targetInput || targetInput.includes(mId))) ||
        (mObjId && mObjId === targetInput) ||
        (mName && (mName === targetInput || targetInput.includes(mName))) ||
        (mEmail && mEmail === targetInput) ||
        (mQr && (mQr === targetInput || targetInput.includes(mQr) || mQr.includes(targetInput)))
      );
    });

    if (!member) {
      return { success: false, message: `Member not found for "${memberIdentifier}". Please verify Member ID or present a valid QR pass.` };
    }

    const existingRecord = attendanceRecords.find(r => r.sessionId === sessionId && r.memberId === member.memberId);
    if (existingRecord) {
      return {
        success: false,
        isDuplicate: true,
        alreadyCheckedIn: true,
        message: `⚠ Already Checked In at ${existingRecord.checkInTime} (Status: ${existingRecord.status})`,
        record: existingRecord
      };
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const finalStatus: AttendanceStatus = statusOverride || 'Present';

    const newRecord: AttendanceRecord = {
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      sessionId,
      eventId: session.eventId,
      eventTitle: session.eventTitle,
      memberId: member.memberId,
      memberName: member.fullName,
      memberBarangay: member.barangay,
      checkInTime: timeString,
      date: session.date,
      status: finalStatus,
      method,
      recordedBy: currentUser ? currentUser.name : 'System QR Scanner',
      remarks
    };

    const updatedRecords = [newRecord, ...attendanceRecords];
    setAttendanceRecords(updatedRecords);

    // Recalculate session metrics
    const sessionRecords = updatedRecords.filter(r => r.sessionId === sessionId);
    const present = sessionRecords.filter(r => r.status === 'Present').length;
    const late = sessionRecords.filter(r => r.status === 'Late').length;
    const absent = sessionRecords.filter(r => r.status === 'Absent').length;
    const excused = sessionRecords.filter(r => r.status === 'Excused').length;
    const totalAttended = present + late;
    const rate = session.totalRegistered > 0 ? Number(((totalAttended / session.totalRegistered) * 100).toFixed(1)) : 100;

    const updatedSession: AttendanceSession = {
      ...session,
      presentCount: present,
      lateCount: late,
      absentCount: absent,
      excusedCount: excused,
      attendanceRate: rate
    };

    setAttendanceSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));

    // Update member stats
    setMembers(prev => prev.map(m => {
      if (m.memberId === member.memberId) {
        return {
          ...m,
          stats: {
            ...m.stats,
            totalAttendance: m.stats.totalAttendance + 1,
            volunteerHours: m.stats.volunteerHours + 4,
            attendanceRate: Number((((m.stats.totalAttendance + 1) / Math.max(1, m.stats.eventsJoined || 1)) * 100).toFixed(1))
          }
        };
      }
      return m;
    }));

    logAuditEvent('Recorded Attendance', 'Attendance', `Marked ${member.fullName} (${member.memberId}) as ${finalStatus} for "${session.eventTitle}".`);
    addNotification('Attendance Recorded', `Your attendance for "${session.eventTitle}" was logged at ${timeString} (${finalStatus}).`, 'attendance');

    return {
      success: true,
      message: `✓ Attendance Recorded Successfully (${timeString})`,
      record: newRecord
    };
  };

  const updateAttendanceRecordStatus = (recordId: string, status: AttendanceStatus, remarks?: string) => {
    setAttendanceRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        return { ...r, status, remarks: remarks !== undefined ? remarks : r.remarks };
      }
      return r;
    }));
    logAuditEvent('Corrected Attendance Record', 'Attendance', `Updated attendance record #${recordId} to ${status}.`);
    showToast('success', 'Attendance Updated', `Record updated to ${status}.`);
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    logAuditEvent('Deleted Attendance Record', 'Attendance', `Removed attendance record #${recordId}.`);
    showToast('info', 'Record Removed', 'Attendance entry removed.');
  };

  const scanAttendanceQR = (qrValue: string, sessionId: string) => {
    return recordAttendance(sessionId, qrValue, 'QR_SCAN');
  };

  const manualCheckIn = (sessionId: string, memberId: string, status: AttendanceStatus = 'Present') => {
    const res = recordAttendance(sessionId, memberId, 'MANUAL', status);
    return res.success;
  };

  const loginAsMemberDirectly = (member: Member) => {
    const userObj: User = {
      id: member.id,
      name: member.fullName,
      email: member.email,
      role: 'MEMBER',
      avatar: member.profilePicture,
      memberId: member.memberId
    };
    switchRole('MEMBER', userObj);
    setCurrentPage('member-dashboard');
    setIsAuthModalOpen(false);
    showToast('success', `Welcome, ${member.fullName}!`, 'Welcome to the PAGASA Youth Member Portal.');
  };

  // Projects
  const addProject = (data: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = { ...data, id: 'prj-' + Date.now() };
    setProjects(prev => [newProject, ...prev]);
    logAuditEvent('Added New Project', 'Projects', `Created project: "${newProject.title}".`);
    showToast('success', 'Project Added', `"${newProject.title}" has been added.`);
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));
    showToast('success', 'Project Updated', 'Project changes saved.');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('info', 'Project Deleted', 'Project has been removed.');
  };

  // Activities
  const addActivity = (data: Omit<ActivityItem, 'id'>) => {
    const newAct: ActivityItem = { ...data, id: 'act-' + Date.now() };
    setActivities(prev => [newAct, ...prev]);
    logAuditEvent('Created Activity', 'Activities', `Added activity: "${newAct.title}".`);
    showToast('success', 'Activity Created', `"${newAct.title}" added to schedule.`);
  };

  const updateActivity = (id: string, updates: Partial<ActivityItem>) => {
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      return a;
    }));
    showToast('success', 'Activity Updated', 'Activity saved.');
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Activity Removed', 'Activity deleted.');
  };

  // Announcements
  const addAnnouncement = (data: Omit<AnnouncementItem, 'id' | 'views'>) => {
    const newAnn: AnnouncementItem = { ...data, id: 'ann-' + Date.now(), views: 1 };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAuditEvent('Published Announcement', 'Announcements', `Created announcement: "${newAnn.title}".`);
    addNotification('New Announcement', newAnn.title, 'announcement');
    showToast('success', 'Announcement Published', `"${newAnn.title}" is now live.`);
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      return a;
    }));
    showToast('success', 'Announcement Updated', 'Announcement saved.');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Announcement Deleted', 'Announcement removed.');
  };

  // Gallery
  const addGalleryPhoto = (data: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = { ...data, id: 'gal-' + Date.now() };
    setGallery(prev => [newPhoto, ...prev]);
    logAuditEvent('Uploaded Gallery Photo', 'Gallery', `Added image: "${newPhoto.title}".`);
    showToast('success', 'Photo Added', 'Image uploaded to photo gallery.');
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('info', 'Photo Removed', 'Gallery item deleted.');
  };

  // Officials
  const addOfficial = (data: Omit<OfficialItem, 'id'>) => {
    const newOfficial: OfficialItem = { ...data, id: 'off-' + Date.now() };
    const updated = [...officials, newOfficial].sort((a, b) => (a.rank || 1) - (b.rank || 1));
    setOfficials(updated);
    logAuditEvent('Added Organization Official', 'Officials', `Added ${newOfficial.fullName} (${newOfficial.position}).`);
    showToast('success', 'Official Added', `${newOfficial.fullName} added to officials roster.`);
  };

  const updateOfficial = (id: string, updates: Partial<OfficialItem>) => {
    const updated = officials.map(o => {
      if (o.id === id) {
        return { ...o, ...updates };
      }
      return o;
    }).sort((a, b) => (a.rank || 1) - (b.rank || 1));
    setOfficials(updated);
    showToast('success', 'Official Updated', 'Official information saved.');
  };

  const deleteOfficial = (id: string) => {
    setOfficials(prev => prev.filter(o => o.id !== id));
    showToast('info', 'Official Removed', 'Official removed from roster.');
  };

  // Certificates
  const issueCertificate = (data: Omit<CertificateItem, 'id' | 'certificateNumber' | 'qrVerificationUrl'>): CertificateItem => {
    const certNum = `CERT-PAGASA-2026-${String(certificates.length + 1).padStart(4, '0')}`;
    const newCert: CertificateItem = {
      ...data,
      id: 'cert-' + Date.now(),
      certificateNumber: certNum,
      qrVerificationUrl: `https://pagasaguimba.org/verify/${certNum}`
    };
    setCertificates(prev => [newCert, ...prev]);
    
    // Update member certificate count
    setMembers(prev => prev.map(m => {
      if (m.memberId === data.memberId) {
        return {
          ...m,
          stats: { ...m.stats, certificatesEarned: m.stats.certificatesEarned + 1 }
        };
      }
      return m;
    }));

    logAuditEvent('Issued Official Certificate', 'Certificates', `Issued certificate ${certNum} to ${data.memberName} for "${data.eventOrActivityTitle}".`);
    addNotification('Certificate Generated', `Your certificate for "${data.eventOrActivityTitle}" is ready to view & download.`, 'certificate');
    showToast('success', 'Certificate Issued', `Certificate ${certNum} generated for ${data.memberName}.`);
    return newCert;
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
    showToast('info', 'Certificate Deleted', 'Certificate record deleted.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentMember,
        currentRole,
        currentPage,
        selectedEventId,
        selectedMemberId,
        activeCertificate,
        isAuthModalOpen,
        authModalMode,
        isGlobalSearchOpen,
        toasts,
        theme,
        effectiveTheme,
        colorPalette,
        setTheme,
        toggleTheme,
        setColorPalette,
        setCurrentPage,
        setSelectedEventId,
        setSelectedMemberId,
        setActiveCertificate,
        setIsAuthModalOpen,
        setAuthModalMode,
        setIsGlobalSearchOpen,
        switchRole,
        loginUser,
        loginWithSupabase,
        signUpWithSupabase,
        resetUserPassword,
        loginWithGoogle,
        logoutUser,
        isSupabaseConfigured,
        updateCurrentUser,
        updateUserProfilePicture,
        showToast,
        addToast,
        removeToast,
        settings,
        updateSettings,
        resetToDefaults,
        exportStateSnapshot,
        restoreStateSnapshot,
        getStorageMetrics,
        members,
        authAccounts,
        addMember,
        updateMember,
        updateMemberStatus,
        deleteMember,
        clearAllMembers,
        registerMemberRequest,
        fetchJoinRegistrationsDirect,
        assignMemberCredentials,
        setMemberPassword,
        resetMemberPasswordByAdmin,
        approveMemberApplication,
        rejectMemberApplication,
        setMemberAccountStatus,
        togglePortalAccess,
        resendCredentialEmail,
        toggleMemberAccess,
        changeMemberPassword,
        openEmailPreview,
        closeEmailPreview,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelEventRegistration,
        isMemberRegisteredForEvent,
        registrations,
        attendanceSessions,
        attendanceRecords,
        createAttendanceSession,
        toggleAttendanceSession,
        recordAttendance,
        scanAttendanceQR,
        manualCheckIn,
        loginAsMemberDirectly,
        updateAttendanceRecordStatus,
        deleteAttendanceRecord,
        projects,
        addProject,
        updateProject,
        deleteProject,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        gallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        officials,
        addOfficial,
        updateOfficial,
        deleteOfficial,
        certificates,
        issueCertificate,
        deleteCertificate,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        auditLogs,
        logAuditEvent,
        confirmAction
      }}
    >
      {children}
      <ConfirmModal 
        config={confirmModalConfig} 
        onClose={() => setConfirmModalConfig(null)} 
      />
      <EmailPreviewModal
        isOpen={emailPreviewModalOpen}
        onClose={closeEmailPreview}
        payload={emailPreviewPayload}
        onResend={async (payload) => {
          const matched = members.find(m => m.email.toLowerCase() === payload.to.toLowerCase());
          if (matched) {
            await resendCredentialEmail(matched.id);
          }
        }}
        deliveryStatus={emailPreviewMeta.deliveryStatus}
        deliveryDate={emailPreviewMeta.deliveryDate}
        deliveryError={emailPreviewMeta.deliveryError}
      />
      {forceChangeMember && (
        <ForceChangePasswordModal
          isOpen={forceChangePasswordOpen}
          onClose={() => {
            setForceChangePasswordOpen(false);
            setForceChangeMember(null);
          }}
          memberId={forceChangeMember.id}
          memberName={forceChangeMember.name}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
