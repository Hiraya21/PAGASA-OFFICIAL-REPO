import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  Clock, 
  User, 
  Globe 
} from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(l => {
    const matchesAction = selectedAction === 'ALL' || (l.action || '').toLowerCase().includes(selectedAction.toLowerCase());
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return matchesAction;
    const matchesSearch = (l.action || '').toLowerCase().includes(q) ||
                          (l.performedBy || '').toLowerCase().includes(q) ||
                          (l.details || '').toLowerCase().includes(q);
    return matchesAction && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Action', 'Performed By', 'Role', 'Details', 'IP Address', 'Timestamp'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.action}"`,
      `"${l.performedBy}"`,
      `"${l.performedByRole}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || '127.0.0.1'}"`,
      `"${l.timestamp}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAGASA_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Audit trail exported successfully.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-display font-bold text-slate-900">
              System Audit Trail & Security Logs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable tracking of administrator actions, attendance scans, member approvals, and settings changes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, officer, or details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Actions</option>
          <option value="CREDENTIAL">Credentials & Password Actions</option>
          <option value="ATTENDANCE">Attendance Scans</option>
          <option value="MEMBER">Member Management</option>
          <option value="EVENT">Event Operations</option>
          <option value="CERTIFICATE">Certificates</option>
          <option value="AUTH">Authentication</option>
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {log.performedBy}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {log.performedByRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[10px]">
                    {log.ipAddress || '192.168.1.42'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
