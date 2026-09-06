export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER' | 'GUEST';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorPalette = 'default' | 'emerald' | 'purple' | 'sunset' | 'ocean' | 'high-contrast';

export type MembershipStatus = 'Active' | 'Pending' | 'Inactive' | 'Suspended' | 'Disabled' | 'Rejected';

export type PortalAccessStatus = 'Enabled' | 'Disabled';

export interface AuthAccount {
  id: string;
  memberId: string;
  username: string;
  email: string;
  passwordHash: string;
  accountStatus: MembershipStatus;
  portalAccess: PortalAccessStatus;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type CredentialStatus = 
  | 'Pending Credentials' 
  | 'Credentials Not Assigned' 
  | 'Credentials Sent' 
  | 'Active' 
  | 'Disabled' 
  | 'Email Delivery Failed';

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export type ProjectStatus = 'Planning' | 'Ongoing' | 'Completed' | 'Cancelled';

export type AnnouncementCategory = 
  | 'General'
  | 'Events'
  | 'Meetings'
  | 'Volunteer Opportunities'
  | 'Important Notice'
  | 'Training'
  | 'Emergency';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  memberId?: string;
}

export interface Member {
  id: string;
  memberId: string; // e.g. "PAGASA-2026-001"
  fullName: string;
  email: string;
  contactNumber: string;
  birthdate: string;
  age: number;
  gender: 'Male' | 'Female' | 'Prefer not to say' | 'Other';
  address: string;
  barangay: string; // e.g. "San Roque", "Saranay", "Cabaruan", etc.
  educationalStatus: 'High School' | 'Senior High' | 'College / University' | 'Vocational / TVET' | 'Out of School Youth' | 'Employed Professional' | 'Other';
  occupation: string;
  profilePicture: string;
  membershipDate: string;
  membershipStatus: MembershipStatus;
  portalAccess?: PortalAccessStatus;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  organizationPosition?: string;
  committee?: string;
  username?: string;
  portalPassword?: string;
  passwordHash?: string;
  credentialStatus?: CredentialStatus;
  credentialsAssignedAt?: string;
  emailDeliveryStatus?: 'Delivered' | 'Pending' | 'Failed';
  emailDeliveryError?: string;
  emailDeliveryDate?: string;
  mustChangePassword?: boolean;
  lastLoginAt?: string;
  isAccessDisabled?: boolean;
  gmailAccessEnabled?: boolean;
  portalAccessRole?: 'MEMBER' | 'ADMIN' | 'COORDINATOR';
  dateJoined?: string;
  qrCode?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  registeredEventIds?: string[];
  stats: {
    eventsJoined: number;
    totalAttendance: number;
    attendanceRate: number; // percentage e.g. 92
    volunteerHours: number;
    projectsParticipated: number;
    certificatesEarned: number;
  };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  registeredAt: string;
  status: 'Registered' | 'Cancelled' | 'Attended';
  notes?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  bannerImage: string;
  date: string;
  time: string;
  location: string;
  venue?: string;
  organizer: string;
  description: string;
  objectives?: string[];
  requirements?: string[];
  maxParticipants: number;
  maxCapacity?: number;
  currentParticipants: number;
  registeredCount?: number;
  registrationDeadline?: string;
  registrationEnabled?: boolean;
  isRegistrationOpen?: boolean;
  status: EventStatus;
  isPublished: boolean;
  qrCodeSecret?: string;
  createdAt?: string;
  speakers?: { name: string; title: string; avatar?: string }[];
  agenda?: { time: string; title: string }[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  eventId: string;
  eventTitle: string;
  memberId: string;
  memberName: string;
  memberBarangay: string;
  checkInTime: string;
  date: string;
  status: AttendanceStatus;
  method: 'QR_SCAN' | 'MANUAL' | 'SEARCH';
  recordedBy: string;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isOpen: boolean;
  qrCodeValue: string;
  totalRegistered: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  attendanceRate: number;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  objectives?: string[];
  deliverables?: string[];
  startDate: string;
  endDate?: string;
  location?: string;
  projectLeader: string;
  targetBeneficiaries?: string;
  budget?: string;
  participantsCount: number;
  progress?: number;
  status: ProjectStatus;
  results?: string;
  gallery?: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'Seminars' | 'Workshops' | 'Sports' | 'Outreach' | 'Volunteer' | 'Meetings' | 'Training';
  date: string;
  time: string;
  location: string;
  leader: string;
  description: string;
  targetParticipants: number;
  status: 'Upcoming' | 'Completed' | 'Ongoing';
  attendanceTracked: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: AnnouncementCategory;
  date: string;
  author: string;
  authorRole: string;
  featuredImage: string;
  summary: string;
  content: string;
  isPublished: boolean;
  isPinned: boolean;
  views: number;
}

export interface OfficialItem {
  id: string;
  fullName: string;
  name?: string;
  position: string;
  committee: string;
  barangay?: string;
  rank?: number;
  order?: number;
  profilePicture: string;
  image?: string;
  bio: string;
  term: string; // e.g. "2025 - 2027"
  contactEmail?: string;
  email?: string;
  contactNumber?: string;
  facebookUrl?: string;
}

export interface CertificateItem {
  id: string;
  certificateNumber: string; // e.g. "CERT-PAGASA-2026-089"
  memberId: string;
  memberName: string;
  eventOrActivityTitle: string;
  certificateType: 'Leadership' | 'Participation' | 'Excellence' | 'Volunteerism' | 'Special Recognition';
  issueDate: string;
  organization: string;
  signatories: {
    name: string;
    position: string;
  }[];
  description: string;
  qrVerificationUrl: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // target user or undefined for all
  title: string;
  message: string;
  type: 'event' | 'attendance' | 'certificate' | 'announcement' | 'system';
  createdAt: string;
  isRead: boolean;
  linkAction?: string;
}

export interface AuditLogItem {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: 'Events' | 'Attendance' | 'Members' | 'Announcements' | 'Projects' | 'Certificates' | 'Settings' | 'Gallery' | 'Officials' | 'Activities';
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  caption?: string;
  description?: string;
  eventTag?: string;
  eventTitle?: string;
}

export type Project = ProjectItem;
export type Announcement = AnnouncementItem;
export type Official = OfficialItem;
export type GalleryItem = GalleryPhoto;

export interface OrganizationSettings {
  orgName: string;
  acronym?: string;
  tagline: string;
  subTagline?: string;
  logoUrl?: string;
  address: string;
  municipalHall?: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  socialLinks?: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  registrationAutoApproval?: boolean;
  qrExpiryMinutes?: number;
  lateGracePeriodMinutes?: number;
  allowPublicEventRegistration?: boolean;
  defaultTheme?: ThemeMode;
  defaultPalette?: ColorPalette;
}
