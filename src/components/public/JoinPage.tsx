import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { 
  Users, 
  Award, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  ArrowRight,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  Info,
  KeyRound,
  AlertCircle,
  Calendar,
  MapPin,
  Hash,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Copy,
  CheckCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateAge } from '../../utils/dateUtils';
import { generateTemporaryPassword } from '../../utils/security';
import { RegistrationSuccessModal } from '../common/RegistrationSuccessModal';

export const JoinPage: React.FC = () => {
  const { 
    registerMemberRequest, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    setCurrentPage, 
    loginWithGoogle,
    loginAsMemberDirectly 
  } = useApp();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('21');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('2005-06-15');
  const [barangay, setBarangay] = useState(GUIMBA_BARANGAYS[0]);
  const [contactNumber, setContactNumber] = useState('');
  const [portalPassword, setPortalPassword] = useState(() => generateTemporaryPassword());
  const [showPortalPassword, setShowPortalPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [registeredMemberRecord, setRegisteredMemberRecord] = useState<any>(null);

  const [submittedData, setSubmittedData] = useState<{
    memberId: string;
    email: string;
    fullName: string;
    age: number;
    address: string;
    birthdate: string;
    barangay: string;
    isExisting?: boolean;
    username?: string;
    membershipStatus?: string;
    password?: string;
  } | null>(null);

  const handleBirthdayChange = (dateVal: string) => {
    setBirthday(dateVal);
    if (dateVal) {
      const calculated = calculateAge(dateVal);
      if (calculated >= 10 && calculated <= 90) {
        setAge(String(calculated));
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);
    try {
      const success = await loginWithGoogle();
      if (success) {
        // Logged in
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter a valid Gmail / Email address.');
      return;
    }
    if (!trimmedName) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedAge = parseInt(age, 10) || calculateAge(birthday);
    const fullAddress = address.trim()
      ? `${address.trim()}, Brgy. ${barangay}, Guimba, Nueva Ecija`
      : `Brgy. ${barangay}, Guimba, Nueva Ecija`;

    try {
      const chosenPassword = portalPassword.trim() || generateTemporaryPassword();
      const res = await registerMemberRequest(
        trimmedEmail,
        trimmedName,
        contactNumber.trim() || undefined,
        barangay,
        {
          age: parsedAge,
          address: fullAddress,
          birthdate: birthday,
          password: chosenPassword,
          directActive: true
        }
      );

      if (res.success && res.member) {
        setRegisteredMemberRecord(res.member);
        setSuccessModalOpen(true);
        setSubmittedData({
          memberId: res.member.memberId,
          email: res.member.email,
          fullName: res.member.fullName,
          age: res.member.age,
          address: res.member.address,
          birthdate: res.member.birthdate,
          barangay: res.member.barangay,
          username: res.member.username || res.member.email,
          membershipStatus: res.member.membershipStatus,
          password: chosenPassword,
          isExisting: false
        });
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (_) {}
      } else if (res.isExisting && res.member) {
        setRegisteredMemberRecord(res.member);
        setSuccessModalOpen(true);
        setSubmittedData({
          memberId: res.member.memberId,
          email: res.member.email,
          fullName: res.member.fullName,
          age: res.member.age,
          address: res.member.address,
          birthdate: res.member.birthdate,
          barangay: res.member.barangay,
          username: res.member.username || res.member.email,
          membershipStatus: res.member.membershipStatus,
          password: chosenPassword,
          isExisting: true
        });
      } else {
        setErrorMessage(res.message || 'Unable to submit registration request. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Member Portal Registration
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Join the Youth Movement of Guimba
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Open to all young residents and volunteers in Guimba. Enter your Gmail to request member credentials and access leadership programs, verified QR passes, and e-certificates.
        </p>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Col: Benefits & Instructions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold font-display text-white">How Membership Access Works</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/30 text-yellow-300 rounded-xl flex-shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">1. Direct Directory Registration</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Provide your official youth member details. Your record is saved directly to the PAGASA Member Directory with active status.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/30 text-yellow-300 rounded-xl flex-shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">2. Set or Auto-Generate Credentials</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Your login credentials (Username/Gmail and SHA-256 hashed password) are saved directly for immediate access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/30 text-yellow-300 rounded-xl flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">3. Admin & Directory Synchronization</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Administrators can instantly view, verify, or sync all direct join submissions within the central Admin Member Directory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600/30 text-yellow-300 rounded-xl flex-shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">4. Instant Member Portal Access</h4>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Instantly proceed to your personal Member Portal, view your verified QR ID pass, and register for Guimba youth summits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm">Eligibility Criteria</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Resident or student of the Municipality of Guimba, Nueva Ecija</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Aged 15 to 30 years old / Youth Volunteer</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Willing to participate in community & civic youth initiatives</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Registration Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            {submittedData ? (
              <div className="text-center space-y-5 py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 font-display">
                    {submittedData.isExisting ? 'Member Record Found' : 'Registration Request Submitted!'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {submittedData.isExisting 
                      ? `Your Gmail address (${submittedData.email}) is already registered with PAGASA Guimba.`
                      : `Mabuhay, ${submittedData.fullName}! Your registration has been received and recorded in the Youth Directory.`}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl inline-block font-mono font-bold text-blue-900 text-lg">
                  {submittedData.memberId}
                </div>

                {/* Submitted Credentials Summary Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Full Name:</span>
                    <strong className="text-slate-800 font-sans">{submittedData.fullName}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Gmail Address:</span>
                    <strong className="text-blue-700 font-sans">{submittedData.email}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Age & Birthday:</span>
                    <strong className="text-slate-800 font-sans">{submittedData.age} yrs old ({submittedData.birthdate || 'N/A'})</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Address:</span>
                    <strong className="text-slate-800 font-sans truncate max-w-[200px]">{submittedData.address}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Login Username:</span>
                    <strong className="text-blue-700 font-sans">{submittedData.username || submittedData.email}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-sans">Account Status:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      submittedData.membershipStatus === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {submittedData.membershipStatus || (submittedData.isExisting ? 'Active' : 'Pending Approval')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Password Security:</span>
                    <strong className="text-slate-600 font-sans text-[11px]">
                      {submittedData.membershipStatus === 'Active' ? 'Configured & Encrypted' : 'To be assigned upon review'}
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>
                      {submittedData.membershipStatus === 'Active' 
                        ? 'Active Member Account' 
                        : 'Membership Application Pending Approval'}
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    {submittedData.membershipStatus === 'Active'
                      ? 'Your account is active. You can sign in directly to the Member Portal using your Gmail address and password.'
                      : 'Your application has been registered in the PAGASA Member Directory with status "Pending". An administrator will review your application and configure your portal access credentials.'}
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedData(null);
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    Open Member Login
                  </button>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Youth Member Registration
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete the form below with your official member credentials.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1-Click Google Sign In */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-60 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isGoogleLoading ? 'Connecting...' : 'Quick Register with Google Account'}</span>
                  </button>

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase">
                      <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                        Or enter registration details
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Gian Carlo Magat"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* 2. Gmail / Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gmail / Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. giancarlomagat19@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your assigned portal username & password will be emailed to this address.
                  </p>
                </div>

                {/* 3. Birthday & Age (2-Column Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Birthday <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        value={birthday}
                        onChange={(e) => handleBirthdayChange(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        required
                        min="10"
                        max="99"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 21"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Address & Barangay */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Address (Purok / Street / House No.) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Purok 3, Rizal Street"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Barangay (Guimba, Nueva Ecija) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                      >
                        {GUIMBA_BARANGAYS.map((b) => (
                          <option key={b} value={b}>Brgy. {b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact / Mobile <span className="text-slate-400 text-[10px]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="+63 917 000 0000"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Portal Password / User Credentials */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <label className="text-xs font-bold text-slate-800">
                        Portal Password / Login Credentials <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPortalPassword(generateTemporaryPassword())}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Generate New</span>
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPortalPassword ? 'text' : 'password'}
                      required
                      value={portalPassword}
                      onChange={(e) => setPortalPassword(e.target.value)}
                      placeholder="Enter your chosen password"
                      className="w-full pl-10 pr-20 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPortalPassword(!showPortalPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                        title={showPortalPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPortalPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(portalPassword);
                          setCopiedPassword(true);
                          setTimeout(() => setCopiedPassword(false), 2000);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                        title="Copy password"
                      >
                        {copiedPassword ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Direct Entry: Inputs & credentials are recorded directly into the Member Directory.</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Direct Directory Sync:</strong> Submitting this form registers your inputs and credentials directly to the PAGASA Member Directory with active portal status.
                  </span>
                </div>

                {/* Submit Member Registration Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !fullName.trim() || !portalPassword.trim()}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Member Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="text-xs text-slate-500 hover:text-blue-600 font-medium cursor-pointer"
                  >
                    Already have assigned credentials? <span className="font-bold text-blue-600 underline">Sign In here</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>

      <RegistrationSuccessModal
        isOpen={successModalOpen}
        memberId={registeredMemberRecord?.memberId || submittedData?.memberId || 'PAGASA-2026-0001'}
        credentials={{
          fullName: registeredMemberRecord?.fullName || submittedData?.fullName,
          email: registeredMemberRecord?.email || submittedData?.email,
          username: registeredMemberRecord?.username || submittedData?.username || registeredMemberRecord?.email || submittedData?.email,
          password: submittedData?.password || portalPassword
        }}
        onClose={() => setSuccessModalOpen(false)}
        onProceed={() => {
          setSuccessModalOpen(false);
          if (registeredMemberRecord) {
            loginAsMemberDirectly(registeredMemberRecord);
          } else {
            setCurrentPage('home');
          }
        }}
      />
    </div>
  );
};
