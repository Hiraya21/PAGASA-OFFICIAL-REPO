import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, Trash2, X, Check } from 'lucide-react';

export interface ConfirmModalConfig {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  itemDetails?: {
    label: string;
    value: string;
    subValue?: string;
  };
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmModalProps {
  config: ConfirmModalConfig | null;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ config, onClose }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (config?.isOpen) {
      setIsProcessing(false);
      // Auto focus the action button
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [config?.isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!config?.isOpen) return;
      if (e.key === 'Escape' && !isProcessing) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config?.isOpen, isProcessing]);

  if (!config || !config.isOpen) return null;

  const {
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    itemDetails,
    onConfirm,
    onCancel
  } = config;

  const handleCancel = () => {
    if (isProcessing) return;
    if (onCancel) onCancel();
    onClose();
  };

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Confirmation action failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-600 border border-amber-200/80',
          icon: <AlertCircle className="w-6 h-6" />,
          btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
          badge: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100 text-blue-600 border border-blue-200/80',
          icon: <Info className="w-6 h-6" />,
          btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
          badge: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'danger':
      default:
        return {
          iconBg: 'bg-rose-100 text-rose-600 border border-rose-200/80',
          icon: <Trash2 className="w-6 h-6" />,
          btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20',
          badge: 'bg-rose-50 text-rose-700 border-rose-200'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      <div 
        id="confirm-modal-overlay" 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCancel();
        }}
      >
        <motion.div
          id="confirm-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${styles.iconBg}`}>
              {styles.icon}
            </div>

            <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
              <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 font-display leading-snug">
                {title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Item Preview (if specified) */}
          {itemDetails && (
            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                {itemDetails.label}
              </span>
              <p className="text-xs font-bold text-slate-800 break-words font-mono">
                {itemDetails.value}
              </p>
              {itemDetails.subValue && (
                <p className="text-[11px] text-slate-500">
                  {itemDetails.subValue}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="confirm-modal-cancel-btn"
              onClick={handleCancel}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {cancelText}
            </button>

            <button
              ref={confirmBtnRef}
              type="button"
              id="confirm-modal-confirm-btn"
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${styles.btn}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
