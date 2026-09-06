import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Check, 
  Camera, 
  RefreshCw,
  User,
  Smile,
  SlidersHorizontal,
  Bot,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

interface ChangeProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: 'member' | 'admin';
  targetMemberId?: string;
  memberId?: string;
  initialAvatar?: string;
  title?: string;
}

type TabType = 'presets' | 'upload' | 'url';
type AvatarCategory = 'all' | 'adventurer' | 'lorelei' | 'notionists' | 'bottts' | 'fun' | 'shapes';

interface AvatarPreset {
  id: string;
  category: AvatarCategory;
  name: string;
  url: string;
}

// 100% Vector and Illustrated Avatar Presets (No real people photos)
const AVATAR_PRESETS: AvatarPreset[] = [
  // Adventurer / Illustrated Youth
  { id: 'adv-1', category: 'adventurer', name: 'Youth Leader Alex', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundColor=b6e3f4,c0aede,d1d4f9' },
  { id: 'adv-2', category: 'adventurer', name: 'Volunteer Maya', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya&backgroundColor=ffd5dc,ffdfbf,d1d4f9' },
  { id: 'adv-3', category: 'adventurer', name: 'Organizer Jordan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jordan&backgroundColor=c0aede,b6e3f4,ffd5dc' },
  { id: 'adv-4', category: 'adventurer', name: 'Ambassador Sam', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sam&backgroundColor=ffdfbf,ffd5dc,b6e3f4' },
  { id: 'adv-5', category: 'adventurer', name: 'Cadet Taylor', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Taylor&backgroundColor=b6e3f4,d1d4f9' },
  { id: 'adv-6', category: 'adventurer', name: 'SK Scholar Kai', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kai&backgroundColor=ffd5dc,c0aede' },
  { id: 'adv-7', category: 'adventurer', name: 'Youth Officer Riley', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Riley&backgroundColor=d1d4f9,b6e3f4' },
  { id: 'adv-8', category: 'adventurer', name: 'Advocate Morgan', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Morgan&backgroundColor=ffdfbf,c0aede' },

  // Lorelei / Modern Illustrated Characters
  { id: 'lor-1', category: 'lorelei', name: 'President Elena', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Elena&backgroundColor=b6e3f4,ffd5dc' },
  { id: 'lor-2', category: 'lorelei', name: 'Secretary Carlos', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Carlos&backgroundColor=d1d4f9,c0aede' },
  { id: 'lor-3', category: 'lorelei', name: 'Treasurer Bea', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Bea&backgroundColor=ffdfbf,ffd5dc' },
  { id: 'lor-4', category: 'lorelei', name: 'Auditor Gabriel', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Gabriel&backgroundColor=c0aede,b6e3f4' },
  { id: 'lor-5', category: 'lorelei', name: 'PIO Jasmine', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Jasmine&backgroundColor=ffd5dc,d1d4f9' },
  { id: 'lor-6', category: 'lorelei', name: 'Coordinator Mateo', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Mateo&backgroundColor=b6e3f4,ffdfbf' },

  // Notionists / Minimal Art Personas
  { id: 'not-1', category: 'notionists', name: 'Minimalist Chris', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Chris&backgroundColor=e0e7ff,fef3c7' },
  { id: 'not-2', category: 'notionists', name: 'Artisan Nicole', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Nicole&backgroundColor=fce7f3,dbeafe' },
  { id: 'not-3', category: 'notionists', name: 'Strategist Enzo', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Enzo&backgroundColor=ecfdf5,fef3c7' },
  { id: 'not-4', category: 'notionists', name: 'Designer Chloe', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Chloe&backgroundColor=f3e8ff,e0e7ff' },
  { id: 'not-5', category: 'notionists', name: 'Lead Miguel', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Miguel&backgroundColor=ffedd5,fce7f3' },
  { id: 'not-6', category: 'notionists', name: 'Director Sophia', url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophia&backgroundColor=dbeafe,ecfdf5' },

  // Fun & Playful Avatars
  { id: 'fun-1', category: 'fun', name: 'Sparky Smile', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sparky&backgroundColor=ffdfbf,ffd5dc' },
  { id: 'fun-2', category: 'fun', name: 'Sunny Joy', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sunny&backgroundColor=b6e3f4,d1d4f9' },
  { id: 'fun-3', category: 'fun', name: 'Cool Breeze', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=c0aede,ffd5dc' },
  { id: 'fun-4', category: 'fun', name: 'Star Beam', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star&backgroundColor=ffd5dc,ffdfbf' },
  { id: 'fun-5', category: 'fun', name: 'Thumbs Up Ace', url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Ace&backgroundColor=b6e3f4,c0aede' },
  { id: 'fun-6', category: 'fun', name: 'Thumbs Up Nova', url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Nova&backgroundColor=ffd5dc,d1d4f9' },

  // Bottts / Tech & Innovation Avatars
  { id: 'bot-1', category: 'bottts', name: 'TechBot Orion', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orion&backgroundColor=b6e3f4,c0aede' },
  { id: 'bot-2', category: 'bottts', name: 'RoboYouth Spark', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Spark&backgroundColor=d1d4f9,ffd5dc' },
  { id: 'bot-3', category: 'bottts', name: 'DataBot Pixel', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=ffdfbf,b6e3f4' },
  { id: 'bot-4', category: 'bottts', name: 'CyberUnit Astro', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Astro&backgroundColor=c0aede,d1d4f9' },

  // Geometric & Abstract Shapes
  { id: 'shp-1', category: 'shapes', name: 'Prism Horizon', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Horizon&backgroundColor=b6e3f4,ffd5dc' },
  { id: 'shp-2', category: 'shapes', name: 'Vibrant Pulse', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Pulse&backgroundColor=c0aede,ffdfbf' },
  { id: 'shp-3', category: 'shapes', name: 'Civic Emblem', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Civic&backgroundColor=d1d4f9,b6e3f4' },
  { id: 'shp-4', category: 'shapes', name: 'Pagasa Solar', url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Pagasa&backgroundColor=ffd5dc,c0aede' },
];

export const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({
  isOpen,
  onClose,
  userType = 'member',
  targetMemberId,
  memberId,
  initialAvatar,
  title
}) => {
  const { 
    currentUser, 
    currentMember,
    updateCurrentUser, 
    updateMember, 
    updateUserProfilePicture,
    members, 
    addToast 
  } = useApp();

  const effectiveMemberId = targetMemberId || memberId;

  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>('all');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [customUrl, setCustomUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize selected avatar on modal open
  useEffect(() => {
    if (isOpen) {
      const defaultAvatar = initialAvatar || 
        (effectiveMemberId ? members.find(m => m.id === effectiveMemberId || m.memberId === effectiveMemberId)?.profilePicture : null) || 
        currentMember?.profilePicture ||
        currentUser?.avatar || 
        AVATAR_PRESETS[0].url;
      
      setSelectedAvatar(defaultAvatar);
      setCustomUrl('');
      setActiveTab('presets');
      setSelectedCategory('all');
    }
  }, [isOpen, initialAvatar, effectiveMemberId, members, currentUser, currentMember]);

  if (!isOpen) return null;

  const filteredPresets = selectedCategory === 'all' 
    ? AVATAR_PRESETS 
    : AVATAR_PRESETS.filter(p => p.category === selectedCategory);

  // Handle local image file upload with lightweight compression
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (PNG, JPG, or WEBP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image is larger than 5MB. Please choose a smaller file.', 'warning');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setSelectedAvatar(compressedDataUrl);
          setIsProcessing(false);
          addToast('Image uploaded and optimized for your profile.', 'success');
        } else {
          setSelectedAvatar(e.target?.result as string);
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        addToast('Failed to load image file.', 'error');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      addToast('Error reading file.', 'error');
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileProcess(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedAvatar(customUrl.trim());
    addToast('Applied custom image URL.', 'info');
  };

  const handleSave = () => {
    if (!selectedAvatar) {
      addToast('Please select or upload an avatar.', 'warning');
      return;
    }

    const targetId = effectiveMemberId || currentMember?.id || currentUser?.id;

    // 1. If target member ID or current member is identified, update member profile
    if (targetId) {
      updateMember(targetId, { profilePicture: selectedAvatar });
    }

    // 2. Always update current logged-in user profile & session
    if (!effectiveMemberId || effectiveMemberId === currentUser?.id || effectiveMemberId === currentUser?.memberId || effectiveMemberId === currentMember?.id || userType === 'admin') {
      updateCurrentUser({ avatar: selectedAvatar });
      updateUserProfilePicture(selectedAvatar);
    }

    addToast('Profile avatar updated successfully!', 'success');
    onClose();
  };

  // Generate random avatar seed
  const handleRandomize = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    const styles = ['adventurer', 'lorelei', 'notionists', 'fun-emoji', 'bottts'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const newAvatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,ffd5dc,d1d4f9,ffdfbf`;
    setSelectedAvatar(newAvatarUrl);
    addToast('Generated a fresh unique avatar!', 'info');
  };

  const modalTitle = title || (userType === 'admin' ? 'Change Administrator Avatar' : 'Change Profile Picture');

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                {modalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Choose a vector avatar persona or upload your custom image
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Current Selection & Live Preview Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-4 sm:p-5 bg-gradient-to-br from-indigo-50/80 via-sky-50/60 to-slate-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white border-2 border-indigo-200 shadow-md overflow-hidden flex items-center justify-center p-1">
                  <img
                    src={selectedAvatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=PAGASA'}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover rounded-xl transition-all group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/adventurer/svg?seed=PAGASA';
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs border border-white">
                  Active
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 font-display">Live Preview</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    {userType === 'admin' ? 'Official Admin' : 'Member Badge'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  This avatar will be displayed across certificates, IDs, and registry tables.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Random Avatar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Avatar Choices</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Custom</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Direct Link</span>
            </button>
          </div>

          {/* TAB 1: AVATAR CHOICES (VECTOR / ILLUSTRATED ONLY) */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Avatars ({AVATAR_PRESETS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('adventurer')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'adventurer'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Youth Personas
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('lorelei')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'lorelei'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Modern Officers
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('notionists')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'notionists'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Minimal Art
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('fun')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'fun'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Playful & Emojis
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('bottts')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'bottts'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tech Bots
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('shapes')}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === 'shapes'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Emblems
                </button>
              </div>

              {/* Preset Avatar Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto p-1">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.url)}
                      className={`relative flex flex-col items-center p-2 rounded-2xl border text-center transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5 flex items-center justify-center">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 mt-1.5 truncate max-w-full">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />
              
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50/60'
                    : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag and drop an image
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports PNG, JPG, or WEBP (Max 5MB) • Auto-optimized to square avatar
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors pointer-events-none"
                >
                  Choose Image File
                </button>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Optimizing and sizing image...</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIRECT IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Direct Avatar or Icon Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/my-avatar.svg"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    disabled={!customUrl.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Link</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Paste any public image or SVG avatar URL from web sources.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Avatar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
