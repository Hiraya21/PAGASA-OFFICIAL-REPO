import { 
  Member, 
  EventItem, 
  AttendanceRecord, 
  AttendanceSession, 
  ProjectItem, 
  ActivityItem, 
  AnnouncementItem, 
  OfficialItem, 
  CertificateItem, 
  GalleryPhoto, 
  OrganizationSettings,
  AuditLogItem,
  NotificationItem,
  User
} from '../types/index.ts';

export const GUIMBA_BARANGAYS = [
  'Ayos Lomboy',
  'Bacayao',
  'Bagong Barrio',
  'Balbalino',
  'Bantug',
  'Banitan',
  'Bunol',
  'Caballero',
  'Cabaruan',
  'Caaniplahan',
  'Calem',
  'Camiing',
  'Cardinal',
  'Casongsong',
  'Catimon',
  'Cavite',
  'Cawayan Bugtong',
  'Consuelo',
  'Culong',
  'Faigal',
  'Galvan',
  'Guiset',
  'Lamorito',
  'Lennec',
  'Macamias',
  'Macatcatling',
  'Manacsac',
  'Manggang Marikit',
  'Manggahan',
  'Mataranoc',
  'Naglabrahan',
  'Nagpandayan',
  'Narvacan I',
  'Narvacan II',
  'Pacac',
  'Partida I',
  'Partida II',
  'Pasong Intsik',
  'Saint John District (Poblacion)',
  'San Agustin',
  'San Andres',
  'San Bernardino',
  'San Marcelino',
  'San Miguel',
  'San Rafael',
  'San Roque',
  'Santa Ana',
  'Santa Cruz',
  'Santa Lucia',
  'Santa Veronica District (Poblacion)',
  'Santo Cristo District (Poblacion)',
  'Saranay District (Poblacion)',
  'Sinulatan',
  'Subol',
  'Tampac I',
  'Tampac II & III',
  'Triala',
  'Yuson'
];

export const INITIAL_SETTINGS: OrganizationSettings = {
  orgName: 'PAGASA GUIMBA YOUTH ORGANIZATION',
  tagline: 'Kabataan. Pagkakaisa. Pag-asa.',
  subTagline: "Empowering Guimba's Youth, Building a Better Tomorrow.",
  logoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80',
  address: 'Guimba Youth Center, Municipal Compound, Guimba, Nueva Ecija 3115',
  municipalHall: 'Guimba Municipal Hall, Nueva Ecija, Philippines',
  email: 'morangian31@gmail.com',
  phone: '+63 917 554 8920 / (044) 958 1234',
  socialLinks: {
    facebook: 'https://facebook.com/pagasaguimbayouth',
    instagram: 'https://instagram.com/pagasaguimbayouth',
    youtube: 'https://youtube.com/@pagasaguimbayouth'
  },
  registrationAutoApproval: false,
  qrExpiryMinutes: 120,
  lateGracePeriodMinutes: 30,
  allowPublicEventRegistration: true
};

export const ADMIN_MASTER_CREDENTIALS = {
  username: 'PAGASA_ADMIN',
  email: 'admin@pagasaguimba.org',
  password: 'TayoAngPagasa2026',
  displayName: 'Gian Carlo Magat (PAGASA Admin)'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Gian Carlo Magat',
    email: 'admin@pagasaguimba.org',
    role: 'SUPER_ADMIN',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9',
    memberId: 'PAGASA-2025-001'
  }
];

