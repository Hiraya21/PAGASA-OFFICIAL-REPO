import {
  User,
  UserRole,
  Member,
  AuthAccount,
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

/**
 * Storage key constants with dedicated namespace
 */
export const STORAGE_KEYS = {
  // Session & Preferences
  USER: 'pagasa_user',
  ROLE: 'pagasa_role',
  SESSION_META: 'pagasa_session_meta',
  THEME: 'pagasa_theme',
  PALETTE: 'pagasa_palette',
  LAST_PAGE: 'pagasa_last_page',
  
  // Organization Domain State
  SETTINGS: 'pagasa_settings',
  MEMBERS: 'pagasa_members',
  EVENTS: 'pagasa_events',
  REGISTRATIONS: 'pagasa_registrations',
  ATTENDANCE_SESSIONS: 'pagasa_sessions',
  ATTENDANCE_RECORDS: 'pagasa_attendance_records',
  PROJECTS: 'pagasa_projects',
  ACTIVITIES: 'pagasa_activities',
  ANNOUNCEMENTS: 'pagasa_announcements',
  GALLERY: 'pagasa_gallery',
  OFFICIALS: 'pagasa_officials',
  CERTIFICATES: 'pagasa_certificates',
  NOTIFICATIONS: 'pagasa_notifications',
  AUDIT_LOGS: 'pagasa_audit_logs',
  AUTH_ACCOUNTS: 'pagasa_auth_accounts',
  VERSION: 'pagasa_storage_version'
} as const;

export const CURRENT_STORAGE_VERSION = '1.0.0';

export interface UserSessionMeta {
  lastActive: string;
  createdAt: string;
  deviceInfo: string;
  loginMethod: 'credential' | 'google' | 'guest';
}

export interface StorageSnapshot {
  version: string;
  exportedAt: string;
  appName: string;
  data: {
    settings: OrganizationSettings;
    members: Member[];
    events: EventItem[];
    registrations: EventRegistration[];
    attendanceSessions: AttendanceSession[];
    attendanceRecords: AttendanceRecord[];
    projects: ProjectItem[];
    activities: ActivityItem[];
    announcements: AnnouncementItem[];
    gallery: GalleryPhoto[];
    officials: OfficialItem[];
    certificates: CertificateItem[];
    notifications: NotificationItem[];
    auditLogs: AuditLogItem[];
  };
}

/**
 * Local Storage Service Provider
 * Provides resilient, type-safe serialization, storage quota handling,
 * error fallbacks, and state snapshots for the entire PAGASA Guimba MIS.
 */
class LocalStorageService {
  private isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__pagasa_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic safe getter with JSON fallback and error recovery
   */
  public getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined || item === '') {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`[LocalStorageService] Error parsing item for key "${key}", falling back to default.`, err);
      return defaultValue;
    }
  }

  /**
   * Generic safe setter with quota error management
   */
  public setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.error(`[LocalStorageService] Failed to set key "${key}". Storage quota may be exceeded.`, err);
      return false;
    }
  }

  /**
   * Safe remover
   */
  public removeItem(key: string): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[LocalStorageService] Error removing key "${key}"`, err);
    }
  }

  /* ==========================================================================
     USER SESSIONS & AUTHENTICATION
     ========================================================================== */

  public saveUserSession(
    user: User | null,
    role: UserRole,
    loginMethod: UserSessionMeta['loginMethod'] = 'credential'
  ): void {
    if (user && role !== 'GUEST') {
      this.setItem(STORAGE_KEYS.USER, user);
      this.setItem(STORAGE_KEYS.ROLE, role);
      const meta: UserSessionMeta = {
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device',
        loginMethod
      };
      this.setItem(STORAGE_KEYS.SESSION_META, meta);
    } else {
      this.clearUserSession();
    }
  }

  public getUserSession(): {
    user: User | null;
    role: UserRole;
    meta: UserSessionMeta | null;
  } {
    const user = this.getItem<User | null>(STORAGE_KEYS.USER, null);
    const role = this.getItem<UserRole>(STORAGE_KEYS.ROLE, 'GUEST');
    const meta = this.getItem<UserSessionMeta | null>(STORAGE_KEYS.SESSION_META, null);

    if (user && user.id && role !== 'GUEST') {
      return { user, role, meta };
    }
    return { user: null, role: 'GUEST', meta: null };
  }

  public touchSession(): void {
    const meta = this.getItem<UserSessionMeta | null>(STORAGE_KEYS.SESSION_META, null);
    if (meta) {
      meta.lastActive = new Date().toISOString();
      this.setItem(STORAGE_KEYS.SESSION_META, meta);
    }
  }

  public clearUserSession(): void {
    this.removeItem(STORAGE_KEYS.USER);
    this.removeItem(STORAGE_KEYS.ROLE);
    this.removeItem(STORAGE_KEYS.SESSION_META);
  }

  /* ==========================================================================
     UI PREFERENCES & THEME
     ========================================================================== */

  public getTheme(): ThemeMode {
    return this.getItem<ThemeMode>(STORAGE_KEYS.THEME, 'light');
  }

  public setTheme(theme: ThemeMode): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  public getColorPalette(): ColorPalette {
    return this.getItem<ColorPalette>(STORAGE_KEYS.PALETTE, 'default');
  }

  public setColorPalette(palette: ColorPalette): void {
    this.setItem(STORAGE_KEYS.PALETTE, palette);
  }

  public getLastActivePage(defaultPage: string = 'home'): string {
    return this.getItem<string>(STORAGE_KEYS.LAST_PAGE, defaultPage);
  }

  public setLastActivePage(page: string): void {
    this.setItem(STORAGE_KEYS.LAST_PAGE, page);
  }

  /* ==========================================================================
     DOMAIN ENTITY PERSISTENCE (INITIAL LOAD & PERSIST)
     ========================================================================== */

  public loadSettings(): OrganizationSettings {
    return this.getItem<OrganizationSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public saveSettings(settings: OrganizationSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  public loadMembers(): Member[] {
    const PURGE_FLAG = 'pagasa_mock_members_purged_v3';
    if (this.isAvailable() && !localStorage.getItem(PURGE_FLAG)) {
      this.setItem(STORAGE_KEYS.MEMBERS, []);
      localStorage.setItem(PURGE_FLAG, 'true');
      return [];
    }

    const stored = this.getItem<Member[]>(STORAGE_KEYS.MEMBERS, []);
    if (!stored || !Array.isArray(stored)) {
      return [];
    }
    // Filter out any legacy mock data IDs and sanitize plain text passwords
    const cleaned = stored
      .filter(m => 
        m && m.id && 
        !['mem-gian', 'mem-fxdgie', 'mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5', 'mem-6', 'mem-7'].includes(m.id)
      )
      .map(m => {
        // Never keep portalPassword in plain text in memory or persistent storage
        if (m.portalPassword) {
          const { portalPassword, ...rest } = m;
          return rest as Member;
        }
        return m;
      });

    if (cleaned.length !== stored.length) {
      this.saveMembers(cleaned);
    }
    return cleaned;
  }

  public saveMembers(members: Member[]): void {
    // Sanitize: strip out any plaintext portalPassword before saving
    const sanitized = (members || []).map(m => {
      if (m && (m as any).portalPassword) {
        const copy = { ...m };
        delete (copy as any).portalPassword;
        return copy;
      }
      return m;
    });
    this.setItem(STORAGE_KEYS.MEMBERS, sanitized);
  }

  public loadAuthAccounts(): AuthAccount[] {
    return this.getItem<AuthAccount[]>(STORAGE_KEYS.AUTH_ACCOUNTS, []);
  }

  public saveAuthAccounts(accounts: AuthAccount[]): void {
    this.setItem(STORAGE_KEYS.AUTH_ACCOUNTS, accounts);
  }

  public loadEvents(): EventItem[] {
    return this.getItem<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }

  public saveEvents(events: EventItem[]): void {
    this.setItem(STORAGE_KEYS.EVENTS, events);
  }

  public loadRegistrations(): EventRegistration[] {
    const defaultRegs: EventRegistration[] = [
      {
        id: 'reg-1',
        eventId: 'evt-1',
        memberId: 'PAGASA-2026-0042',
        memberName: 'Juan Dela Cruz',
        memberEmail: 'juan.delacruz@gmail.com',
        registeredAt: '2026-08-10 10:00 AM',
        status: 'Registered'
      },
      {
        id: 'reg-2',
        eventId: 'evt-1',
        memberId: 'PAGASA-2026-0043',
        memberName: 'Maria Santos',
        memberEmail: 'maria.santos@gmail.com',
        registeredAt: '2026-08-11 02:30 PM',
        status: 'Registered'
      }
    ];
    return this.getItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, defaultRegs);
  }

  public saveRegistrations(registrations: EventRegistration[]): void {
    this.setItem(STORAGE_KEYS.REGISTRATIONS, registrations);
  }

  public loadAttendanceSessions(): AttendanceSession[] {
    return this.getItem<AttendanceSession[]>(STORAGE_KEYS.ATTENDANCE_SESSIONS, INITIAL_SESSIONS);
  }

  public saveAttendanceSessions(sessions: AttendanceSession[]): void {
    this.setItem(STORAGE_KEYS.ATTENDANCE_SESSIONS, sessions);
  }

  public loadAttendanceRecords(): AttendanceRecord[] {
    return this.getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_RECORDS, INITIAL_ATTENDANCE_RECORDS);
  }

  public saveAttendanceRecords(records: AttendanceRecord[]): void {
    this.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, records);
  }

  public loadProjects(): ProjectItem[] {
    return this.getItem<ProjectItem[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  public saveProjects(projects: ProjectItem[]): void {
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  public loadActivities(): ActivityItem[] {
    return this.getItem<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }

  public saveActivities(activities: ActivityItem[]): void {
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  }

  public loadAnnouncements(): AnnouncementItem[] {
    return this.getItem<AnnouncementItem[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  public saveAnnouncements(announcements: AnnouncementItem[]): void {
    this.setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  public loadGallery(): GalleryPhoto[] {
    return this.getItem<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }

  public saveGallery(gallery: GalleryPhoto[]): void {
    this.setItem(STORAGE_KEYS.GALLERY, gallery);
  }

  public loadOfficials(): OfficialItem[] {
    return this.getItem<OfficialItem[]>(STORAGE_KEYS.OFFICIALS, INITIAL_OFFICIALS);
  }

  public saveOfficials(officials: OfficialItem[]): void {
    this.setItem(STORAGE_KEYS.OFFICIALS, officials);
  }

  public loadCertificates(): CertificateItem[] {
    return this.getItem<CertificateItem[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  }

  public saveCertificates(certificates: CertificateItem[]): void {
    this.setItem(STORAGE_KEYS.CERTIFICATES, certificates);
  }

  public loadNotifications(): NotificationItem[] {
    return this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public saveNotifications(notifications: NotificationItem[]): void {
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  public loadAuditLogs(): AuditLogItem[] {
    return this.getItem<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public saveAuditLogs(auditLogs: AuditLogItem[]): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  }

  /* ==========================================================================
     BACKUP, SNAPSHOT & FACTORY RESET
     ========================================================================== */

  public createFullSnapshot(): StorageSnapshot {
    return {
      version: CURRENT_STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      appName: 'PAGASA Guimba Youth Organization MIS',
      data: {
        settings: this.loadSettings(),
        members: this.loadMembers(),
        events: this.loadEvents(),
        registrations: this.loadRegistrations(),
        attendanceSessions: this.loadAttendanceSessions(),
        attendanceRecords: this.loadAttendanceRecords(),
        projects: this.loadProjects(),
        activities: this.loadActivities(),
        announcements: this.loadAnnouncements(),
        gallery: this.loadGallery(),
        officials: this.loadOfficials(),
        certificates: this.loadCertificates(),
        notifications: this.loadNotifications(),
        auditLogs: this.loadAuditLogs()
      }
    };
  }

  public restoreFromSnapshot(snapshot: StorageSnapshot): {
    success: boolean;
    message: string;
    counts?: Record<string, number>;
  } {
    try {
      if (!snapshot || !snapshot.data) {
        return { success: false, message: 'Invalid backup file format.' };
      }

      const { data } = snapshot;

      if (data.settings) this.saveSettings(data.settings);
      if (Array.isArray(data.members)) this.saveMembers(data.members);
      if (Array.isArray(data.events)) this.saveEvents(data.events);
      if (Array.isArray(data.registrations)) this.saveRegistrations(data.registrations);
      if (Array.isArray(data.attendanceSessions)) this.saveAttendanceSessions(data.attendanceSessions);
      if (Array.isArray(data.attendanceRecords)) this.saveAttendanceRecords(data.attendanceRecords);
      if (Array.isArray(data.projects)) this.saveProjects(data.projects);
      if (Array.isArray(data.activities)) this.saveActivities(data.activities);
      if (Array.isArray(data.announcements)) this.saveAnnouncements(data.announcements);
      if (Array.isArray(data.gallery)) this.saveGallery(data.gallery);
      if (Array.isArray(data.officials)) this.saveOfficials(data.officials);
      if (Array.isArray(data.certificates)) this.saveCertificates(data.certificates);
      if (Array.isArray(data.notifications)) this.saveNotifications(data.notifications);
      if (Array.isArray(data.auditLogs)) this.saveAuditLogs(data.auditLogs);

      const counts = {
        members: data.members?.length || 0,
        events: data.events?.length || 0,
        attendanceRecords: data.attendanceRecords?.length || 0,
        projects: data.projects?.length || 0,
        certificates: data.certificates?.length || 0
      };

      return {
        success: true,
        message: 'Snapshot restored successfully.',
        counts
      };
    } catch (err: any) {
      console.error('[LocalStorageService] Failed to restore snapshot:', err);
      return {
        success: false,
        message: err?.message || 'Error parsing and restoring snapshot data.'
      };
    }
  }

  public resetAllToFactoryDefaults(): void {
    if (!this.isAvailable()) return;
    
    // Clear all pagasa keys
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });

    // Re-seed initial data
    this.saveSettings(INITIAL_SETTINGS);
    this.saveMembers([]);
    this.saveEvents(INITIAL_EVENTS);
    this.saveAttendanceSessions(INITIAL_SESSIONS);
    this.saveAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    this.saveProjects(INITIAL_PROJECTS);
    this.saveActivities(INITIAL_ACTIVITIES);
    this.saveAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.saveGallery(INITIAL_GALLERY);
    this.saveOfficials(INITIAL_OFFICIALS);
    this.saveCertificates(INITIAL_CERTIFICATES);
    this.saveNotifications(INITIAL_NOTIFICATIONS);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
    this.setTheme('light');
    this.setColorPalette('default');
  }

  public getStorageMetrics(): {
    usedBytes: number;
    formattedSize: string;
    itemCounts: Record<string, number>;
  } {
    if (!this.isAvailable()) {
      return { usedBytes: 0, formattedSize: '0 KB', itemCounts: {} };
    }

    let totalBytes = 0;
    const itemCounts: Record<string, number> = {};

    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith('pagasa_')) {
        const val = window.localStorage.getItem(key) || '';
        totalBytes += key.length + val.length;
        
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            itemCounts[key.replace('pagasa_', '')] = parsed.length;
          }
        } catch {
          // not array
        }
      }
    }

    const kb = (totalBytes / 1024).toFixed(2);
    return {
      usedBytes: totalBytes,
      formattedSize: `${kb} KB`,
      itemCounts
    };
  }
}

export const storageService = new LocalStorageService();
