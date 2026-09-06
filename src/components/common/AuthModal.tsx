import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { PagasaLogo } from './PagasaLogo';
import { X, Lock, Mail, User, Phone, Shield, ArrowRight, CheckCircle2, Check, Loader2, Sparkles, KeyRound, Eye, EyeOff, Send, Clock, Info, Calendar, MapPin, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { calculateAge } from '../../utils/dateUtils';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithSupabase,
    registerMemberRequest,
    resetUserPassword,
    loginWithGoogle,
    loginAsMemberDirectly,
    members
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // New Member Registration form state: Name, Age, Address, Birthday, Gmail
  const [regFullName, setRegFullName] = useState('');
  const [regAge, setRegAge] = useState('21');
  const [regAddress, setRegAddress] = useState('');
  const [regBirthday, setRegBirthday] = useState('2005-06-15');
  const [regEmail, setRegEmail] = useState('');
  const [regBarangay, setRegBarangay] = useState(GUIMBA_BARANGAYS[0]);
  const [regContact, setRegContact] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState<{
    phase: 'submitting' | 'success' | 'existing';
    member?: any;
    email: string;
    name?: string;
    message?: string;
  } | null>(null);

  const handleBirthdayChange = (dateVal: string) => {
    setRegBirthday(dateVal);
    if (dateVal) {
      const calculated = calculateAge(dateVal);
      if (calculated >= 10 && calculated <= 90) {
        setRegAge(String(calculated));
      }
    }
  };

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginIdentifier.trim();
    const password = loginPassword.trim();

    if (!identifier) return;

    setIsSubmitting(true);
    try {
      const targetRole = authModalMode === 'admin-login' ? 'SUPER_ADMIN' : 'MEMBER';
      const res = await loginWithSupabase(identifier, password, targetRole);
      if (res.success) {
        setIsAuthModalOpen(false);
        setLoginPassword('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = regEmail.trim();
    if (!email) return;

    const parsedAge = parseInt(regAge, 10) || calculateAge(regBirthday);
    const fullAddress = regAddress.trim()
      ? `${regAddress.trim()}, Brgy. ${regBarangay}, Guimba, Nueva Ecija`
      : `Brgy. ${regBarangay}, Guimba, Nueva Ecija`;

    setIsSubmitting(true);
    // Show active submission overlay with animation
    setSubmitFeedback({
      phase: 'submitting',
      email: email,
      name: regFullName.trim() || undefined
    });

    try {
      // Natural submit animation timing for tactile visual feedback
      await new Promise(r => setTimeout(r, 700));

      const res = await registerMemberRequest(
        email,
        regFullName.trim() || undefined,
        regContact.trim() || undefined,
        regBarangay,
        {
          age: parsedAge,
          address: fullAddress,
          birthdate: regBirthday
        }
      );

      if (res.success && res.member) {
        setSubmitFeedback({
          phase: 'success',
          member: res.member,
          email: res.member.email,
          name: res.member.fullName,
          message: res.message
        });

        try {
          confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
        } catch (_) {}
      } else if (res.isExisting && res.member) {
        // Member already exists in directory! Show clear confirmation with 1-click login
        setSubmitFeedback({
          phase: 'existing',
          member: res.member,
          email: res.member.email,
          name: res.member.fullName,
          message: res.message
        });
      } else {
        setSubmitFeedback(null);
      }
    } catch {
      setSubmitFeedback(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotStatus('loading');
    try {
      await resetUserPassword(forgotEmail);
      setForgotStatus('success');
    } catch {
      setForgotStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 p-6 text-white relative">
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setSubmitFeedback(null);
              setShowForgotModal(false);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <PagasaLogo size={44} showText={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                  PAGASA Guimba MIS
                </span>
                <span className="text-[10px] bg-sky-400/20 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Official Portal
                </span>
              </div>
              <h2 className="text-xl font-display font-bold">
                {showForgotModal ? 'Reset Portal Password' :
                  submitFeedback?.phase === 'submitting' ? 'Submitting Registration...' :
                  submitFeedback?.phase === 'existing' ? 'Member Account Found' :
                  submitFeedback?.phase === 'success' ? 'Registration Complete!' : 
                  authModalMode === 'admin-login' ? 'Administrator Sign In' :
                  authModalMode === 'login' ? 'Member Portal Sign In' : 'Join PAGASA Youth Organization'}
              </h2>
            </div>
          </div>
        </div>

        {/* Forgot Password View */}
        {showForgotModal ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <span>Password Recovery & Assistance</span>
            </div>
            {forgotStatus === 'success' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Reset Link Sent</h4>
                <p className="text-xs text-slate-600">
                  We've sent password reset instructions to <strong>{forgotEmail}</strong>. If you cannot remember your temporary password, please contact an administrator to resend your credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotStatus('idle');
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered Gmail address. We will verify your account and send password recovery instructions.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Registered Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={forgotStatus === 'loading'}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {forgotStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Send Reset Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : submitFeedback ? (
          /* Animated Submit Overlay & Result Screens */
          submitFeedback.phase === 'submitting' ? (
            <div className="p-8 text-center space-y-5">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-35"></div>
                <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Submitting Registration...</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Checking PAGASA Youth Member Directory and registering record for <strong className="text-blue-700">{submitFeedback.email}</strong>.
                </p>
              </div>
              <div className="w-52 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-2/3 animate-pulse"></div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Please wait a moment...</p>
            </div>
          ) : submitFeedback.phase === 'existing' ? (
            <div className="p-8 text-center space-y-4">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 14 }}
                className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-md shadow-blue-500/10"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Account Already Registered</h3>
                <p className="text-xs text-slate-500 mt-1">This Gmail is already in the PAGASA Member Directory</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Status: {submitFeedback.member?.membershipStatus || 'Pending'}
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-sans">Full Name:</span>
                  <strong className="text-slate-800 font-sans">{submitFeedback.member?.fullName}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-sans">Member ID:</span>
                  <strong className="text-slate-800">{submitFeedback.member?.memberId}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-sans">Login Username:</span>
                  <strong className="text-blue-700">{submitFeedback.member?.username || submitFeedback.member?.email}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Password:</span>
                  <strong className="text-slate-600 font-sans">Protected & Encrypted (SHA-256)</strong>
                </div>
              </div>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {submitFeedback.member?.membershipStatus === 'Active'
                  ? 'Your account is active. Please enter your portal password to sign in.'
                  : 'Your account is awaiting administrator review and approval. You will receive an email once activated.'}
              </p>
              <div className="pt-2 flex gap-3 justify-center">
                {submitFeedback.member?.membershipStatus === 'Active' && (
                  <button
                    onClick={() => {
                      const targetUsername = submitFeedback.member?.username || submitFeedback.member?.email || '';
                      setLoginIdentifier(targetUsername);
                      setLoginPassword('');
                      setSubmitFeedback(null);
                      setAuthModalMode('member-login');
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setSubmitFeedback(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Success Screen after new registration */
            <div className="p-6 sm:p-8 text-center space-y-5">
              {/* Amber / Clock Circle for Pending */}
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Clock className="w-7 h-7 stroke-[2.5]" />
              </div>

              {/* Heading & Subtitle */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Application Submitted for Review
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Mabuhay! Your youth membership record has been recorded in the PAGASA Member Directory.
                </p>
              </div>

              {/* Member ID Box */}
              <div className="inline-block px-8 py-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <span className="font-mono text-lg sm:text-xl font-bold text-blue-700 tracking-wide">
                  {submitFeedback.member?.memberId || 'PAGASA-2026-0054'}
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Login Username: {submitFeedback.member?.username || submitFeedback.member?.email}
                </p>
              </div>

              {/* Status Notice Callout */}
              <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-left space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Account Status: Pending Administrator Approval</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  An administrator will review your application and assign your portal access credentials. Once approved, you can log in with your Gmail address.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmitFeedback(null);
                    setAuthModalMode('member-login');
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Return to Sign In
                </button>
                <button
                  onClick={() => {
                    setIsAuthModalOpen(false);
                    setSubmitFeedback(null);
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="p-6">
            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                onClick={() => setAuthModalMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalMode === 'login'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Member Portal
              </button>
              <button
                onClick={() => setAuthModalMode('admin-login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalMode === 'admin-login'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Portal
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalMode === 'register'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Join Organization
              </button>
            </div>

            {/* Login Form (Member or Admin) */}
            {(authModalMode === 'login' || authModalMode === 'admin-login') && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Admin Master Credentials Banner */}
                {authModalMode === 'admin-login' ? (
                  <div className="p-3.5 bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-800/60 rounded-2xl text-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-sky-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-sky-200">Admin Master Credentials</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('PAGASA_ADMIN');
                          setLoginPassword('TayoAngPagasa2026');
                        }}
                        className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Autofill Admin</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Username:</span>
                        <strong className="text-sky-300 select-all">PAGASA_ADMIN</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Password:</span>
                        <strong className="text-emerald-300 select-all">TayoAngPagasa2026</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-blue-50/90 border border-blue-200/90 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Member Portal Authentication</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Username + Assigned Password
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Sign in using your assigned <strong>Username</strong> or <strong>Gmail</strong> and your administrator-provided temporary password.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-semibold">Demo Members:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('juandelacruz');
                          setLoginPassword('PagasaMember2026');
                        }}
                        className="text-[10px] px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-800 font-semibold rounded-md border border-blue-200 transition-colors cursor-pointer"
                      >
                        Juan (juandelacruz)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('mariasantos');
                          setLoginPassword('PagasaMember2026');
                        }}
                        className="text-[10px] px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-800 font-semibold rounded-md border border-blue-200 transition-colors cursor-pointer"
                      >
                        Maria (mariasantos)
                      </button>
                    </div>
                  </div>
                )}

                {/* 1-Click Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isGoogleLoading ? 'Verifying...' : authModalMode === 'admin-login' ? 'Admin Sign In with Google' : 'Continue with Google Account'}</span>
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                      {authModalMode === 'admin-login' ? 'Or enter Admin Credentials' : 'Or enter Portal Credentials'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {authModalMode === 'admin-login' ? 'Admin Username or Email' : 'Assigned Username or Gmail'}
                  </label>
                  <div className="relative">
                    {authModalMode === 'admin-login' ? (
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    )}
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={authModalMode === 'admin-login' ? 'PAGASA_ADMIN' : 'Username (e.g. juandelacruz) or Gmail'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {authModalMode === 'admin-login' ? 'Admin Master Password' : 'Assigned Portal Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={authModalMode === 'admin-login' ? 'TayoAngPagasa2026' : 'Enter assigned password'}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginIdentifier);
                      setShowForgotModal(true);
                    }}
                    className="text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{authModalMode === 'admin-login' ? 'Sign In to Admin MIS Portal' : 'Sign In to Member Portal'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Complete Membership Registration Form: Name, Age, Address, Birthday, Gmail */}
            {authModalMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Member Registration & Credential Issuance</span>
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    Provide your official youth member credentials below. Once submitted, an administrator will review your information and assign your official <strong>Username</strong> and <strong>Account Password</strong>.
                  </p>
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
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Gian Carlo Magat"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* 2. Gmail / Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gmail / Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. giancarlomagat19@gmail.com"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Your assigned credentials & updates will be sent to this Gmail.
                  </p>
                </div>

                {/* 3. Birthday & Age (2-Column Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        value={regBirthday}
                        onChange={(e) => handleBirthdayChange(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium cursor-pointer"
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
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        placeholder="e.g. 21"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Address & Barangay */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Address (Purok / Street / House No.) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="e.g. Purok 3, Rizal Street"
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Barangay (Guimba) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={regBarangay}
                        onChange={(e) => setRegBarangay(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                      >
                        {GUIMBA_BARANGAYS.map((b) => (
                          <option key={b} value={b}>Brgy. {b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Number <span className="text-slate-400 text-[10px]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={regContact}
                          onChange={(e) => setRegContact(e.target.value)}
                          placeholder="+63 917 000 0000"
                          className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !regEmail.trim() || !regFullName.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Membership Registration</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};