export const INITIAL_OFFICIALS: OfficialItem[] = [
  {
    id: 'off-1',
    fullName: 'Gian Carlo Magat',
    position: 'President',
    committee: 'Executive Board',
    barangay: 'Saranay District (Poblacion)',
    rank: 1,
    profilePicture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Carlos&backgroundColor=d1d4f9,c0aede',
    bio: 'Passionate youth leader committed to grassroot youth empowerment, digital public systems, and youth welfare in Guimba.',
    term: '2025 – 2027',
    contactEmail: 'gian.president@pagasaguimba.org'
  },
  {
    id: 'off-2',
    fullName: 'Alyssa Nicole Valenzuela',
    position: 'Vice President',
    committee: 'Executive Board',
    barangay: 'San Roque',
    rank: 2,
    profilePicture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Elena&backgroundColor=b6e3f4,ffd5dc',
    bio: 'Advocate for youth education, community outreach, and mental health awareness programs across all 64 barangays.',
    term: '2025 – 2027',
    contactEmail: 'alyssa.vp@pagasaguimba.org'
  },
  {
    id: 'off-3',
    fullName: 'Mark Christian Domingo',
    position: 'Secretary-General',
    committee: 'Secretariat & Records',
    barangay: 'Triala',
    rank: 3,
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor&backgroundColor=b6e3f4,d1d4f9',
    bio: 'Oversees documentation, official notices, membership registry, and municipal resolutions coordination.',
    term: '2025 – 2027',
    contactEmail: 'mark.sec@pagasaguimba.org'
  },
  {
    id: 'off-4',
    fullName: 'Kristine Mae Bautista',
    position: 'Treasurer',
    committee: 'Finance & Resource Mobilization',
    barangay: 'Santa Veronica District (Poblacion)',
    rank: 4,
    profilePicture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Bea&backgroundColor=ffdfbf,ffd5dc',
    bio: 'Accountancy graduate managing project allocations, donation drives, and financial transparency reports.',
    term: '2025 – 2027',
    contactEmail: 'kristine.treasurer@pagasaguimba.org'
  },
  {
    id: 'off-5',
    fullName: 'John Carlo Rivera',
    position: 'Auditor',
    committee: 'Audit & Accountability',
    barangay: 'Cabaruan',
    rank: 5,
    profilePicture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Gabriel&backgroundColor=c0aede,b6e3f4',
    bio: 'Ensures strict compliance with organization by-laws, inventory audits, and transparency standards.',
    term: '2025 – 2027'
  },
  {
    id: 'off-6',
    fullName: 'Camille Joy Ramos',
    position: 'Public Information Officer (PIO)',
    committee: 'Media & Public Relations',
    barangay: 'Santo Cristo District (Poblacion)',
    rank: 6,
    profilePicture: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jasmine&backgroundColor=ffd5dc,d1d4f9',
    bio: 'Directs digital media campaigns, press releases, social channels, and public advisories.',
    term: '2025 – 2027'
  },
  {
    id: 'off-7',
    fullName: 'Kevin Kyle Mendoza',
    position: 'Peace & Safety Officer',
    committee: 'Disaster Risk & Youth Safety',
    barangay: 'Lennec',
    rank: 7,
    profilePicture: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kai&backgroundColor=ffd5dc,c0aede',
    bio: 'Leads crowd safety protocols during youth sports leagues, large-scale assemblies, and disaster drills.',
    term: '2025 – 2027'
  },
  {
    id: 'off-8',
    fullName: 'Bea Patricia Francisco',
    position: 'Head, Committee on Youth Education & Skills',
    committee: 'Education & TVET',
    barangay: 'Banitan',
    rank: 8,
    profilePicture: 'https://api.dicebear.com/7.x/notionists/svg?seed=Nicole&backgroundColor=fce7f3,dbeafe',
    bio: 'Coordinates free review classes, digital literacy bootcamps, and scholarship recommendations.',
    term: '2025 – 2027'
  },
  {
    id: 'off-9',
    fullName: 'Joshua David Tolentino',
    position: 'Head, Committee on Sports & Wellness',
    committee: 'Sports Development',
    barangay: 'Macatcatling',
    rank: 9,
    profilePicture: 'https://api.dicebear.com/7.x/notionists/svg?seed=Enzo&backgroundColor=ecfdf5,fef3c7',
    bio: 'Oversees inter-barangay basketball, volleyball tournaments, and youth fitness programs.',
    term: '2025 – 2027'
  },
  {
    id: 'off-10',
    fullName: 'Rochelle Ann Soriano',
    position: 'Barangay Cluster Coordinator (Poblacion & East)',
    committee: 'Barangay Relations',
    barangay: 'San Agustin',
    rank: 10,
    profilePicture: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophia&backgroundColor=dbeafe,ecfdf5',
    bio: 'Coordinates youth volunteers across Santa Veronica, Saranay, San Roque, and Triala districts.',
    term: '2025 – 2027'
  }
];

