import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem, ColorPalette } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import { ChangeProfilePictureModal } from '../common/ChangeProfilePictureModal';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Edit3, 
  Save,
  BookOpen,
  Sun,
  Moon,
  Laptop,
  Palette,
  Check,
  Camera
} from 'lucide-react';

export const MemberProfile: React.FC = () => {
  const { 
    currentUser, 
    currentMember, 
    members, 
    updateMember, 
    certificates, 
    attendanceRecords, 
    addToast,
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    colorPalette,
    setColorPalette
  } = useApp();

  const memberCerts = certificates.filter(c => c.memberId === currentMember.memberId);
  const memberRecords = attendanceRecords.filter(r => r.memberId === currentMember.memberId);

  const [isEditing, setIsEditing] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [fullName, setFullName] = useState(currentMember.fullName);
  const [contactNumber, setContactNumber] = useState(currentMember.contactNumber);
  const [address, setAddress] = useState(currentMember.address);
  const [occupation, setOccupation] = useState(currentMember.occupation);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const palettes: { id: ColorPalette; name: string; hex: string }[] = [
    { id: 'default', name: 'Civic Blue', hex: '#2563eb' },
    { id: 'emerald', name: 'Emerald', hex: '#059669' },
    { id: 'purple', name: 'Purple', hex: '#7c3aed' },
    { id: 'sunset', name: 'Sunset', hex: '#ea580c' },
    { id: 'ocean', name: 'Cyan', hex: '#0284c7' },
    { id: 'high-contrast', name: 'High Contrast', hex: '#1d4ed8' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember(currentMember.id, {
      fullName,
      contactNumber,
      address,
      occupation
    });
    setIsEditing(false);
    addToast('Profile information updated successfully!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative group flex-shrink-0">
            <img
              src={currentMember.profilePicture}
              alt={currentMember.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-blue-50 shadow-md group-hover:border-blue-200 transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsProfilePicModalOpen(true)}
              className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-md transition-colors cursor-pointer"
              title="Change Profile Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {currentMember.memberId}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {currentMember.membershipStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display truncate">
              {currentMember.fullName}
            </h1>
            <p className="text-xs text-slate-500 truncate">
              {currentMember.organizationPosition} • {currentMember.committee}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsProfilePicModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Avatar</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Personal Information Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Personal & Civic Information
            </h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation / Student</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Email Address</span>
                  <p className="font-bold text-slate-900">{currentMember.email}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Mobile Number</span>
                  <p className="font-bold text-slate-900">{currentMember.contactNumber}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Barangay & Address</span>
                  <p className="font-bold text-slate-900">Brgy. {currentMember.barangay}, Guimba</p>
                  <p className="text-slate-500 text-[11px]">{currentMember.address}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Birthdate & Age</span>
                  <p className="font-bold text-slate-900">{currentMember.birthdate} ({currentMember.age} yrs old)</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Education Status</span>
                  <p className="font-bold text-slate-900">{currentMember.educationalStatus}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Date Registered</span>
                  <p className="font-bold text-slate-900">{currentMember.dateJoined}</p>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="p-5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2 text-xs">
              <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                Emergency Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Contact Person:</span>
                  <span className="font-bold">{currentMember.emergencyContact.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Relationship:</span>
                  <span className="font-bold">{currentMember.emergencyContact.relationship}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency Hotline:</span>
                  <span className="font-bold">{currentMember.emergencyContact.contactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Certificates Collection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Earned Certificates ({memberCerts.length})
              </h2>
              <Award className="w-5 h-5 text-amber-500" />
            </div>

            {memberCerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No certificates earned yet. Attend assemblies and check in with your QR pass.
              </p>
            ) : (
              <div className="space-y-3">
                {memberCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-2xl space-y-2 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Certificate of {cert.certificateType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1.5">{cert.eventTitle}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{cert.certificateNumber}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {cert.description}
                    </p>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Issued: {cert.issueDate}</span>
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3" /> View & Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme & Display Preferences Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Theme & Display Mode
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {effectiveTheme}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Customize your portal view mode and dynamic accent colors for comfortable browsing.
            </p>

            {/* Quick Mode Toggle Switch */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-blue-500 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Auto</span>
              </button>
            </div>

            {/* Accent Swatches */}
            <div className="pt-2">
              <span className="block text-[11px] font-semibold text-slate-700 mb-2">Accent Palette:</span>
              <div className="grid grid-cols-3 gap-2">
                {palettes.map(p => {
                  const isSelected = colorPalette === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setColorPalette(p.id)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        isSelected ? 'border-slate-900 bg-slate-50 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.hex }} />
                      <span className="text-[11px] text-slate-800 truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Certificate Print / View Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Change Profile Picture Modal */}
      <ChangeProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        userType="member"
        memberId={currentMember.id}
        initialAvatar={currentMember.profilePicture}
      />
    </div>
  );
};
