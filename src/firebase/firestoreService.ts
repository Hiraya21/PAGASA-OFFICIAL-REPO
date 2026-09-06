import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Unsubscribe
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, googleProvider, testConnection } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { setGmailAccessToken } from '../services/gmailService';
import {
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
  User
} from '../types';

export { auth, testConnection };

// --- Authentication Helpers ---

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const email = fbUser.email || '';
    const trimmedEmail = email.toLowerCase().trim();
    
    // Extract and cache OAuth access token for Gmail API
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      setGmailAccessToken(credential.accessToken, email);
    }

    const isSuperAdmin = trimmedEmail === 'morangian31@gmail.com' ||
                         trimmedEmail === 'giancarlomagat19@gmail.com' || 
                         trimmedEmail === 'giancarlomagat2104@gmail.com' || 
                         trimmedEmail.includes('admin');

    const displayName = fbUser.displayName || email.split('@')[0] || 'Youth Member';

    return {
      id: fbUser.uid,
      name: displayName,
      email: email,
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`,
      role: isSuperAdmin ? 'SUPER_ADMIN' : 'MEMBER'
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'auth/google-signin');
    return null;
  }
}

export async function signOutFirebase(): Promise<void> {
  try {
    setGmailAccessToken(null, null);
    await signOut(auth);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'auth/signout');
  }
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// --- Firestore CRUD Operations with Real-time Listeners ---

// 1. Settings
export function subscribeToSettings(onData: (data: OrganizationSettings | null) => void): Unsubscribe {
  const docRef = doc(db, 'settings', 'organization');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as OrganizationSettings);
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/organization');
    }
  );
}

export async function saveSettingsDoc(settings: OrganizationSettings): Promise<void> {
  const path = 'settings/organization';
  try {
    await setDoc(doc(db, 'settings', 'organization'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. Members
export function subscribeToMembers(onData: (members: Member[]) => void): Unsubscribe {
  const colRef = collection(db, 'members');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Member[] = [];
      snapshot.forEach((d) => list.push(d.data() as Member));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'members');
    }
  );
}

export async function getMembersFromFirestore(): Promise<Member[]> {
  const colRef = collection(db, 'members');
  try {
    const snapshot = await getDocs(colRef);
    const list: Member[] = [];
    snapshot.forEach((d) => list.push(d.data() as Member));
    return list;
  } catch (error) {
    console.warn('Firestore fetch members offline or error:', error);
    return [];
  }
}

export async function saveMemberDoc(member: Member): Promise<void> {
  const path = `members/${member.id}`;
  try {
    await setDoc(doc(db, 'members', member.id), member, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberDoc(memberId: string): Promise<void> {
  const path = `members/${memberId}`;
  try {
    await deleteDoc(doc(db, 'members', memberId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Events
export function subscribeToEvents(onData: (events: EventItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'events');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: EventItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as EventItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'events');
    }
  );
}

export async function saveEventDoc(event: EventItem): Promise<void> {
  const path = `events/${event.id}`;
  try {
    await setDoc(doc(db, 'events', event.id), event, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteEventDoc(eventId: string): Promise<void> {
  const path = `events/${eventId}`;
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Registrations
export function subscribeToRegistrations(onData: (regs: EventRegistration[]) => void): Unsubscribe {
  const colRef = collection(db, 'registrations');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: EventRegistration[] = [];
      snapshot.forEach((d) => list.push(d.data() as EventRegistration));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'registrations');
    }
  );
}

export async function saveRegistrationDoc(reg: EventRegistration): Promise<void> {
  const path = `registrations/${reg.id}`;
  try {
    await setDoc(doc(db, 'registrations', reg.id), reg, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRegistrationDoc(regId: string): Promise<void> {
  const path = `registrations/${regId}`;
  try {
    await deleteDoc(doc(db, 'registrations', regId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. Attendance Sessions
export function subscribeToAttendanceSessions(onData: (sessions: AttendanceSession[]) => void): Unsubscribe {
  const colRef = collection(db, 'attendanceSessions');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AttendanceSession[] = [];
      snapshot.forEach((d) => list.push(d.data() as AttendanceSession));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'attendanceSessions');
    }
  );
}

export async function saveAttendanceSessionDoc(session: AttendanceSession): Promise<void> {
  const path = `attendanceSessions/${session.id}`;
  try {
    await setDoc(doc(db, 'attendanceSessions', session.id), session, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. Attendance Records
export function subscribeToAttendanceRecords(onData: (records: AttendanceRecord[]) => void): Unsubscribe {
  const colRef = collection(db, 'attendanceRecords');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AttendanceRecord[] = [];
      snapshot.forEach((d) => list.push(d.data() as AttendanceRecord));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'attendanceRecords');
    }
  );
}

export async function saveAttendanceRecordDoc(record: AttendanceRecord): Promise<void> {
  const path = `attendanceRecords/${record.id}`;
  try {
    await setDoc(doc(db, 'attendanceRecords', record.id), record, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAttendanceRecordDoc(recordId: string): Promise<void> {
  const path = `attendanceRecords/${recordId}`;
  try {
    await deleteDoc(doc(db, 'attendanceRecords', recordId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 7. Projects
export function subscribeToProjects(onData: (projects: ProjectItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'projects');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ProjectItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as ProjectItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    }
  );
}

export async function saveProjectDoc(project: ProjectItem): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    await setDoc(doc(db, 'projects', project.id), project, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProjectDoc(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 8. Activities
export function subscribeToActivities(onData: (activities: ActivityItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'activities');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ActivityItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as ActivityItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activities');
    }
  );
}

export async function saveActivityDoc(activity: ActivityItem): Promise<void> {
  const path = `activities/${activity.id}`;
  try {
    await setDoc(doc(db, 'activities', activity.id), activity, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteActivityDoc(activityId: string): Promise<void> {
  const path = `activities/${activityId}`;
  try {
    await deleteDoc(doc(db, 'activities', activityId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 9. Announcements
export function subscribeToAnnouncements(onData: (announcements: AnnouncementItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'announcements');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AnnouncementItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as AnnouncementItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'announcements');
    }
  );
}

export async function saveAnnouncementDoc(item: AnnouncementItem): Promise<void> {
  const path = `announcements/${item.id}`;
  try {
    await setDoc(doc(db, 'announcements', item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncementDoc(announcementId: string): Promise<void> {
  const path = `announcements/${announcementId}`;
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10. Officials
export function subscribeToOfficials(onData: (officials: OfficialItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'officials');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: OfficialItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as OfficialItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'officials');
    }
  );
}

export async function saveOfficialDoc(official: OfficialItem): Promise<void> {
  const path = `officials/${official.id}`;
  try {
    await setDoc(doc(db, 'officials', official.id), official, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteOfficialDoc(officialId: string): Promise<void> {
  const path = `officials/${officialId}`;
  try {
    await deleteDoc(doc(db, 'officials', officialId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 11. Certificates
export function subscribeToCertificates(onData: (certs: CertificateItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'certificates');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: CertificateItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as CertificateItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'certificates');
    }
  );
}

export async function saveCertificateDoc(cert: CertificateItem): Promise<void> {
  const path = `certificates/${cert.id}`;
  try {
    await setDoc(doc(db, 'certificates', cert.id), cert, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCertificateDoc(certId: string): Promise<void> {
  const path = `certificates/${certId}`;
  try {
    await deleteDoc(doc(db, 'certificates', certId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 12. Gallery
export function subscribeToGallery(onData: (gallery: GalleryPhoto[]) => void): Unsubscribe {
  const colRef = collection(db, 'gallery');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: GalleryPhoto[] = [];
      snapshot.forEach((d) => list.push(d.data() as GalleryPhoto));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    }
  );
}

export async function saveGalleryDoc(photo: GalleryPhoto): Promise<void> {
  const path = `gallery/${photo.id}`;
  try {
    await setDoc(doc(db, 'gallery', photo.id), photo, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGalleryDoc(photoId: string): Promise<void> {
  const path = `gallery/${photoId}`;
  try {
    await deleteDoc(doc(db, 'gallery', photoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 13. Notifications
export function subscribeToNotifications(onData: (notifs: NotificationItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'notifications');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: NotificationItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as NotificationItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    }
  );
}

export async function saveNotificationDoc(notif: NotificationItem): Promise<void> {
  const path = `notifications/${notif.id}`;
  try {
    await setDoc(doc(db, 'notifications', notif.id), notif, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 14. Audit Logs
export function subscribeToAuditLogs(onData: (logs: AuditLogItem[]) => void): Unsubscribe {
  const colRef = collection(db, 'auditLogs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AuditLogItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as AuditLogItem));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'auditLogs');
    }
  );
}

export async function saveAuditLogDoc(log: AuditLogItem): Promise<void> {
  const path = `auditLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'auditLogs', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