export const INITIAL_MEMBERS: Member[] = [];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Guimba Youth Leadership Summit 2026',
    category: 'Leadership Seminar',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    date: '2026-09-15',
    time: '8:00 AM – 5:00 PM',
    location: 'Guimba Municipal Gymnasium, Guimba, Nueva Ecija',
    organizer: 'PAGASA Guimba Youth Executive Board & LGU Guimba',
    description: 'A transformative whole-day summit bringing together youth leaders from all 64 barangays of Guimba to discuss participatory governance, community project design, public speaking, and youth civic engagement.',
    objectives: [
      'Equip 150+ youth delegates with modern leadership and advocacy skills',
      'Foster collaboration between SK councils, school youth organizations, and community groups',
      'Formulate actionable 2026-2027 youth community development proposals',
      'Recognize outstanding youth initiatives and community leaders'
    ],
    requirements: [
      'Valid Member ID / Student ID / Government ID',
      'Casual smart or organization shirt',
      'Notebook and writing materials',
      'Personal water tumbler (eco-friendly event)'
    ],
    maxParticipants: 150,
    currentParticipants: 118,
    registrationDeadline: '2026-09-12',
    registrationEnabled: true,
    status: 'Upcoming',
    isPublished: true,
    qrCodeSecret: 'EVT-PAGASA-YLS-2026-GUIMBA',
    createdAt: '2026-08-01'
  },
  {
    id: 'evt-2',
    title: 'Digital Skills & AI Literacy Bootcamp',
    category: 'Skills Workshop',
    bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    date: '2026-09-26',
    time: '1:00 PM – 5:30 PM',
    location: 'Guimba Community E-Center & Function Hall',
    organizer: 'Committee on Youth Education & DICT Provincial Office',
    description: 'Hands-on practical workshop covering essential modern digital tools, generative AI for study and work, cybersecurity basics, and freelance digital career pathways for Guimba youth.',
    objectives: [
      'Teach foundational prompt engineering and digital collaboration tools',
      'Guide students in ethical AI use for academic research and portfolio building',
      'Provide practical resume building and online freelance opportunities'
    ],
    requirements: [
      'Laptop or tablet (limited desktop units available upon request)',
      'Active Google Account',
      'PAGASA Guimba member account'
    ],
    maxParticipants: 60,
    currentParticipants: 54,
    registrationDeadline: '2026-09-24',
    registrationEnabled: true,
    status: 'Upcoming',
    isPublished: true,
    qrCodeSecret: 'EVT-PAGASA-AI-BOOTCAMP-2026',
    createdAt: '2026-08-10'
  },
  {
    id: 'evt-3',
    title: 'Tulong Kabataan: Inter-Barangay River & Tree Planting Caravan',
    category: 'Environmental Activity',
    bannerImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    date: '2026-10-04',
    time: '6:00 AM – 11:30 AM',
    location: 'Triala – San Roque Riverbanks, Guimba',
    organizer: 'Committee on Environment & MENRO Guimba',
    description: 'Community-wide environmental drive planting 500 fruit-bearing and bamboo seedlings along riverbanks to prevent soil erosion and conducting a waste clean-up audit.',
    objectives: [
      'Plant 500 seedlings along vulnerable embankment areas',
      'Collect and segregate recyclable plastics for eco-brick projects',
      'Educate youth volunteers on solid waste management'
    ],
    requirements: [
      'Comfortable outdoor working clothes & boots/rubber shoes',
      'Gardening gloves (if available)',
      'Hydration pack / water container'
    ],
    maxParticipants: 100,
    currentParticipants: 82,
    registrationDeadline: '2026-10-02',
    registrationEnabled: true,
    status: 'Upcoming',
    isPublished: true,
    qrCodeSecret: 'EVT-PAGASA-GREEN-TREE-2026',
    createdAt: '2026-08-15'
  },
  {
    id: 'evt-4',
    title: 'PAGASA Inter-Barangay Youth Sports Fest 2026',
    category: 'Sports & Wellness',
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-20',
    time: '8:00 AM – 6:00 PM',
    location: 'Guimba Municipal Plaza & Gymnasium',
    organizer: 'Committee on Sports & Wellness',
    description: 'An exciting annual youth sports festival featuring basketball 3x3, volleyball tournaments, badminton, chess, and esports exhibition matches fostering sportsmanship.',
    objectives: [
      'Promote healthy active lifestyles and drug-free youth living',
      'Strengthen camaraderie among youth from different barangays',
      'Discover promising athletic talents for municipal delegations'
    ],
    requirements: [
      'Barangay Youth endorsement / ID',
      'Sports attire appropriate for chosen sport'
    ],
    maxParticipants: 200,
    currentParticipants: 194,
    registrationDeadline: '2026-08-15',
    registrationEnabled: false,
    status: 'Completed',
    isPublished: true,
    qrCodeSecret: 'EVT-PAGASA-SPORTSFEST-2026',
    createdAt: '2026-07-10'
  },
  {
    id: 'evt-5',
    title: 'Emergency First-Aid & Disaster Preparedness Seminar',
    category: 'Training & Safety',
    bannerImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    date: '2026-07-18',
    time: '8:30 AM – 4:00 PM',
    location: 'Guimba MDRRMO Training Center',
    organizer: 'Committee on Disaster Risk & MDRRMO Guimba',
    description: 'Certified basic life support, bandaging techniques, CPR demonstration, and household flood safety protocols conducted in partnership with MDRRMO and Red Cross.',
    objectives: [
      'Certify 80 youth first-responders in basic life support',
      'Conduct practical earthquake and flash flood response simulation',
      'Distribute emergency youth responder badges and kits'
    ],
    requirements: [
      'Physical fitness for CPR simulation exercises',
      'Valid member credentials'
    ],
    maxParticipants: 80,
    currentParticipants: 80,
    registrationDeadline: '2026-07-14',
    registrationEnabled: false,
    status: 'Completed',
    isPublished: true,
    qrCodeSecret: 'EVT-PAGASA-MDRRMO-2026',
    createdAt: '2026-06-20'
  }
];

