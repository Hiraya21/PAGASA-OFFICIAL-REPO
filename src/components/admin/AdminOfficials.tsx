import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Official } from '../../types';
import { ShieldCheck, Plus, Edit3, Trash2, X, Mail, Phone } from 'lucide-react';

export const AdminOfficials: React.FC = () => {
  const { officials, addOfficial, updateOfficial, deleteOfficial, addToast, confirmAction } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [committee, setCommittee] = useState('');
  const [term, setTerm] = useState('2025–2027');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  const handleOpenCreate = () => {
    setEditingOfficial(null);
    setName('');
    setPosition('Committee Chairperson');
    setCommittee('Youth Development Committee');
    setTerm('2025–2027');
    setEmail('');
    setContact('0917-000-0000');
    setBio('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (o: Official) => {
    setEditingOfficial(o);
    setName(o.name);
    setPosition(o.position);
    setCommittee(o.committee);
    setTerm(o.term);
    setEmail(o.email);
    setContact(o.contactNumber);
    setBio(o.bio);
    setImage(o.image);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    if (editingOfficial) {
      updateOfficial(editingOfficial.id, {
        name,
        position,
        committee,
        term,
        email,
        contactNumber: contact,
        bio,
        image
      });
      addToast(`Official "${name}" updated.`, 'success');
    } else {
      addOfficial({
        name,
        position,
        committee,
        term,
        email,
        contactNumber: contact,
        bio,
        image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        order: officials.length + 1
      });
      addToast(`New official "${name}" added to roster.`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Executive Roster & Officials
          </h1>
          <p className="text-xs text-slate-500">
            Manage organization officers, executive council seats, and committee chairs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Officer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officials.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <img src={o.image} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {o.term}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{o.name}</h3>
                <p className="text-xs text-blue-700 font-semibold">{o.position}</p>
                <p className="text-[11px] text-slate-500">{o.committee}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{o.bio}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                <span>{o.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(o)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confirmAction({
                      title: 'Remove Officer / Official',
                      message: `Are you sure you want to remove ${o.name} from the official leadership roster?`,
                      confirmText: 'Remove Officer',
                      cancelText: 'Cancel',
                      variant: 'danger',
                      itemDetails: {
                        label: 'Official Profile',
                        value: o.name,
                        subValue: `Position: ${o.position} • Committee: ${o.committee}`
                      },
                      onConfirm: () => {
                        deleteOfficial(o.id);
                        addToast('Official removed from roster.', 'info');
                      }
                    });
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Remove Officer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingOfficial ? 'Edit Officer' : 'Add New Officer'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Position / Title</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Term</label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Committee</label>
                  <input
                    type="text"
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Biography</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors mt-2"
              >
                {editingOfficial ? 'Save Updates' : 'Add to Roster'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
