import React from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { Users, Clock, CheckCircle2, Ticket, ShieldCheck } from 'lucide-react';

export const TechnicianWorkloadPage = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await API.get('/reports/analytics');
      return res.data.data;
    },
  });

  if (isLoading || !analyticsData) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading technician workload data...</div>;
  }

  const { workload = [] } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Users className="w-6 h-6 text-brand" />
            <span>Technician Workload & Hours Distribution</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Monitor active assigned tickets, completed resolutions, and total work hours logged per technician.
          </p>
        </div>
      </div>

      {/* Workload Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4">Technician</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Active Queue</th>
              <th className="py-3 px-4">Resolved Count</th>
              <th className="py-3 px-4">Logged Work Hours</th>
              <th className="py-3 px-4 text-right">Workload Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {workload.map((tech) => (
              <tr key={tech._id} className="hover:bg-base/50 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded text-white flex items-center justify-center font-bold text-2xs font-sans"
                    style={{ backgroundColor: tech.avatarColor || '#B5502F' }}
                  >
                    {tech.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-text-main leading-none">{tech.name}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{tech.email}</p>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-base border border-border text-text-main font-mono">
                    <ShieldCheck className="w-3 h-3 text-brand" />
                    {tech.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-brand">{tech.assignedCount} tickets</td>
                <td className="py-3.5 px-4 font-mono font-semibold text-status-resolved">{tech.resolvedCount} closed</td>
                <td className="py-3.5 px-4 font-mono text-text-main">{tech.totalHoursLogged} hrs</td>
                <td className="py-3.5 px-4 text-right">
                  {tech.assignedCount > 3 ? (
                    <span className="px-2 py-0.5 rounded bg-status-inProgress/15 text-status-inProgress border border-status-inProgress/30 text-2xs font-semibold">
                      High Load
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-status-resolved/15 text-status-resolved border border-status-resolved/30 text-2xs font-semibold">
                      Optimal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
