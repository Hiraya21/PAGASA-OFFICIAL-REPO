import React, { useState } from 'react';
import { Shield, KeyRound, Copy, Check, CheckCircle2, Send, AlertTriangle, X } from 'lucide-react';

interface OneTimePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberId: string;
  email: string;
  generatedPassword: string;
  emailSent?: boolean;
}

export const OneTimePasswordModal: React.FC<OneTimePasswordModalProps> = ({
  isOpen,
  onClose,
  memberName,
  memberId,
  email,
  generatedPassword,
  emailSent = true
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = [
      `PAGASA Guimba Member Portal Credentials`,
      `Youth Member: ${memberName}`,
      `Member ID: ${memberId}`,
      `Login Username (Gmail): ${email}`,
      `Password: ${generatedPassword}`,
      `Portal Sign In: ${window.location.origin}`,
      ``,
      `Note: This password was encrypted using SHA-256 upon storage. Please keep it secure.`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Password Generated & Encrypted
            </h3>
            <p className="text-xs text-slate-500">
              Credentials configured for <strong className="text-slate-700">{memberName}</strong>
            </p>
          </div>
        </div>

        {/* Security Warning Badge */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">One-Time Password Display</p>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              This password is cryptographically hashed (SHA-256) and saved. For member security, plaintext passwords are never stored and cannot be retrieved again.
            </p>
          </div>
        </div>

        {/* Credentials Display Box */}
        <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 font-mono text-xs border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
            <span>LOGIN USERNAME:</span>
            <span className="text-sky-300 font-bold">{email}</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>NEW PASSWORD:</span>
              <span className="text-emerald-400 font-sans text-[10px] font-bold">SHA-256 HASH STORED</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 tracking-wider select-all break-all">
                {generatedPassword}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {emailSent && (
            <div className="flex items-center gap-1.5 text-[11px] text-sky-400 pt-1 border-t border-slate-800">
              <Send className="w-3 h-3 flex-shrink-0" />
              <span className="font-sans">Credentials notification email dispatched to {email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>{isCopied ? 'Credentials Copied!' : 'Copy Portal Credentials'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
          >
            I Have Copied / Done
          </button>
        </div>
      </div>
    </div>
  );
};
