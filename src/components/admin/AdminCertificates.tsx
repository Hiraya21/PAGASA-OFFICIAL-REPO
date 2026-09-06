import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Award, 
  Plus, 
  Search, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X,
  FileCheck,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminCertificates: React.FC = () => {
  const { certificates, members, events, issueCertificate, deleteCertificate, addToast, confirmAction } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Form
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.memberId || '');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [certType, setCertType] = useState<'Participation' | 'Completion' | 'Recognition' | 'Appreciation' | 'Leadership'>('Participation');
  const [customDescription, setCustomDescription] = useState('');

  // Verification test tool
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<CertificateItem | null | 'NOT_FOUND'>(null);

  const filteredCerts = certificates.filter(c => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    return (c.recipientName || '').toLowerCase().includes(q) ||
           (c.certificateNumber || '').toLowerCase().includes(q) ||
           (c.eventTitle || '').toLowerCase().includes(q);
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find(m => m.memberId === selectedMemberId);
    const targetEvent = events.find(e => e.id === selectedEventId);

    if (!targetMember || !targetEvent) return;

    const issued = issueCertificate({
      memberId: targetMember.memberId,
      recipientName: targetMember.fullName,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      certificateType: certType,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description: customDescription || `For active and meritorious participation in the ${targetEvent.title} held at ${targetEvent.venue}.`,
      signatories: [
        { name: 'Hon. Alexis Ramos', title: 'President, PAGASA Guimba', signatureUrl: '' },
        { name: 'Hon. Maria Santos', title: 'Secretary General', signatureUrl: '' }
      ]
    });

    addToast(`Issued Certificate ${issued.certificateNumber} to ${targetMember.fullName}`, 'success');
    setIsIssueModalOpen(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    const found = certificates.find(c => 
      c.certificateNumber.toLowerCase() === verifyInput.trim().toLowerCase() ||
      c.qrVerificationCode.toLowerCase() === verifyInput.trim().toLowerCase()
    );

    if (found) {
      setVerifyResult(found);
    } else {
      setVerifyResult('NOT_FOUND');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            E-Certificate Management & Verification
          </h1>
          <p className="text-xs text-slate-500">
            Generate QR-verifiable official certificates of participation, leadership, and appreciation.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* QR Certificate Verification Tool Box */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm font-display">
            Official Certificate Authenticity Verifier
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Enter any Certificate Number or scanned QR hash to verify official municipal authenticity.
        </p>

        <form onSubmit={handleVerify} className="flex gap-2 max-w-lg">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            placeholder="e.g. CERT-2026-001 or QR verification hash..."
            className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Verify Certificate
          </button>
        </form>

        {verifyResult && verifyResult !== 'NOT_FOUND' && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs space-y-2 text-emerald-100">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>OFFICIALLY VERIFIED GENUINE MUNICIPAL CERTIFICATE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-200">
              <div>Recipient: <strong className="text-white">{verifyResult.recipientName}</strong></div>
              <div>Event: <strong className="text-white">{verifyResult.eventTitle}</strong></div>
              <div>Issued: <strong className="text-white">{verifyResult.issueDate}</strong></div>
            </div>
          </div>
        )}

        {verifyResult === 'NOT_FOUND' && (
          <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-300">
            ⚠️ No certificate record matching "{verifyInput}" was found in the PAGASA Guimba registry.
          </div>
        )}
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900 font-display">
            Issued Certificates Directory ({filteredCerts.length})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipient or certificate #..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Certificate No.</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Event Assembly</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {c.certificateNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {c.recipientName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {c.certificateType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                    {c.eventTitle}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{c.issueDate}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(c)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print & View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmAction({
                            title: 'Revoke / Delete Certificate',
                            message: `Are you sure you want to delete certificate #${c.certificateNumber} issued to ${c.recipientName}?`,
                            confirmText: 'Delete Certificate',
                            cancelText: 'Cancel',
                            variant: 'danger',
                            itemDetails: {
                              label: 'Certificate Credentials',
                              value: `${c.certificateNumber} — ${c.recipientName}`,
                              subValue: `${c.certificateType} Certificate • ${c.eventTitle}`
                            },
                            onConfirm: () => {
                              deleteCertificate(c.id);
                              addToast(`Certificate #${c.certificateNumber} deleted.`, 'info');
                            }
                          });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-display">Issue E-Certificate</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Member *</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.memberId}>
                      {m.fullName} ({m.memberId} - Brgy. {m.barangay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Event / Assembly *</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Participation">Certificate of Participation</option>
                  <option value="Completion">Certificate of Completion</option>
                  <option value="Recognition">Certificate of Recognition</option>
                  <option value="Appreciation">Certificate of Appreciation</option>
                  <option value="Leadership">Certificate of Leadership Excellence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Citation / Wording</label>
                <textarea
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Leave blank for automatic default citation..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2"
              >
                Generate & Issue Certificate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
