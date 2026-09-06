import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Pin, 
  Check, 
  Eye, 
  X,
  Calendar
} from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, currentUser, addToast, confirmAction } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('General Notice');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const filteredAnn = announcements.filter(a => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    return (a.title || '').toLowerCase().includes(q) ||
           (a.category || '').toLowerCase().includes(q);
  });

  const handleOpenCreate = () => {
    setEditingAnn(null);
    setTitle('');
    setCategory('General Notice');
    setContent('');
    setIsPinned(false);
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setCategory(ann.category);
    setContent(ann.content);
    setIsPinned(ann.isPinned);
    setIsPublished(ann.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingAnn) {
      updateAnnouncement(editingAnn.id, {
        title,
        category,
        content,
        summary: content.slice(0, 120) + '...',
        isPinned,
        isPublished
      });
      addToast(`Bulletin "${title}" updated.`, 'success');
    } else {
      addAnnouncement({
        title,
        category,
        content,
        summary: content.slice(0, 120) + '...',
        author: currentUser?.name || 'Central Secretariat',
        authorRole: currentUser?.role || 'Admin',
        isPinned,
        isPublished,
        date: new Date().toISOString().split('T')[0]
      });
      addToast(`New bulletin "${title}" published.`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Announcements & Advisories
          </h1>
          <p className="text-xs text-slate-500">
            Issue municipal youth policies, event advisories, emergency alerts, and scholarship notices.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Bulletin Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnn.map((ann) => (
                <tr key={ann.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {ann.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                      <span>{ann.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {ann.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{ann.author}</td>
                  <td className="py-3 px-4 text-slate-500">{ann.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1.5">
                      {ann.isPublished ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmAction({
                            title: 'Delete Announcement',
                            message: `Are you sure you want to delete "${ann.title}"? This bulletin will be removed from both the public portal and the member dashboard.`,
                            confirmText: 'Delete Notice',
                            cancelText: 'Cancel',
                            variant: 'danger',
                            itemDetails: {
                              label: 'Announcement Title',
                              value: ann.title,
                              subValue: `Category: ${ann.category} • Author: ${ann.author}`
                            },
                            onConfirm: () => {
                              deleteAnnouncement(ann.id);
                              addToast('Announcement deleted.', 'info');
                            }
                          });
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Announcement"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingAnn ? 'Edit Bulletin' : 'Issue New Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Urgent Advisory">Urgent Advisory</option>
                  <option value="General Notice">General Notice</option>
                  <option value="Event Advisory">Event Advisory</option>
                  <option value="Project Update">Project Update</option>
                  <option value="Opportunities">Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bulletin Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type the official message..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Pin to top of bulletins</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Published immediately</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2"
              >
                {editingAnn ? 'Save Changes' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
