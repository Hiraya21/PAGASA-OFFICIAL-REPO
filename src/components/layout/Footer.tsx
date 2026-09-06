import React from 'react';
import { useApp } from '../../context/AppContext';
import { PagasaLogo } from '../common/PagasaLogo';
import { Shield, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, settings } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <PagasaLogo size={52} showText={false} />
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-base tracking-tight">
                  {settings.orgName}
                </h3>
                <p className="text-sky-400 text-[11px] font-semibold">
                  "{settings.tagline}"
                </p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              The official youth leadership, community development, and management information system of the Municipality of Guimba, Nueva Ecija.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.socialLinks?.facebook || settings.facebookUrl || 'https://facebook.com/pagasaguimbayouth'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-slate-800"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.instagram || settings.instagramUrl || 'https://instagram.com/pagasaguimbayouth'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-pink-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-slate-800"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.youtube || settings.youtubeUrl || 'https://youtube.com/@pagasaguimbayouth'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors border border-slate-800"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <p className="text-white font-bold text-xs uppercase tracking-wider">
              Explore Portal
            </p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-sky-400 transition-colors">
                  About the Organization
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('officials')} className="hover:text-sky-400 transition-colors">
                  Organization Officials
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('events')} className="hover:text-sky-400 transition-colors">
                  Upcoming Events & Seminars
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('projects')} className="hover:text-sky-400 transition-colors">
                  Community Projects
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('activities')} className="hover:text-sky-400 transition-colors">
                  Youth Activities & Workshops
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-sky-400 transition-colors">
                  Activity Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Member Services */}
          <div className="space-y-3">
            <p className="text-white font-bold text-xs uppercase tracking-wider">
              Youth Services
            </p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('join')} className="hover:text-sky-400 transition-colors">
                  Join as Member (Registration)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('member-qr')} className="hover:text-sky-400 transition-colors">
                  Digital QR Pass
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('announcements')} className="hover:text-sky-400 transition-colors">
                  Public Announcements
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin-attendance')} className="hover:text-sky-400 transition-colors">
                  QR Attendance System
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin-certificates')} className="hover:text-sky-400 transition-colors">
                  Certificate Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <p className="text-white font-bold text-xs uppercase tracking-wider">
              Guimba Youth Secretariat
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span className="truncate">{settings.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>
            © {new Date().getFullYear()} PAGASA Guimba Youth Organization. All rights reserved. Guimba, Nueva Ecija.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentPage('about')} className="hover:text-slate-300">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('about')} className="hover:text-slate-300">Terms of Governance</button>
            <span>•</span>
            <button onClick={() => setCurrentPage('admin-dashboard')} className="hover:text-sky-400 font-semibold text-slate-400">
              Admin MIS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
