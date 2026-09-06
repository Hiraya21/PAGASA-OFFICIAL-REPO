import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Image as ImageIcon, Search, Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['ALL', 'Leadership Summits', 'Environmental Action', 'Community Outreach', 'Sports & Tournaments', 'Digital Workshops'];

  const filteredPhotos = gallery.filter(item => {
    return selectedCategory === 'ALL' || item.category === selectedCategory;
  });

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Visual Memories
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Photo & Media Gallery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Explore captured moments from our youth summits, sports leagues, disaster relief missions, and community caravans in Guimba.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Photos' : cat}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
          >
            <div className="relative h-60 overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                {item.category}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm font-display line-clamp-1 group-hover:text-blue-700">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center justify-between">
                <span>{item.date}</span>
                <span className="text-[11px] truncate max-w-[120px]">{item.eventTag}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full text-center space-y-3">
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="max-h-[75vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain border border-white/10"
            />
            <div className="text-white space-y-1">
              <span className="text-xs font-bold uppercase text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-800 inline-block">
                {activePhoto.category}
              </span>
              <h3 className="text-lg font-bold">{activePhoto.title}</h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto">{activePhoto.description}</p>
              <p className="text-[11px] text-slate-400">{activePhoto.date} • {activePhoto.eventTag}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
