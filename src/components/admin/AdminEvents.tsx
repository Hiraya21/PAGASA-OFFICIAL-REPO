import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventItem } from '../../types';
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  QrCode,
  X,
  Eye,
  Layers
} from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, setCurrentPage, setSelectedEventId, addToast, confirmAction } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Youth Leadership');
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('8:00 AM - 5:00 PM');
  const [venue, setVenue] = useState('Guimba Municipal Gymnasium');
  const [description, setDescription] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(250);
  const [status, setStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'>('Upcoming');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80');

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch = (e.title || '').toLowerCase().includes(q) ||
                          (e.venue || e.location || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setCategory('Youth Leadership');
    setDate('2026-09-15');
    setTime('8:00 AM - 5:00 PM');
    setVenue('Guimba Municipal Gymnasium');
    setDescription('');
    setMaxCapacity(250);
    setStatus('Upcoming');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setCategory(evt.category);
    setDate(evt.date);
    setTime(evt.time);
    setVenue(evt.venue);
    setDescription(evt.description);
    setMaxCapacity(evt.maxCapacity);
    setStatus(evt.status);
    setBannerImage(evt.bannerImage);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title,
        category,
        date,
        time,
        venue,
        description,
        maxCapacity: Number(maxCapacity),
        status,
        bannerImage
      });
      addToast(`Event "${title}" updated.`, 'success');
    } else {
      addEvent({
        title,
        category,
        date,
        time,
        venue,
        description,
        maxCapacity: Number(maxCapacity),
        registeredCount: 0,
        status,
        isRegistrationOpen: true,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        organizer: 'PAGASA Guimba Central Executive Council',
        speakers: [
          { name: 'Hon. Municipal Youth Officer', title: 'Youth Governance Specialist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' }
        ],
        agenda: [
          { time: '08:00 AM', title: 'Opening Preliminaries & Roll Call' },
          { time: '09:30 AM', title: 'Main Keynote Session' },
          { time: '01:30 PM', title: 'Breakout Workshops & Resolutions' }
        ]
      });
      addToast(`New event "${title}" created!`, 'success');
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Events & Assemblies Management
          </h1>
          <p className="text-xs text-slate-500">
            Create municipal assemblies, monitor participant caps, and launch QR check-in desks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event title or venue..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Categories</option>
          <option value="Youth Leadership">Youth Leadership</option>
          <option value="Community Outreach">Community Outreach</option>
          <option value="Sports & Tournament">Sports & Tournament</option>
          <option value="Skills Training">Skills Training</option>
          <option value="Environmental Action">Environmental Action</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Schedule</th>
                <th className="py-3 px-4">Registered / Cap</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={evt.bannerImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{evt.title}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{evt.venue}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <p className="font-semibold">{evt.date}</p>
                    <p className="text-[11px] text-slate-400">{evt.time}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{evt.registeredCount}</span> / {evt.maxCapacity}
                    <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (evt.registeredCount / evt.maxCapacity) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      evt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      evt.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setCurrentPage('event-detail');
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                        title="Edit Event"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmAction({
                            title: 'Delete Event Assembly',
                            message: `Are you sure you want to delete "${evt.title}"? Registered participants and attendance links for this event will also be removed.`,
                            confirmText: 'Delete Event',
                            cancelText: 'Cancel',
                            variant: 'danger',
                            itemDetails: {
                              label: 'Event Details',
                              value: evt.title,
                              subValue: `Date: ${evt.date} • Venue: ${evt.venue}`
                            },
                            onConfirm: () => {
                              deleteEvent(evt.id);
                              addToast(`Event "${evt.title}" deleted.`, 'info');
                            }
                          });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Event"
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

      {/* Event Create / Edit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingEvent ? 'Edit Event' : 'Create New Youth Assembly'}
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2026 Guimba Youth Summit"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Youth Leadership">Youth Leadership</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Sports & Tournament">Sports & Tournament</option>
                    <option value="Skills Training">Skills Training</option>
                    <option value="Environmental Action">Environmental Action</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="8:00 AM - 5:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue (Guimba)</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity Cap</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Overview</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline purpose, target youth sectors, and event requirements..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2"
              >
                {editingEvent ? 'Save Event Updates' : 'Publish New Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
