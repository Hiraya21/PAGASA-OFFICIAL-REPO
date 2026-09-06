import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Member, User } from '../../types';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  QrCode, 
  X, 
  Check, 
  Shield, 
  FileSpreadsheet, 
  Camera, 
  Mail, 
  Copy, 
  LogIn, 
  Sparkles, 
  UserCheck, 
  Lock, 
  KeyRound, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  UserX, 
  Clock, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Power,
  ChevronDown,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';
import { SetResetPasswordModal } from './SetResetPasswordModal';
import { OneTimePasswordModal } from './OneTimePasswordModal';
import { RejectMemberModal } from './RejectMemberModal';
import { generateTemporaryPassword, validatePasswordStrength } from '../../utils/security';

export const AdminMembers: React.FC = () => {
  const { 
    members, 
    authAccounts,
    addMember, 
    updateMember, 
    deleteMember, 
    clearAllMembers,
    selectedMemberId, 
    setSelectedMemberId,
    switchRole,
    setCurrentPage,
    addToast,
    confirmAction,
    setMemberPassword,
    resetMemberPasswordByAdmin,
    approveMemberApplication,
    rejectMemberApplication,
    setMemberAccountStatus,
    togglePortalAccess,
    resendCredentialEmail,
    openEmailPreview
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPortalAccessFilter, setSelectedPortalAccessFilter] = useState('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [photoTargetMember, setPhotoTargetMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(
    selectedMemberId ? members.find(m => m.id === selectedMemberId) || null : null
  );

  // Authentication & Account Setup Modals State
  const [setResetPasswordMember, setSetResetPasswordMember] = useState<Member | null>(null);
  const [rejectMember, setRejectMember] = useState<Member | null>(null);
  const [oneTimePasswordData, setOneTimePasswordData] = useState<{
    memberName: string;
    memberId: string;
    email: string;
    generatedPassword: string;
    emailSent: boolean;
  } | null>(null);

  // Create / Edit Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formBarangay, setFormBarangay] = useState(GUIMBA_BARANGAYS[0]);
  const [formBirthdate, setFormBirthdate] = useState('2004-01-01');
  const [formAge, setFormAge] = useState<number>(22);
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Prefer not to say' | 'Other'>('Male');
  const [formEducation, setFormEducation] = useState<any>('College / University');
  const [formStatus, setFormStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [formPosition, setFormPosition] = useState('Youth Member');
  const [formCommittee, setFormCommittee] = useState('General Youth Volunteer');
  const [formAddress, setFormAddress] = useState('');

  // Optional direct password generation during manual member registration
  const [assignCredentialsNow, setAssignCredentialsNow] = useState(true);
  const [formPassword, setFormPassword] = useState(() => generateTemporaryPassword());
  const [formShowPassword, setFormShowPassword] = useState(false);
  const [formSendEmail, setFormSendEmail] = useState(true);

  // Computed members lists
  const pendingMembers = members.filter(m => m.membershipStatus === 'Pending');
  const activeMembersCount = members.filter(m => m.membershipStatus === 'Active').length;
  const portalAccessEnabledCount = members.filter(m => m.portalAccess === 'Enabled' || (!m.isAccessDisabled && m.portalAccess !== 'Disabled')).length;
  const passwordConfiguredCount = members.filter(m => !!m.passwordHash).length;

  const filteredMembers = members.filter(m => {
    const matchesBarangay = selectedBarangay === 'ALL' || m.barangay === selectedBarangay;
    const matchesStatus = selectedStatus === 'ALL' || m.membershipStatus === selectedStatus;
    
    let matchesPortal = true;
    if (selectedPortalAccessFilter === 'ENABLED') {
      matchesPortal = m.portalAccess === 'Enabled' || (!m.isAccessDisabled && m.portalAccess !== 'Disabled');
    } else if (selectedPortalAccessFilter === 'DISABLED') {
      matchesPortal = m.portalAccess === 'Disabled' || m.isAccessDisabled;
    }

    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesBarangay && matchesStatus && matchesPortal;
    const matchesSearch = (m.fullName || '').toLowerCase().includes(q) ||
                          (m.memberId || '').toLowerCase().includes(q) ||
                          (m.email || '').toLowerCase().includes(q) ||
                          (m.barangay || '').toLowerCase().includes(q);
    return matchesBarangay && matchesStatus && matchesPortal && matchesSearch;
  });

  // Approval & Rejection Actions
  const handleApproveApplication = async (member: Member) => {
    const res = await approveMemberApplication(member.id);
    if (res.success) {
      addToast('success', 'Application Approved', `${member.fullName}'s membership application is approved and account is active.`);
      // If member does not have a password configured yet, prompt admin to set or auto-generate one
      if (!member.passwordHash) {
        setSetResetPasswordMember({ ...member, membershipStatus: 'Active', portalAccess: 'Enabled' });
      }
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectMember) return;
    const res = await rejectMemberApplication(rejectMember.id, reason);
    if (res.success) {
      addToast('info', 'Application Rejected', `Membership application for ${rejectMember.fullName} was rejected.`);
      setRejectMember(null);
    }
  };

  // Password Setup & Reset Action
  const handleSaveMemberPassword = async (password: string, requireChange: boolean, sendEmail: boolean) => {
    if (!setResetPasswordMember) return;
    const res = await setMemberPassword(setResetPasswordMember.id, password, requireChange, sendEmail);
    if (res.success) {
      const targetMember = setResetPasswordMember;
      setSetResetPasswordMember(null);
      // Trigger one-time password display modal
      setOneTimePasswordData({
        memberName: targetMember.fullName,
        memberId: targetMember.memberId,
        email: targetMember.email,
        generatedPassword: password,
        emailSent: sendEmail
      });
    }
  };

  // Toggle Portal Access
  const handleTogglePortalAccess = async (member: Member) => {
    const res = await togglePortalAccess(member.id);
    if (res.success) {
      addToast(
        res.portalAccess === 'Enabled' ? 'success' : 'info',
        'Portal Access Updated',
        `Portal access for ${member.fullName} is now ${res.portalAccess}.`
      );
    }
  };

  // Change Account Status
  const handleStatusChange = async (member: Member, newStatus: 'Active' | 'Pending' | 'Inactive' | 'Rejected' | 'Suspended') => {
    const res = await setMemberAccountStatus(member.id, newStatus);
    if (res.success) {
      addToast('info', 'Account Status Updated', `${member.fullName}'s status changed to ${newStatus}.`);
    }
  };

  // Open Create / Edit Modals
  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormContact('+63 9');
    setFormBarangay(GUIMBA_BARANGAYS[0]);
    setFormBirthdate('2004-01-01');
    setFormAge(22);
    setFormGender('Male');
    setFormEducation('College / University');
    setFormStatus('Active');
    setFormPosition('Youth Member');
    setFormCommittee('General Youth Volunteer');
    setFormAddress('');
    setAssignCredentialsNow(true);
    setFormPassword(generateTemporaryPassword());
    setFormShowPassword(false);
    setFormSendEmail(true);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormName(m.fullName);
    setFormEmail(m.email);
    setFormContact(m.contactNumber);
    setFormBarangay(m.barangay);
    setFormBirthdate(m.birthdate);
    setFormAge(m.age || 20);
    setFormGender(m.gender);
    setFormEducation(m.educationalStatus);
    setFormStatus(m.membershipStatus);
    setFormPosition(m.organizationPosition || 'Youth Member');
    setFormCommittee(m.committee || 'General Youth Volunteer');
    setFormAddress(m.address);
    setAssignCredentialsNow(false);
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const cleanedEmail = formEmail.trim().toLowerCase();
    const finalAge = Number(formAge) || 20;

    if (editingMember) {
      updateMember(editingMember.id, {
        fullName: formName.trim(),
        email: cleanedEmail,
        contactNumber: formContact,
        barangay: formBarangay,
        birthdate: formBirthdate,
        age: finalAge,
        gender: formGender,
        educationalStatus: formEducation,
        membershipStatus: formStatus,
        organizationPosition: formPosition,
        committee: formCommittee,
        address: formAddress
      });
      addToast('success', 'Member Profile Updated', `Profile for ${formName} saved.`);
      setIsCreateModalOpen(false);
    } else {
      const willAssignPassword = assignCredentialsNow && formPassword.trim();
      const newMember = addMember({
        fullName: formName.trim(),
        email: cleanedEmail,
        contactNumber: formContact,
        birthdate: formBirthdate,
        age: finalAge,
        gender: formGender,
        address: formAddress || `Purok 1, Brgy. ${formBarangay}, Guimba`,
        barangay: formBarangay,
        educationalStatus: formEducation,
        occupation: 'Youth Member / Student',
        membershipStatus: formStatus,
        portalAccess: formStatus === 'Active' ? 'Enabled' : 'Disabled',
        organizationPosition: formPosition,
        committee: formCommittee,
        credentialStatus: willAssignPassword ? 'Active' : 'Pending Credentials',
        credentialsAssignedAt: willAssignPassword ? new Date().toISOString() : undefined,
        emailDeliveryStatus: willAssignPassword ? (formSendEmail ? 'Delivered' : 'Pending') : 'Pending',
        emailDeliveryDate: willAssignPassword && formSendEmail ? new Date().toISOString() : undefined,
        mustChangePassword: false,
        emergencyContact: {
          name: 'Family Contact',
          relationship: 'Parent / Guardian',
          contactNumber: formContact
        }
      });

      setIsCreateModalOpen(false);

      if (willAssignPassword) {
        // Hash password securely through setMemberPassword
        await setMemberPassword(newMember.id, formPassword.trim(), false, formSendEmail);
        setOneTimePasswordData({
          memberName: newMember.fullName,
          memberId: newMember.memberId,
          email: newMember.email,
          generatedPassword: formPassword.trim(),
          emailSent: formSendEmail
        });
      } else {
        addToast('success', 'Member Created', `Member ${formName} registered with status "${formStatus}".`);
      }
    }
  };

  const handleTestLoginAsMember = (m: Member) => {
    const userPayload: User = {
      id: m.id,
      name: m.fullName,
      email: m.email,
      role: 'MEMBER',
      avatar: m.profilePicture,
      memberId: m.memberId
    };
    switchRole('MEMBER', userPayload);
  };

  const handleExportCSV = () => {
    const headers = [
      'Member ID', 
      'Full Name', 
      'Gmail (Login Username)', 
      'Account Status', 
      'Portal Access', 
      'Password Configured', 
      'Barangay', 
      'Date Joined / Approved'
    ];
    const rows = filteredMembers.map(m => [
      `"${m.memberId}"`,
      `"${m.fullName}"`,
      `"${m.email}"`,
      `"${m.membershipStatus}"`,
      `"${m.portalAccess || (m.isAccessDisabled ? 'Disabled' : 'Enabled')}"`,
      `"${m.passwordHash ? 'YES (SHA-256)' : 'NO'}"`,
      `"${m.barangay}"`,
      `"${m.dateJoined || m.membershipDate || '2026-01-01'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAGASA_Guimba_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('info', 'Export Completed', 'Member directory exported to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Member Directory & Authentication Setup
            </h1>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              Admin Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage membership applications, portal passwords (SHA-256 encrypted), and access rights ({filteredMembers.length} records).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {members.length > 0 && (
            <button
              onClick={() => {
                confirmAction({
                  title: 'Clear All Members from Directory',
                  message: 'Are you sure you want to remove ALL existing member records? This will delete all member accounts and credentials so you can start completely fresh.',
                  confirmText: 'Yes, Clear All Members',
                  cancelText: 'Cancel',
                  variant: 'danger',
                  itemDetails: {
                    label: 'Current Total Records',
                    value: `${members.length} Member Accounts`,
                    subValue: 'All member directory entries and credentials will be removed.'
                  },
                  onConfirm: () => {
                    clearAllMembers();
                  }
                });
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Remove all member records"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear Directory</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Member</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{members.length}</p>
          <span className="text-[10px] text-slate-400">Registered youth</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 font-display">{pendingMembers.length}</p>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Active Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-800 font-display">{activeMembersCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Approved & in good standing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Portal Access</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800 font-display">{portalAccessEnabledCount}</p>
          <span className="text-[10px] text-blue-700 font-medium">Access granted</span>
        </div>
      </div>

      {/* Pending Applications Review Queue Banner */}
      {pendingMembers.length > 0 && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 rounded-3xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950 font-display flex items-center gap-2">
                  <span>Membership Applications Awaiting Approval</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-extrabold">
                    {pendingMembers.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-amber-800/90">
                  Applicants from the Join Organization form are set to Pending until you approve their profile and assign credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {pendingMembers.map((pm) => (
              <div
                key={pm.id}
                className="p-3 bg-white rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{pm.fullName}</p>
                    <span className="text-[10px] font-mono text-slate-400">({pm.memberId})</span>
                  </div>
                  <p className="text-[11px] font-mono text-blue-700 truncate">{pm.email}</p>
                  <p className="text-[10px] text-slate-500">Brgy. {pm.barangay} • Age {pm.age || 20}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApproveApplication(pm)}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    title="Approve Membership Application"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectMember(pm)}
                    className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    title="Reject Application"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, Gmail username, Member ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Account Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="Active">Active ({activeMembersCount})</option>
            <option value="Pending">Pending Review ({pendingMembers.length})</option>
            <option value="Inactive">Inactive</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Portal Access Filter */}
          <select
            value={selectedPortalAccessFilter}
            onChange={(e) => setSelectedPortalAccessFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
          >
            <option value="ALL">All Portal Access</option>
            <option value="ENABLED">Portal Access: Enabled</option>
            <option value="DISABLED">Portal Access: Disabled</option>
          </select>

          {/* Barangay Dropdown */}
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Barangays</option>
            {GUIMBA_BARANGAYS.map((b) => (
              <option key={b} value={b}>Brgy. {b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3.5 px-4">Member & Login Username (Gmail)</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Portal Access</th>
                <th className="py-3.5 px-4">Password Security</th>
                <th className="py-3.5 px-4">Joined / Approved</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-14 px-4">
                    <div className="max-w-md mx-auto space-y-3 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-xs">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm font-display">
                          {members.length === 0 ? 'Member Directory is Empty' : 'No members match the filter'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {members.length === 0 
                            ? 'No member records found. You can add youth members manually or applicants can apply via the Join Organization form.'
                            : 'Try adjusting your search criteria or select another status filter.'}
                        </p>
                      </div>
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={handleOpenCreate}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{members.length === 0 ? 'Add First Member Manually' : 'Register New Member'}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const isPortalEnabled = m.portalAccess === 'Enabled' || (!m.isAccessDisabled && m.portalAccess !== 'Disabled');

                  return (
                    <tr 
                      key={m.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        m.membershipStatus === 'Pending' ? 'bg-amber-50/20' : 
                        !isPortalEnabled ? 'bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Member Name & Login Username (Gmail) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="relative group cursor-pointer flex-shrink-0"
                            onClick={() => setPhotoTargetMember(m)}
                            title="Click to change member photo"
                          >
                            <img
                              src={m.profilePicture}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:brightness-90 transition-all"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 truncate">{m.fullName}</p>
                              <span className="font-mono text-[10px] text-slate-400">({m.memberId})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-blue-700 mt-0.5">
                              <Mail className="w-3 h-3 text-red-500 flex-shrink-0" />
                              <span className="font-semibold truncate">{m.email}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Brgy. {m.barangay}</span>
                          </div>
                        </div>
                      </td>

                      {/* Account Status with Inline Selector */}
                      <td className="py-3 px-4">
                        <select
                          value={m.membershipStatus}
                          onChange={(e) => handleStatusChange(m, e.target.value as any)}
                          className={`px-2 py-1 rounded-xl text-[11px] font-bold border cursor-pointer focus:outline-none ${
                            m.membershipStatus === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : m.membershipStatus === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                              : m.membershipStatus === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending Review</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Portal Access Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePortalAccess(m)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            isPortalEnabled
                              ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                          title={isPortalEnabled ? "Click to disable Member Portal access" : "Click to enable Member Portal access"}
                        >
                          <Power className={`w-3 h-3 ${isPortalEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{isPortalEnabled ? 'Enabled' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Password Security Status - NEVER PLAINTEXT */}
                      <td className="py-3 px-4">
                        {m.passwordHash ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Shield className="w-3 h-3 text-emerald-600" />
                              SHA-256 Encrypted
                            </span>
                            {m.mustChangePassword && (
                              <span className="block text-[9px] text-amber-600 font-bold">
                                Must change on next login
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSetResetPasswordMember(m)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                            title="Configure official password for member"
                          >
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Set Password</span>
                          </button>
                        )}
                      </td>

                      {/* Joined / Approved Date */}
                      <td className="py-3 px-4 text-slate-600">
                        <p className="font-semibold text-slate-800 text-[11px]">
                          {m.dateJoined || m.membershipDate || '2026-01-01'}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {m.membershipStatus === 'Active' ? 'Active Roster' : 'Registered'}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {m.lastLoginAt ? (
                          <span className="text-slate-700 font-medium">
                            {new Date(m.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Approve / Reject for Pending */}
                          {m.membershipStatus === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveApplication(m)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                                title="Approve Membership Application"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectMember(m)}
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition-colors cursor-pointer"
                                title="Reject Membership Application"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Set / Reset Password Button */}
                          <button
                            type="button"
                            onClick={() => setSetResetPasswordMember(m)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title={m.passwordHash ? "Reset Member Password" : "Set Member Password"}
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Resend Email Button */}
                          <button
                            type="button"
                            onClick={() => resendCredentialEmail(m.id)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Send Credential Notification to Member Gmail"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          {/* Preview Email Template */}
                          <button
                            type="button"
                            onClick={() => openEmailPreview(m)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview Credential Email Template"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Digital QR */}
                          <button
                            type="button"
                            onClick={() => setViewingMember(m)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Digital QR Pass"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Test login as member */}
                          <button
                            type="button"
                            onClick={() => handleTestLoginAsMember(m)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Test Sign In As This Member (Preview Portal)"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>

                          {/* Edit Member Info */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Member Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Member */}
                          <button
                            type="button"
                            onClick={() => {
                              confirmAction({
                                title: 'Remove Member Record',
                                message: `Are you sure you want to remove ${m.fullName}? This will revoke their portal access and delete their registration pass.`,
                                confirmText: 'Delete Member',
                                cancelText: 'Keep Member',
                                variant: 'danger',
                                itemDetails: {
                                  label: 'Youth Member Details',
                                  value: `${m.fullName} (${m.memberId})`,
                                  subValue: m.email ? `Email: ${m.email} • Brgy. ${m.barangay}` : `Barangay: ${m.barangay}`
                                },
                                onConfirm: () => {
                                  deleteMember(m.id);
                                  addToast('info', 'Member Deleted', `Member ${m.fullName} removed.`);
                                }
                              });
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set / Reset Password Modal */}
      {setResetPasswordMember && (
        <SetResetPasswordModal
          isOpen={!!setResetPasswordMember}
          onClose={() => setSetResetPasswordMember(null)}
          member={setResetPasswordMember}
          onSavePassword={handleSaveMemberPassword}
        />
      )}

      {/* One-Time Password Display Modal */}
      {oneTimePasswordData && (
        <OneTimePasswordModal
          isOpen={!!oneTimePasswordData}
          onClose={() => setOneTimePasswordData(null)}
          memberName={oneTimePasswordData.memberName}
          memberId={oneTimePasswordData.memberId}
          email={oneTimePasswordData.email}
          generatedPassword={oneTimePasswordData.generatedPassword}
          emailSent={oneTimePasswordData.emailSent}
        />
      )}

      {/* Reject Member Modal */}
      {rejectMember && (
        <RejectMemberModal
          isOpen={!!rejectMember}
          onClose={() => setRejectMember(null)}
          member={rejectMember}
          onConfirmReject={handleConfirmReject}
        />
      )}

      {/* Member QR / Detail Modal */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            <button
              onClick={() => setViewingMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={viewingMember.profilePicture}
              alt=""
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-blue-600 shadow-md"
            />
            <div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {viewingMember.memberId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display mt-1">{viewingMember.fullName}</h3>
              <p className="text-xs text-slate-500">Brgy. {viewingMember.barangay}, Guimba</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span className="font-mono">{viewingMember.email}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              <QRCodeSVG value={viewingMember.qrCode || viewingMember.memberId} size={150} />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  handleTestLoginAsMember(viewingMember);
                  setViewingMember(null);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Open {viewingMember.fullName}'s Portal</span>
              </button>
              
              <button
                onClick={() => setViewingMember(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Member Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingMember ? 'Edit Youth Member Profile' : 'Register New Youth Member Manually'}
                </h3>
                <p className="text-xs text-slate-500">
                  Enter member details for the PAGASA Member Directory.
                </p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Member Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Clara Santos"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Gmail / Login Username */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Gmail Address (Unique Login Username) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maria.santos@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>

              {/* Birthday & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Birthday *</label>
                  <input
                    type="date"
                    required
                    value={formBirthdate}
                    onChange={(e) => {
                      setFormBirthdate(e.target.value);
                      if (e.target.value) {
                        const birthYear = new Date(e.target.value).getFullYear();
                        if (!isNaN(birthYear)) {
                          setFormAge(Math.max(12, Math.min(45, 2026 - birthYear)));
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">Age</label>
                    <span className="text-[10px] text-blue-600 font-medium">Auto-calculated</span>
                  </div>
                  <input
                    type="number"
                    min={12}
                    max={60}
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Address and Barangay */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Address / Street / Purok *</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. Purok 3, Sitio Riverside"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Barangay (Guimba) *</label>
                  <select
                    value={formBarangay}
                    onChange={(e) => setFormBarangay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    {GUIMBA_BARANGAYS.map((b) => (
                      <option key={b} value={b}>Brgy. {b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact, Gender & Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Direct Credential Assignment Section for New Members */}
              {!editingMember && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={assignCredentialsNow}
                        onChange={(e) => setAssignCredentialsNow(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        Configure Portal Password Now
                      </span>
                    </label>
                    <span className="text-[10px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-semibold">
                      SHA-256 Hashed
                    </span>
                  </div>

                  {assignCredentialsNow && (
                    <div className="space-y-2.5 pt-1 border-t border-blue-100/80">
                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-700">Initial Password</label>
                          <button
                            type="button"
                            onClick={() => setFormPassword(generateTemporaryPassword())}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Suggest Password
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={formShowPassword ? 'text' : 'password'}
                            value={formPassword}
                            onChange={(e) => setFormPassword(e.target.value)}
                            placeholder="Set initial password"
                            className="w-full px-3 py-2 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setFormShowPassword(!formShowPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {formShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Send Email Notice */}
                      <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                        <input
                          type="checkbox"
                          checked={formSendEmail}
                          onChange={(e) => setFormSendEmail(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-600">
                          Send credentials notice directly to member's Gmail upon registration
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2 shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {editingMember 
                    ? 'Save Member Updates' 
                    : 'Register Member in Directory'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Member Profile Picture Modal */}
      {photoTargetMember && (
        <ChangeProfilePictureModal
          isOpen={!!photoTargetMember}
          onClose={() => setPhotoTargetMember(null)}
          userType="member"
          targetMemberId={photoTargetMember.id}
          initialAvatar={photoTargetMember.profilePicture}
          title={`Change ${photoTargetMember.fullName}'s Profile Picture`}
        />
      )}
    </div>
  );
};
