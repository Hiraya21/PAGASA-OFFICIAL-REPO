import React, { useState } from 'react';
import { Member } from '../../types';
import { UserX, AlertTriangle, X } from 'lucide-react';

interface RejectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onConfirmReject: (reason: string) => Promise<void> | void;
}

export const RejectMemberModal: React.FC<RejectMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onConfirmReject
}) => {
  const [selectedPreset, setSelectedPreset] = useState('Does not meet residency requirements (must be a Guimba resident)');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const presets = [
    'Does not meet residency requirements (must be a Guimba resident)',
    'Ineligible age bracket (outside official youth criteria)',
    'Incomplete or unverified contact/residency details',
    'Duplicate membership application profile',
    'Other (enter custom reason below)'
  ];

  const effectiveReason = selectedPreset === 'Other (enter custom reason below)'
    ? customReason.trim() || 'Application rejected by administrator'
    : selectedPreset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmReject(effectiveReason);
      onClose();
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
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Reject Membership Application
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

        {/* Warning Banner */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-900">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>
            Rejecting this application will set the account status to <strong>Rejected</strong> and prevent portal access. The applicant will be informed if they attempt to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Reason for Rejection
            </label>
            <div className="space-y-1.5">
              {presets.map((p) => (
                <label
                  key={p}
                  className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedPreset === p
                      ? 'bg-rose-50/60 border-rose-300 text-rose-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectionReasonPreset"
                    checked={selectedPreset === p}
                    onChange={() => setSelectedPreset(p)}
                    className="mt-0.5 text-rose-600"
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedPreset === 'Other (enter custom reason below)' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Custom Rejection Details *
              </label>
              <textarea
                rows={3}
                required
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Explain why this membership application was not approved..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserX className="w-4 h-4" />
              <span>Confirm & Reject Application</span>
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