export const INITIAL_SESSIONS: AttendanceSession[] = [
  {
    id: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    date: '2026-09-15',
    startTime: '8:00 AM',
    endTime: '5:00 PM',
    location: 'Guimba Municipal Gymnasium',
    isOpen: true,
    qrCodeValue: 'PAGASA-ATTEND-EVT-1-KEY2026',
    totalRegistered: 118,
    presentCount: 94,
    lateCount: 8,
    absentCount: 12,
    excusedCount: 4,
    attendanceRate: 86.4,
    createdAt: '2026-09-15T07:30:00Z'
  },
  {
    id: 'ses-2',
    eventId: 'evt-4',
    eventTitle: 'PAGASA Inter-Barangay Youth Sports Fest 2026',
    date: '2026-08-20',
    startTime: '8:00 AM',
    endTime: '6:00 PM',
    location: 'Guimba Municipal Plaza & Gymnasium',
    isOpen: false,
    qrCodeValue: 'PAGASA-ATTEND-EVT-4-KEY2026',
    totalRegistered: 194,
    presentCount: 182,
    lateCount: 8,
    absentCount: 4,
    excusedCount: 0,
    attendanceRate: 97.9,
    createdAt: '2026-08-20T07:30:00Z'
  },
  {
    id: 'ses-3',
    eventId: 'evt-5',
    eventTitle: 'Emergency First-Aid & Disaster Preparedness Seminar',
    date: '2026-07-18',
    startTime: '8:30 AM',
    endTime: '4:00 PM',
    location: 'Guimba MDRRMO Training Center',
    isOpen: false,
    qrCodeValue: 'PAGASA-ATTEND-EVT-5-KEY2026',
    totalRegistered: 80,
    presentCount: 76,
    lateCount: 2,
    absentCount: 2,
    excusedCount: 0,
    attendanceRate: 97.5,
    createdAt: '2026-07-18T08:00:00Z'
  }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec-1',
    sessionId: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    memberId: 'PAGASA-2026-0042',
    memberName: 'Juan Dela Cruz',
    memberBarangay: 'Saranay District (Poblacion)',
    checkInTime: '8:03 AM',
    date: '2026-09-15',
    status: 'Present',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 1'
  },
  {
    id: 'rec-2',
    sessionId: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    memberId: 'PAGASA-2026-0043',
    memberName: 'Maria Santos',
    memberBarangay: 'San Roque',
    checkInTime: '8:21 AM',
    date: '2026-09-15',
    status: 'Late',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 1',
    remarks: 'Arrived at 8:21 AM due to heavy rain'
  },
  {
    id: 'rec-3',
    sessionId: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    memberId: 'PAGASA-2026-0044',
    memberName: 'Angelo Gabriel Pascual',
    memberBarangay: 'Triala',
    checkInTime: '7:55 AM',
    date: '2026-09-15',
    status: 'Present',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 2'
  },
  {
    id: 'rec-4',
    sessionId: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    memberId: 'PAGASA-2026-0045',
    memberName: 'Hazel Grace Fernandez',
    memberBarangay: 'Santa Veronica District (Poblacion)',
    checkInTime: '8:05 AM',
    date: '2026-09-15',
    status: 'Present',
    method: 'MANUAL',
    recordedBy: 'Camille Joy Ramos (Staff)'
  },
  {
    id: 'rec-5',
    sessionId: 'ses-1',
    eventId: 'evt-1',
    eventTitle: 'Guimba Youth Leadership Summit 2026',
    memberId: 'PAGASA-2026-0046',
    memberName: 'Jerome Castillo',
    memberBarangay: 'Cabaruan',
    checkInTime: '8:35 AM',
    date: '2026-09-15',
    status: 'Late',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 1'
  },
  {
    id: 'rec-6',
    sessionId: 'ses-2',
    eventId: 'evt-4',
    eventTitle: 'PAGASA Inter-Barangay Youth Sports Fest 2026',
    memberId: 'PAGASA-2026-0042',
    memberName: 'Juan Dela Cruz',
    memberBarangay: 'Saranay District (Poblacion)',
    checkInTime: '7:48 AM',
    date: '2026-08-20',
    status: 'Present',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 1'
  },
  {
    id: 'rec-7',
    sessionId: 'ses-2',
    eventId: 'evt-4',
    eventTitle: 'PAGASA Inter-Barangay Youth Sports Fest 2026',
    memberId: 'PAGASA-2026-0043',
    memberName: 'Maria Santos',
    memberBarangay: 'San Roque',
    checkInTime: '7:52 AM',
    date: '2026-08-20',
    status: 'Present',
    method: 'QR_SCAN',
    recordedBy: 'QR Scanner Station 1'
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'prj-1',
    title: 'Project Dunong: Barangay Mobile Library & Free Tutorial Caravan',
    category: 'Education & Literacy',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    description: 'A mobile community library visiting remote rural barangays of Guimba on weekends, offering free reading materials, math and science tutorials for elementary pupils, and story-telling sessions led by college volunteers.',
    objectives: [
      'Reach 800+ children in 12 remote barangays of Guimba',
      'Distribute over 1,200 donated books and school supply kits',
      'Provide weekly remedial math and English mentoring'
    ],
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    location: 'Cluster Barangays: Banitan, Lennec, Catimon, Culong',
    projectLeader: 'Bea Patricia Francisco',
    targetBeneficiaries: 'Elementary pupils & out-of-school children',
    budget: '₱85,000 (Community Donations & Municipal Grant)',
    participantsCount: 42,
    status: 'Ongoing',
    results: 'Reached 6 barangays, completed 24 tutoring sessions, distributed 650 learning kits.'
  },
  {
    id: 'prj-2',
    title: 'Project Luntiang Guimba: Urban Gardening & Seedling Nursery',
    category: 'Environment & Food Security',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=1000&q=80',
    description: 'Establishing communal organic vegetable gardens and a municipal seedling bank at the Guimba Youth Center to teach youth sustainable agro-tech and provide fresh produce to feeding centers.',
    objectives: [
      'Build 5 model container gardens in high schools',
      'Propagate 2,000 vegetable seed packs for household distribution',
      'Conduct organic composting and hydroponics workshops'
    ],
    startDate: '2026-01-15',
    endDate: '2026-12-15',
    location: 'Guimba Youth Center Grounds & Partner High Schools',
    projectLeader: 'Hazel Grace Fernandez',
    targetBeneficiaries: 'Youth farmers, senior high agri-students, local families',
    budget: '₱60,000',
    participantsCount: 35,
    status: 'Ongoing',
    results: 'Produced 450kg of organic vegetables harvested for municipal feeding program.'
  },
  {
    id: 'prj-3',
    title: 'Project Kalinga: Disaster Emergency Aid & Relief Mobilization',
    category: 'Disaster Relief',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80',
    description: 'Rapid response youth volunteer brigade trained to pack and distribute food packs, hygiene kits, and provide child-friendly spaces during seasonal typhoons and agricultural calamities.',
    objectives: [
      'Mobilize 60 certified youth relief volunteers within 2 hours of disaster call',
      'Prepare emergency family food bundles with Guimba LGU',
      'Set up recreational spaces in evacuation centers for children'
    ],
    startDate: '2025-09-01',
    endDate: '2026-12-31',
    location: 'Municipal Evacuation Centers across Guimba',
    projectLeader: 'Kevin Kyle Mendoza',
    targetBeneficiaries: 'Typhoon affected families and farmers in low-lying barangays',
    budget: '₱120,000 (Mobilization fund)',
    participantsCount: 78,
    status: 'Ongoing',
    results: 'Served 1,450 families across 8 flood-prone barangays during past typhoon relief efforts.'
  },
  {
    id: 'prj-4',
    title: 'Project Sigla: Barangay Youth Sports & Wellness Clinic',
    category: 'Sports Development',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80',
    description: 'Grassroots training clinics in basketball fundamentals, volleyball drills, chess tactics, and sports nutrition coached by varsity alumni and collegiate athletes.',
    objectives: [
      'Train 300 young athletes ages 12–18',
      'Provide basic sports equipment to underfunded barangay courts',
      'Promote anti-substance abuse awareness through sports'
    ],
    startDate: '2025-05-01',
    endDate: '2025-10-30',
    location: 'Guimba District Covered Courts',
    projectLeader: 'Joshua David Tolentino',
    targetBeneficiaries: 'Out-of-school and in-school youth athletes',
    budget: '₱75,000',
    participantsCount: 110,
    status: 'Completed',
    results: 'Completed 12 sports clinics with 320 participants graduated.'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Weekly Youth Leadership Fellowship & Planning',
    category: 'Meetings',
    date: 'Every Saturday',
    time: '2:00 PM – 4:30 PM',
    location: 'PAGASA Guimba Youth Center Hall',
    leader: 'Gian Carlo Magat',
    description: 'Weekly assembly of committee officers and cluster leaders to review ongoing community initiatives, upcoming events, and membership requests.',
    targetParticipants: 30,
    status: 'Ongoing',
    attendanceTracked: true
  },
  {
    id: 'act-2',
    title: 'Civic Media & Journalism Workshop for Youth',
    category: 'Workshops',
    date: '2026-09-19',
    time: '9:00 AM – 3:00 PM',
    location: 'Municipal Audio-Visual Room',
    leader: 'Camille Joy Ramos',
    description: 'Hands-on clinic on photojournalism, writing community news, fact-checking, and creating responsible viral campaigns.',
    targetParticipants: 45,
    status: 'Upcoming',
    attendanceTracked: true
  },
  {
    id: 'act-3',
    title: 'Barangay Clean-Up Drive & Drainage De-clogging',
    category: 'Volunteer',
    date: '2026-09-20',
    time: '6:30 AM – 10:00 AM',
    location: 'Barangay San Roque & Saranay',
    leader: 'Alyssa Nicole Valenzuela',
    description: 'Community environmental volunteer mobilization cleaning major canalways before monsoon heavy rains.',
    targetParticipants: 60,
    status: 'Upcoming',
    attendanceTracked: true
  },
  {
    id: 'act-4',
    title: 'Guimba Youth Basketball 3x3 League Elimination',
    category: 'Sports',
    date: '2026-10-10',
    time: '1:00 PM – 6:00 PM',
    location: 'Guimba Municipal Gymnasium',
    leader: 'Joshua David Tolentino',
    description: 'Barangay cluster qualifier games for under-21 basketball squads with live scoring and community cheers.',
    targetParticipants: 80,
    status: 'Upcoming',
    attendanceTracked: true
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Call for Registration: Guimba Youth Leadership Summit 2026',
    category: 'Events',
    date: '2026-08-25',
    author: 'Gian Carlo Magat',
    authorRole: 'President',
    featuredImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    summary: 'Registration is now officially open for delegates of the upcoming Guimba Youth Leadership Summit 2026 on September 15.',
    content: 'We are thrilled to announce that registration is now open for the annual Guimba Youth Leadership Summit 2026. Delegates will undergo intensive leadership workshops, collaborative project incubation, and receive official certificates signed by the Municipal Mayor and PAGASA Officers.\n\nSlots are limited to 150 delegates across all 64 barangays. Register through your member dashboard or via the public events portal before September 12, 2026.',
    isPublished: true,
    isPinned: true,
    views: 482
  },
  {
    id: 'ann-2',
    title: 'New Member ID Card Verification & Digital Attendance Pass Rollout',
    category: 'Important Notice',
    date: '2026-08-20',
    author: 'Mark Christian Domingo',
    authorRole: 'Secretary-General',
    featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    summary: 'PAGASA Guimba officially transitions to QR-based attendance tracking for all organization events, activities, and volunteer hours.',
    content: 'In line with our commitment to modern digital governance, all registered members can now access their personalized dynamic QR Membership Pass inside their Member Portal. Simply show your QR pass at event registration tables or project sites for instant, paperless attendance logging and automatic volunteer hour accumulation.',
    isPublished: true,
    isPinned: true,
    views: 350
  },
  {
    id: 'ann-3',
    title: 'Call for Volunteers: Project Dunong Mobile Library Weekend Facilitators',
    category: 'Volunteer Opportunities',
    date: '2026-08-15',
    author: 'Bea Patricia Francisco',
    authorRole: 'Head, Committee on Youth Education',
    featuredImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    summary: 'Calling all college students, education majors, and book lovers to join our mobile library caravan visiting rural barangays this September.',
    content: 'We need 20 enthusiastic volunteer tutors and storytellers for our upcoming Saturday mobile library stops in Barangays Banitan, Lennec, and Catimon. All volunteers will receive official Certificate of Volunteerism, snack stipends, and transportation assistance.',
    isPublished: true,
    isPinned: false,
    views: 215
  },
  {
    id: 'ann-4',
    title: 'Advisory: Guimba Youth Center Facility Schedule for September',
    category: 'General',
    date: '2026-08-10',
    author: 'Camille Joy Ramos',
    authorRole: 'PIO',
    featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    summary: 'The Youth Center study hall, co-working space, and computer lab are open Monday through Saturday from 8:00 AM to 7:00 PM for all registered members.',
    content: 'Members are reminded to show their digital member pass upon entry at the reception desk. Free high-speed WiFi, printing assistance for school projects, and conference room reservations are available for accredited youth committees.',
    isPublished: true,
    isPinned: false,
    views: 180
  }
];

