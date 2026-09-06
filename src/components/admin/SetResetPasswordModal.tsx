import React, { useState } from 'react';
import { Member } from '../../types';
import { KeyRound, Sparkles, Eye, EyeOff, Shield, Send, Lock, X, RefreshCw } from 'lucide-react';
import { generateTemporaryPassword, validatePasswordStrength } from '../../utils/security';

interface SetResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSavePassword: (password: string, requireChange: boolean, sendEmail: boolean) => Promise<void>;
}

export const SetResetPasswordModal: React.FC<SetResetPasswordModalProps> = ({
  isOpen,
  onClose,
  member,
  onSavePassword
}) => {
  const [mode, setMode] = useState<'generate' | 'custom'>('generate');
  const [customPassword, setCustomPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState(() => generateTemporaryPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [requireChange, setRequireChange] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentPasswordValue = mode === 'generate' ? generatedPassword : customPassword;
  const strength = validatePasswordStrength(currentPasswordValue);

  const handleRegenerate = () => {
    setGeneratedPassword(generateTemporaryPassword());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPasswordValue.trim()) return;

    setIsSubmitting(true);
    try {
      await onSavePassword(currentPasswordValue.trim(), requireChange, sendEmail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {member.passwordHash ? 'Reset Member Password' : 'Set Member Portal Password'}
              </h3>
              <p className="text-xs text-slate-500">
                For <strong>{member.fullName}</strong> ({member.memberId})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Info Pill */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Login Username (Gmail):</span>
            <strong className="text-blue-700">{member.email}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Current Security Status:</span>
            <span className={`font-sans font-bold text-[11px] ${member.passwordHash ? 'text-emerald-700' : 'text-amber-700'}`}>
              {member.passwordHash ? 'SHA-256 Hash Active' : 'No Password Configured'}
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('generate')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'generate'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Auto-Generate Secure</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Enter Custom Password</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'generate' ? (
            /* Auto-Generated Temporary Password */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Generated Temporary Password</label>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-base font-bold flex items-center justify-between border border-slate-800">
                <span className="tracking-widest">{generatedPassword}</span>
                <span className="text-[10px] text-emerald-300 font-sans bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  Strong & Ready
                </span>
              </div>
            </div>
          ) : (
            /* Custom Password Input */
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Enter New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Enter at least 8 characters..."
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {customPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">Strength:</span>
                    <span className={`font-bold ${
                      strength.score >= 4 ? 'text-emerald-600' :
                      strength.score >= 3 ? 'text-blue-600' :
                      strength.score >= 2 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {strength.feedback[0] || (strength.isValid ? 'Strong' : 'Weak')}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all ${
                          strength.score >= step
                            ? step >= 4 ? 'bg-emerald-500' :
                              step >= 3 ? 'bg-blue-500' :
                              step >= 2 ? 'bg-amber-500' : 'bg-rose-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checkbox Options */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2.5 text-xs">
            <label className="flex items-start gap-2 text-slate-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={requireChange}
                onChange={(e) => setRequireChange(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <span>
                <strong>Require password change</strong> upon next member login
              </span>
            </label>

            <label className="flex items-start gap-2 text-slate-800 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <span>
                <strong>Send notification email</strong> with new credentials to <span className="underline">{member.email}</span>
              </span>
            </label>
          </div>

          {/* Security Note */}
          <p className="text-[11px] text-slate-500 italic">
            Note: The password will be hashed using SHA-256 before storage. It will be shown only once upon saving.
          </p>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !currentPasswordValue.trim()}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Hashing & Saving...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Save & Hash Password (SHA-256)</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
