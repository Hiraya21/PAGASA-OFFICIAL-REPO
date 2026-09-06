import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GUIMBA_BARANGAYS } from '../../data/mockData';
import { 
  BarChart3, 
  Printer, 
  Download, 
  Users, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  FileSpreadsheet, 
  TrendingUp, 
  PieChart, 
  ShieldCheck 
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { members, events, attendanceRecords, projects, certificates, settings, addToast } = useApp();

  const [reportType, setReportType] = useState<'OVERVIEW' | 'DEMOGRAPHICS' | 'ATTENDANCE'>('OVERVIEW');

  // Demographic Calculations
  const totalMembers = members.length;
  const maleCount = members.filter(m => m.gender === 'Male').length;
  const femaleCount = members.filter(m => m.gender === 'Female').length;
  const otherCount = totalMembers - maleCount - femaleCount;

  const age15_17 = members.filter(m => m.age >= 15 && m.age <= 17).length;
  const age18_21 = members.filter(m => m.age >= 18 && m.age <= 21).length;
  const age22_25 = members.filter(m => m.age >= 22 && m.age <= 25).length;
  const age26_30 = members.filter(m => m.age >= 26 && m.age <= 30).length;

  const collegeCount = members.filter(m => m.educationalStatus === 'College / University').length;
  const shsCount = members.filter(m => m.educationalStatus === 'Senior High').length;
  const osyCount = members.filter(m => m.educationalStatus === 'Out of School Youth').length;
  const employedCount = members.filter(m => m.educationalStatus === 'Employed Professional').length;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">
            Analytics & Executive Reports
          </h1>
          <p className="text-xs text-slate-500">
            Official municipal youth metrics, demographic breakdowns, and printable quarterly reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Wrapper */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        {/* Formal Header (Visible when printed) */}
        <div className="text-center space-y-1.5 border-b border-slate-200 pb-6">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
            Republic of the Philippines • Province of Nueva Ecija
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 uppercase">
            {settings.orgName} (PAGASA GUIMBA)
          </h2>
          <p className="text-xs text-slate-600 italic">
            Official Youth Management Information System — Executive Accomplishment & Demographic Report
          </p>
          <p className="text-[10px] text-slate-400 font-mono pt-1">
            Generated on: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • Municipal Ref: MIS-REP-2026-Q1
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Youth</span>
            <p className="text-2xl font-black text-slate-900 font-display">{totalMembers}</p>
            <p className="text-[11px] text-slate-500">Across 64 Barangays</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Total Check-in Logs</span>
            <p className="text-2xl font-black text-blue-600 font-display">{attendanceRecords.length}</p>
            <p className="text-[11px] text-slate-500">QR verified sessions</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Active Projects</span>
            <p className="text-2xl font-black text-emerald-600 font-display">{projects.length}</p>
            <p className="text-[11px] text-slate-500">Grassroots initiatives</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Certificates Issued</span>
            <p className="text-2xl font-black text-amber-600 font-display">{certificates.length}</p>
            <p className="text-[11px] text-slate-500">Digitally verified</p>
          </div>
        </div>

        {/* Demographic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Age Distribution Table */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-display flex items-center justify-between">
              <span>Age Sector Distribution</span>
              <span className="text-xs text-slate-400 font-normal">15-30 Youth Bracket</span>
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>15 – 17 years old (Junior Youth)</span>
                  <strong className="font-bold">{age15_17} ({totalMembers > 0 ? Math.round((age15_17 / totalMembers) * 100) : 0}%)</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(age15_17 / totalMembers) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>18 – 21 years old (Core Youth)</span>
                  <strong className="font-bold">{age18_21} ({totalMembers > 0 ? Math.round((age18_21 / totalMembers) * 100) : 0}%)</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(age18_21 / totalMembers) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>22 – 25 years old (Young Adults)</span>
                  <strong className="font-bold">{age22_25} ({totalMembers > 0 ? Math.round((age22_25 / totalMembers) * 100) : 0}%)</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(age22_25 / totalMembers) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>26 – 30 years old (Senior Youth)</span>
                  <strong className="font-bold">{age26_30} ({totalMembers > 0 ? Math.round((age26_30 / totalMembers) * 100) : 0}%)</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(age26_30 / totalMembers) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Gender & Sector Table */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Gender & Sectoral Classification
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Male Youth</span>
                <p className="text-xl font-bold text-slate-900">{maleCount}</p>
                <p className="text-[10px] text-slate-500">{totalMembers > 0 ? Math.round((maleCount / totalMembers) * 100) : 0}%</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Female Youth</span>
                <p className="text-xl font-bold text-slate-900">{femaleCount}</p>
                <p className="text-[10px] text-slate-500">{totalMembers > 0 ? Math.round((femaleCount / totalMembers) * 100) : 0}%</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>College / University Students:</span>
                <strong>{collegeCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Senior High School Students:</span>
                <strong>{shsCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Out of School Youth (OSY):</span>
                <strong>{osyCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Employed Professionals:</span>
                <strong>{employedCount}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Event Turnout Summary Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 font-display">
            Assembly & Program Turnout Matrix
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-[10px] uppercase text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Event Assembly</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Registered</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{e.title}</td>
                    <td className="py-2.5 px-3">{e.category}</td>
                    <td className="py-2.5 px-3 text-slate-500">{e.date}</td>
                    <td className="py-2.5 px-3 font-bold">{e.registeredCount} / {e.maxCapacity}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="pt-10 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center text-xs">
          <div className="space-y-6">
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Prepared By:</p>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
              HON. MARIA SANTOS
            </div>
            <p className="text-[10px] text-slate-500 -mt-4">Secretary General, PAGASA Guimba</p>
          </div>

          <div className="space-y-6">
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Verified & Audited:</p>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
              HON. CHRISTIAN FLORES
            </div>
            <p className="text-[10px] text-slate-500 -mt-4">Auditor & Records Officer</p>
          </div>

          <div className="space-y-6">
            <p className="text-slate-400 font-semibold text-[10px] uppercase">Approved By:</p>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900">
              HON. ALEXIS RAMOS
            </div>
            <p className="text-[10px] text-slate-500 -mt-4">President & Executive Head</p>
          </div>
        </div>

      </div>
    </div>
  );
};
