import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { PagasaLogo } from './PagasaLogo';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  memberId: string;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  memberId
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-[#1e1b4b] px-6 py-5 flex items-center justify-between text-white relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm flex-shrink-0">
                <PagasaLogo size={34} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    PAGASA GUIMBA MIS
                  </span>
                  <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-semibold rounded-full text-white">
                    Official Portal
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                  Registration Complete!
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 text-center space-y-5">
            {/* Green Checkmark Circle */}
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Member Account Ready!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Mabuhay! Your youth membership registration is active. Your assigned Member ID is:
              </p>
            </div>

            {/* Member ID Box */}
            <div className="inline-block px-8 py-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <span className="font-mono text-lg sm:text-xl font-bold text-blue-700 tracking-wide">
                {memberId || 'PAGASA-2026-0001'}
              </span>
            </div>

            {/* Green Callout Card */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl text-left space-y-1">
              <h4 className="text-xs font-bold text-emerald-950">
                Gmail Portal Access Enabled
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                You can now sign in using your registered Gmail address or 1-click Google OAuth.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onProceed}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Proceed to Member Portal
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