export const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Youth Sports Fest 2026 Opening Ceremonies',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    date: '2026-08-20',
    caption: 'Over 190 youth athletes from 30+ barangays marching during the vibrant parade at Guimba Gymnasium.',
    eventTitle: 'PAGASA Inter-Barangay Youth Sports Fest 2026'
  },
  {
    id: 'gal-2',
    title: 'Project Dunong Book Distribution in Brgy. Banitan',
    category: 'Community Service',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
    date: '2026-07-28',
    caption: 'Volunteer teachers handing out reading storybooks and school supplies to smiling elementary pupils.',
    eventTitle: 'Project Dunong: Mobile Library'
  },
  {
    id: 'gal-3',
    title: 'Disaster Simulation & CPR Hands-on Drill',
    category: 'Training',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    date: '2026-07-18',
    caption: 'Youth first-responders practicing chest compressions and emergency evacuation carry techniques with MDRRMO instructors.',
    eventTitle: 'Emergency First-Aid Seminar'
  },
  {
    id: 'gal-4',
    title: 'Riverbank Clean-up & Tree Planting Drive',
    category: 'Community Service',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
    date: '2026-06-15',
    caption: 'Youth volunteers gathering plastic waste along Triala River and planting native bamboo saplings.',
    eventTitle: 'Tulong Kabataan River Caravan'
  },
  {
    id: 'gal-5',
    title: 'Executive Board General Assembly & Strategic Planning',
    category: 'Meetings',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80',
    date: '2026-05-10',
    caption: 'Officers finalizing the 2026 youth development roadmap at Guimba Municipal Session Hall.',
    eventTitle: 'Annual Executive Planning'
  },
  {
    id: 'gal-6',
    title: 'Youth Leadership Workshop Breakout Group',
    category: 'Youth Activities',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    date: '2026-04-22',
    caption: 'Delegates collaborating on community advocacy proposals and presentation decks.',
    eventTitle: 'Youth Leadership Series'
  }
];

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    certificateNumber: 'CERT-PAGASA-2026-0042-01',
    memberId: 'PAGASA-2026-0042',
    memberName: 'Juan Dela Cruz',
    eventOrActivityTitle: 'PAGASA Inter-Barangay Youth Sports Fest 2026',
    certificateType: 'Participation',
    issueDate: '2026-08-20',
    organization: 'PAGASA Guimba Youth Organization',
    signatories: [
      { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
      { name: 'Joshua David Tolentino', position: 'Head, Committee on Sports & Wellness' }
    ],
    description: 'In recognition of active and exemplary participation in the Inter-Barangay Youth Sports Fest 2026 held at Guimba Municipal Gymnasium.',
    qrVerificationUrl: 'https://pagasaguimba.org/verify/CERT-PAGASA-2026-0042-01'
  },
  {
    id: 'cert-2',
    certificateNumber: 'CERT-PAGASA-2026-0042-02',
    memberId: 'PAGASA-2026-0042',
    memberName: 'Juan Dela Cruz',
    eventOrActivityTitle: 'Emergency First-Aid & Disaster Preparedness Seminar',
    certificateType: 'Leadership',
    issueDate: '2026-07-18',
    organization: 'PAGASA Guimba Youth Organization',
    signatories: [
      { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
      { name: 'Kevin Kyle Mendoza', position: 'Safety & Disaster Officer' }
    ],
    description: 'For successfully completing 8 hours of intensive Basic Life Support, CPR training, and Community Disaster Preparedness Drills.',
    qrVerificationUrl: 'https://pagasaguimba.org/verify/CERT-PAGASA-2026-0042-02'
  },
  {
    id: 'cert-3',
    certificateNumber: 'CERT-PAGASA-2026-0043-01',
    memberId: 'PAGASA-2026-0043',
    memberName: 'Maria Santos',
    eventOrActivityTitle: 'Project Dunong: Barangay Mobile Library & Free Tutorial',
    certificateType: 'Volunteerism',
    issueDate: '2026-07-28',
    organization: 'PAGASA Guimba Youth Organization',
    signatories: [
      { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
      { name: 'Bea Patricia Francisco', position: 'Head, Committee on Youth Education' }
    ],
    description: 'For rendering 20 dedicated hours of volunteer teaching, literacy tutoring, and community mentorship in rural barangays of Guimba.',
    qrVerificationUrl: 'https://pagasaguimba.org/verify/CERT-PAGASA-2026-0043-01'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Registration Confirmed: Youth Leadership Summit 2026',
    message: 'You have been confirmed as an official delegate for the summit on Sept 15, 2026. Please bring your QR pass.',
    type: 'event',
    createdAt: '2026-08-28T09:30:00Z',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Attendance Recorded: Youth Sports Fest 2026',
    message: 'Your attendance was successfully marked Present at 7:48 AM on Aug 20, 2026.',
    type: 'attendance',
    createdAt: '2026-08-20T07:50:00Z',
    isRead: true
  },
  {
    id: 'notif-3',
    title: 'Certificate Ready: Basic First-Aid Training',
    message: 'Your official certificate of participation is now ready to view and download in your Member Portal.',
    type: 'certificate',
    createdAt: '2026-07-20T14:00:00Z',
    isRead: true
  },
  {
    id: 'notif-4',
    title: 'New Announcement: Digital Skills & AI Literacy Bootcamp',
    message: 'Check out the upcoming hands-on AI and freelancing bootcamp scheduled for September 26.',
    type: 'announcement',
    createdAt: '2026-08-22T11:15:00Z',
    isRead: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    userName: 'Gian Carlo Magat',
    userRole: 'SUPER_ADMIN',
    action: 'Created Event Session',
    module: 'Attendance',
    details: 'Opened live QR attendance session for Guimba Youth Leadership Summit 2026.',
    timestamp: '2026-08-31 10:14 AM',
    ipAddress: '192.168.1.45 (Municipal Hall Subnet)'
  },
  {
    id: 'log-2',
    userName: 'Gian Carlo Magat',
    userRole: 'SUPER_ADMIN',
    action: 'Approved Member Account',
    module: 'Members',
    details: 'Approved membership registration for Hazel Grace Fernandez (PAGASA-2026-0045).',
    timestamp: '2026-08-30 03:22 PM',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-3',
    userName: 'Gian Carlo Magat',
    userRole: 'ADMIN',
    action: 'Manual Attendance Check-in',
    module: 'Attendance',
    details: 'Marked Hazel Grace Fernandez as Present manually for session ses-1.',
    timestamp: '2026-08-29 08:05 AM',
    ipAddress: '192.168.1.52 (Mobile Station)'
  },
  {
    id: 'log-4',
    userName: 'Gian Carlo Magat',
    userRole: 'SUPER_ADMIN',
    action: 'Published Announcement',
    module: 'Announcements',
    details: 'Published announcement: Call for Registration: Guimba Youth Leadership Summit 2026.',
    timestamp: '2026-08-25 09:00 AM',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-5',
    userName: 'Gian Carlo Magat',
    userRole: 'SUPER_ADMIN',
    action: 'Issued Certificate',
    module: 'Certificates',
    details: 'Generated and signed Certificate CERT-PAGASA-2026-0042-01 for Juan Dela Cruz.',
    timestamp: '2026-08-20 06:30 PM',
    ipAddress: '192.168.1.45'
  }
];
