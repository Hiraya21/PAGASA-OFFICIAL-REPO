import React from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { PagasaLogo } from './PagasaLogo';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { settings } = useApp();

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Modal Controls (Sticky Header - Hidden in Print) */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between gap-3 no-print flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">Official Certificate View & Print</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Certificate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame (Scrollable Container) */}
        <div className="p-3 sm:p-8 md:p-12 bg-slate-100 flex justify-center overflow-y-auto flex-1">
          <div className="w-full max-w-3xl border-4 sm:border-8 border-double border-blue-900 p-4 sm:p-8 md:p-12 bg-white relative rounded-sm text-center shadow-inner">
            {/* Ornate corner stamps */}
            <div className="absolute top-2 left-2 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-blue-900" />
            <div className="absolute top-2 right-2 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-blue-900" />
            <div className="absolute bottom-2 left-2 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-l-2 border-blue-900" />
            <div className="absolute bottom-2 right-2 w-6 sm:w-8 h-6 sm:h-8 border-b-2 border-r-2 border-blue-900" />

            {/* Header / Seal */}
            <div className="flex flex-col items-center space-y-2 mb-4 sm:mb-6">
              <PagasaLogo size={56} showText={false} />
              <p className="text-[10px] sm:text-xs tracking-widest font-semibold uppercase text-slate-600">
                Republic of the Philippines • Municipality of Guimba, Nueva Ecija
              </p>
              <h2 className="text-base sm:text-xl font-bold uppercase tracking-wider text-blue-950 font-display">
                {settings.orgName}
              </h2>
              <p className="text-[11px] sm:text-xs italic text-slate-500 font-serif">
                "{settings.tagline}"
              </p>
            </div>

            {/* Certificate Title */}
            <div className="my-4 sm:my-6">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3 sm:px-4 py-1 rounded-full border border-amber-300">
                Certificate of {certificate.certificateType}
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-2 sm:mt-3 uppercase tracking-wider">This is proudly presented to</p>
              
              <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-blue-900 tracking-wide mt-2 border-b-2 border-amber-500/40 pb-2 inline-block px-4 sm:px-8 break-words max-w-full">
                {certificate.memberName}
              </h1>
            </div>

            {/* Body Description */}
            <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-xl mx-auto leading-relaxed my-4 sm:my-6 font-serif">
              {certificate.description}
            </p>

            <div className="text-[11px] sm:text-xs text-slate-600 font-semibold mb-6 sm:mb-8">
              Given this <span className="font-bold text-slate-900">{new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> at Guimba, Nueva Ecija, Philippines.
            </div>

            {/* Signatures & QR Code Section */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-end gap-4 sm:gap-6 text-left">
              {/* Signatory 1 */}
              <div className="text-center sm:text-left">
                <div className="h-8 sm:h-10 flex items-center justify-center sm:justify-start">
                  <div className="font-serif italic text-blue-900 text-xs sm:text-sm font-bold opacity-80 underline decoration-blue-400">
                    {certificate.signatories?.[0]?.name || 'Gian Carlo Magat'}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">{certificate.signatories?.[0]?.name || 'Gian Carlo Magat'}</p>
                  <p className="text-[10px] text-slate-500">{certificate.signatories?.[0]?.position || 'President, PAGASA Guimba'}</p>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center text-center my-2 sm:my-0">
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
                  <QRCodeSVG value={certificate.qrVerificationUrl || `https://pagasa-guimba.org/verify/${certificate.certificateNumber}`} size={56} />
                </div>
                <p className="text-[9px] font-mono text-slate-500 mt-1">
                  {certificate.certificateNumber}
                </p>
                <span className="text-[9px] text-emerald-700 flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 inline" /> Verified Authenticity
                </span>
              </div>

              {/* Signatory 2 */}
              <div className="text-center sm:text-right">
                <div className="h-8 sm:h-10 flex items-center justify-center sm:justify-end">
                  <div className="font-serif italic text-blue-900 text-xs sm:text-sm font-bold opacity-80 underline decoration-blue-400">
                    {certificate.signatories?.[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">
                    {certificate.signatories?.[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {certificate.signatories?.[1]?.position || 'Vice President, PAGASA Guimba'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
