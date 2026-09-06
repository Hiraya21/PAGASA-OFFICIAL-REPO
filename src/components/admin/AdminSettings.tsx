import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
  Palette,
  Eye,
  Sparkles,
  Check,
  HardDrive
} from 'lucide-react';
import { ColorPalette, ThemeMode } from '../../types';

export const AdminSettings: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetToDefaults, 
    exportStateSnapshot,
    restoreStateSnapshot,
    getStorageMetrics,
    addToast,
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    colorPalette,
    setColorPalette,
    confirmAction
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orgName, setOrgName] = useState(settings.orgName);
  const [acronym, setAcronym] = useState(settings.acronym || 'PAGASA');
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [email, setEmail] = useState(settings.email);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber || settings.phone || '');
  const [facebook, setFacebook] = useState(settings.facebookUrl || settings.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(settings.instagramUrl || settings.socialLinks?.instagram || '');
  const [youtube, setYoutube] = useState(settings.youtubeUrl || settings.socialLinks?.youtube || '');

  const storageMetrics = getStorageMetrics();

  const palettes: { id: ColorPalette; name: string; hex: string; desc: string }[] = [
    { id: 'default', name: 'Civic Blue', hex: '#2563eb', desc: 'Standard municipal blue scheme' },
    { id: 'emerald', name: 'Emerald Youth', hex: '#059669', desc: 'Environmental & growth theme' },
    { id: 'purple', name: 'Royal Purple', hex: '#7c3aed', desc: 'Leadership & innovation tone' },
    { id: 'sunset', name: 'Sunset Orange', hex: '#ea580c', desc: 'Vibrant civic engagement' },
    { id: 'ocean', name: 'Ocean Cyan', hex: '#0284c7', desc: 'Clean high-readability cyan' },
    { id: 'high-contrast', name: 'High Contrast', hex: '#1d4ed8', desc: 'WCAG AAA enhanced border & text contrast' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      orgName,
      acronym,
      tagline,
      address,
      email,
      contactNumber,
      facebookUrl: facebook,
      instagramUrl: instagram,
      youtubeUrl: youtube,
      defaultTheme: theme,
      defaultPalette: colorPalette
    });
    addToast('System settings and preferences saved successfully!', 'success');
  };

  const handleBackupExport = () => {
    const fullSnapshot = exportStateSnapshot();
    const blob = new Blob([JSON.stringify(fullSnapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PAGASA_Guimba_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Structured JSON data snapshot exported successfully.', 'success');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const res = restoreStateSnapshot(parsed);
        if (res.success) {
          addToast('Snapshot imported & state restored successfully!', 'success');
        } else {
          addToast(res.message || 'Failed to restore snapshot', 'error');
        }
      } catch (err: any) {
        addToast('Invalid JSON file format: ' + (err?.message || 'Parse error'), 'error');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">
          System & Organization Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure municipal organization branding, accessibility display themes, and data management.
        </p>
      </div>

      {/* Theme & Display Accessibility Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 font-display">
                Theme & Accessibility Palette
              </h2>
              <p className="text-xs text-slate-500">
                Switch between Light & Dark modes and dynamically update CSS variables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
              Active: {effectiveTheme.toUpperCase()} MODE
            </span>
          </div>
        </div>

        {/* Display Mode Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Display Theme Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'light'
                  ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Light Theme</p>
                  {theme === 'light' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">Crisp, clean high-contrast daylight styling</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-900 border-blue-500 text-white ring-2 ring-blue-500/30 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dark Theme</p>
                  {theme === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Eye-comfort deep midnight palette</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all text-left cursor-pointer ${
                theme === 'system'
                  ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                <Laptop className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">System Sync</p>
                  {theme === 'system' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">Auto-match device OS preference</p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Color Palette Preset */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">Dynamic Color Palette (CSS Variables)</label>
            <span className="text-[11px] text-slate-500 font-mono">var(--primary)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {palettes.map((p) => {
              const isSelected = colorPalette === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setColorPalette(p.id)}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shadow-inner flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: p.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-bold text-base text-slate-900 font-display border-b border-slate-100 pb-3">
          Organization Profile & Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Acronym / Code</label>
            <input
              type="text"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Tagline</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secretariat Hotline</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters / Office Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <h2 className="font-bold text-base text-slate-900 font-display border-b border-slate-100 pb-3 pt-2">
          Social Media & Public Links
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Page</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>

      {/* Local Storage Provider Management & Snapshots */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-base text-slate-900 font-display flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span>Local Storage Provider & State Snapshots</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Client-side persistent database for users, attendance sessions, and municipal records.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-blue-900">
              Storage Used: {storageMetrics.formattedSize}
            </span>
          </div>
        </div>

        {/* Storage Quick Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Members</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{storageMetrics.itemCounts['members'] || 0} Registered</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Events</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{storageMetrics.itemCounts['events'] || 0} Scheduled</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Attendance</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{storageMetrics.itemCounts['attendance_records'] || 0} Logs</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Projects</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{storageMetrics.itemCounts['projects'] || 0} Tracked</p>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export State Snapshot</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Download a clean JSON archive containing all members, QR logs, events, and audit histories.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBackupExport}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Snapshot</span>
            </button>
          </div>

          <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Import & Restore Snapshot</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Restore application state from a previously saved JSON snapshot archive.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload & Restore Archive</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-rose-50/60 rounded-2xl border border-rose-200">
          <div className="space-y-0.5">
            <p className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Factory Reset Demonstration State</span>
            </p>
            <p className="text-[11px] text-rose-700">Restore all sample records, officials, and configurations to fresh initial state.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              confirmAction({
                title: 'Factory Reset All Records',
                message: 'Are you sure you want to reset all records, roster members, events, and configuration to the default demonstration factory state?',
                confirmText: 'Reset to Factory Defaults',
                cancelText: 'Cancel',
                variant: 'danger',
                itemDetails: {
                  label: 'System Action',
                  value: 'Re-initialize Local Storage & Demonstration Data',
                  subValue: 'All custom members, attendance sheets, and certificates created in this session will be restored to defaults.'
                },
                onConfirm: () => {
                  resetToDefaults();
                  addToast('System data restored to default factory state.', 'info');
                }
              });
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset To Default State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
