import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { History, ShieldCheck, Ticket, HardDrive, Search, Filter } from 'lucide-react';

export const AuditLogPage = () => {
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await API.get('/admin/audit-logs');
      return res.data.data;
    },
  });

  const filteredLogs = logs.filter((log) => {
    const matchesType = !filterType || log.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      log.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <History className="w-6 h-6 text-brand" />
            <span>System Audit Log History</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Immutable audit trail recording ticket status transitions, SLA escalations, and hardware lifecycle updates.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, title, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">All Event Types</option>
            <option value="Ticket">Ticket Status Transitions</option>
            <option value="Asset">Asset Lifecycle Transitions</option>
          </select>
        </div>

        <span className="text-xs text-text-muted">
          Showing <span className="font-semibold text-text-main">{filteredLogs.length}</span> audit log entries
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading system audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">No audit logs matching filters.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Event Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Transition Action</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-2xs text-text-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold font-mono ${
                        log.type.includes('Ticket')
                          ? 'bg-[#F0F4F8] text-[#3E5C76] border border-[#D0DDE8]'
                          : 'bg-[#F1F7F3] text-[#3D6B4F] border border-[#C8E0D2]'
                      }`}
                    >
                      {log.type.includes('Ticket') ? <Ticket className="w-3 h-3" /> : <HardDrive className="w-3 h-3" />}
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-brand">{log.reference}</td>
                  <td className="py-3.5 px-4 font-semibold text-text-main">{log.action}</td>
                  <td className="py-3.5 px-4 font-medium text-text-main">{log.performedBy}</td>
                  <td className="py-3.5 px-4 text-text-muted max-w-xs truncate">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
