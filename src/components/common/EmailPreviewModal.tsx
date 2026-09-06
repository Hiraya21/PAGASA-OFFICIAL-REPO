import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  RefreshCw,
  AlertCircle,
  FileCode,
  Eye,
  Check,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { 
  CredentialEmailPayload, 
  generateCredentialWelcomeEmailHtml,
  getGmailComposeUrl,
  getMailtoUrl,
  copyFormattedCredentials
} from '../../services/emailService';
import { 
  isGmailConnected, 
  getConnectedGmailEmail, 
  sendEmailViaGmailApi 
} from '../../services/gmailService';
import { useApp } from '../../context/AppContext';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: CredentialEmailPayload | null;
  onResend?: (payload: CredentialEmailPayload) => Promise<void>;
  deliveryStatus?: 'Delivered' | 'Pending' | 'Failed';
  deliveryDate?: string;
  deliveryError?: string;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  payload,
  onResend,
  deliveryStatus: initialDeliveryStatus = 'Delivered',
  deliveryDate: initialDeliveryDate,
  deliveryError: initialDeliveryError
}) => {
  const { showToast, loginWithGoogle } = useApp();
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'plaintext'>('preview');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingGmailApi, setIsSendingGmailApi] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<'Delivered' | 'Pending' | 'Failed'>(initialDeliveryStatus);
  const [deliveryDate, setDeliveryDate] = useState<string | undefined>(initialDeliveryDate);
  const [deliveryError, setDeliveryError] = useState<string | undefined>(initialDeliveryError);

  if (!isOpen || !payload) return null;

  const emailData = generateCredentialWelcomeEmailHtml(payload);
  const gmailComposeUrl = getGmailComposeUrl(payload);
  const mailtoUrl = getMailtoUrl(payload);
  const gmailConnected = isGmailConnected();
  const connectedEmail = getConnectedGmailEmail() || 'morangian31@gmail.com';

  const handleCopy = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResendClick = async () => {
    if (!onResend) return;
    setIsSending(true);
    try {
      await onResend(payload);
      setDeliveryStatus('Delivered');
      setDeliveryDate(new Date().toISOString());
      setDeliveryError(undefined);
    } catch (err: any) {
      setDeliveryError(err?.message || 'Server dispatch error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendViaGmailApi = async () => {
    setShowConfirmModal(false);
    setIsSendingGmailApi(true);
    try {
      const res = await sendEmailViaGmailApi({
        to: payload.to,
        subject: emailData.subject,
        htmlContent: emailData.html,
        plainTextContent: emailData.plainText,
        fromName: 'PAGASA Guimba Youth Organization',
        replyTo: connectedEmail
      });

      if (res.success) {
        setDeliveryStatus('Delivered');
        setDeliveryDate(new Date().toISOString());
        setDeliveryError(undefined);
        showToast(
          'success',
          'Email Sent via Official Gmail API!',
          `Credentials successfully dispatched from ${connectedEmail} to ${payload.to} (Message ID: ${res.messageId})`
        );
      } else {
        setDeliveryStatus('Failed');
        setDeliveryError(res.error);
        showToast('error', 'Gmail API Dispatch Failed', res.error || 'Could not send message.');
      }
    } catch (err: any) {
      setDeliveryStatus('Failed');
      setDeliveryError(err?.message || 'Gmail API Error');
      showToast('error', 'Gmail API Dispatch Error', err?.message || 'Unexpected error.');
    } finally {
      setIsSendingGmailApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh] relative">
        
        {/* User Confirmation Modal for Mutating Workspace Operation (Send Email) */}
        {showConfirmModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Confirm Gmail Dispatch</h4>
                  <p className="text-xs text-slate-500">Google Workspace Gmail API</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to send this official credential welcome email to <strong className="text-slate-900">{payload.to}</strong> directly from your authorized Google account (<strong className="text-blue-700">{connectedEmail}</strong>)?
              </p>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 font-mono">
                <div><strong>To:</strong> {payload.to}</div>
                <div><strong>Member:</strong> {payload.recipientName} ({payload.memberId})</div>
                <div><strong>Subject:</strong> {emailData.subject}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendViaGmailApi}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yes, Send Email via Gmail</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 text-blue-400 rounded-xl border border-blue-500/20">
              <Mail className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-display">
                  Automated Credential Dispatch Center
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  deliveryStatus === 'Delivered' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : deliveryStatus === 'Failed'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {deliveryStatus === 'Delivered' ? '✓ Dispatched / Recorded' : deliveryStatus === 'Failed' ? '✕ Delivery Issue' : '⏳ Pending'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Recipient: <span className="text-white font-mono font-bold">{payload.to}</span> ({payload.recipientName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Send & Action Bar */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-b border-blue-100 p-3 px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Send Options:</span>

            {/* Direct Gmail API Button */}
            {gmailConnected ? (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isSendingGmailApi}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title={`Send directly via Gmail API from ${connectedEmail}`}
              >
                <Send className={`w-3.5 h-3.5 ${isSendingGmailApi ? 'animate-pulse' : ''}`} />
                <span>{isSendingGmailApi ? 'Sending via Gmail...' : 'Send via Official Gmail API'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Connect Google account to send via Gmail REST API"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Connect Gmail API</span>
              </button>
            )}

            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Open prepared Gmail composer in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Gmail Web</span>
            </a>

            <a
              href={mailtoUrl}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Open system default email client"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Default Mail App</span>
            </a>

            <button
              onClick={() => handleCopy(emailData.plainText)}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
            </button>
          </div>

          {onResend && (
            <button
              onClick={handleResendClick}
              disabled={isSending}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ml-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Triggering Server...' : 'Trigger Server API'}</span>
            </button>
          )}
        </div>

        {/* Info & Delivery Meta Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">From: </span>
              <span className="font-semibold text-blue-700 font-mono">{connectedEmail}</span>
              {gmailConnected && (
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Gmail API Active
                </span>
              )}
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Subject: </span>
              <span className="font-medium text-slate-900">{emailData.subject}</span>
            </div>
            {deliveryDate && (
              <div>
                <span className="text-slate-400 font-semibold">Dispatched: </span>
                <span className="font-mono text-slate-700">{new Date(deliveryDate).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> Visual Preview
              </span>
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === 'html' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1">
                <FileCode className="w-3 h-3" /> HTML Code
              </span>
            </button>
            <button
              onClick={() => setActiveTab('plaintext')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeTab === 'plaintext' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain Text
            </button>
          </div>
        </div>

        {deliveryError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Delivery Notice: {deliveryError}. You can send directly using "Open in Gmail Web" or retry via the server.</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60">
          {activeTab === 'preview' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto">
              <iframe
                title="Email Preview"
                srcDoc={emailData.html}
                className="w-full h-[480px] border-0"
              />
            </div>
          )}

          {activeTab === 'html' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(emailData.html)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copied' : 'Copy HTML'}</span>
              </button>
              <pre className="bg-slate-900 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-[480px]">
                {emailData.html}
              </pre>
            </div>
          )}

          {activeTab === 'plaintext' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(emailData.plainText)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md hover:bg-slate-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <pre className="bg-white border border-slate-200 text-slate-800 p-6 rounded-2xl text-xs font-mono whitespace-pre-wrap max-h-[480px]">
                {emailData.plainText}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Includes official PAGASA organization seal, login URL, and credentials guidance.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
