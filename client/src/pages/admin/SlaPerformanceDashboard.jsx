import React from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Clock, ShieldAlert, CheckCircle2, Download, FileText, Activity, AlertTriangle } from 'lucide-react';

export const SlaPerformanceDashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await API.get('/reports/analytics');
      return res.data.data;
    },
  });

  if (isLoading || !analyticsData) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading live SLA performance analytics...</div>;
  }

  const { summary, byPriority = [], byCategory = [] } = analyticsData;

  // Colors per priority using Section 3 muted palette
  const priorityColors = {
    critical: '#9C3B2E', // Breached brick red
    high: '#B5822F',     // Muted amber
    medium: '#3E5C76',   // Muted slate blue
    low: '#3D6B4F',      // Muted green
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await API.get('/reports/tickets/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'servicedesk_tickets.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('CSV Export Error:', err);
    }
  };

  const handleDownloadAssetsCSV = async () => {
    try {
      const res = await API.get('/reports/assets/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'servicedesk_assets.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Assets CSV Export Error:', err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await API.get('/reports/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'servicedesk_sla_report.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand" />
            <span>SLA Performance Analytics</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time operating SLA compliance, breach metrics, and priority distribution derived from MongoDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-text-main text-xs font-semibold rounded hover:bg-base transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand" />
            <span>Export Tickets CSV</span>
          </button>
          <button
            onClick={handleDownloadAssetsCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-text-main text-xs font-semibold rounded hover:bg-base transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand" />
            <span>Export Assets CSV</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Report PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">SLA Compliance Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-text-main">{summary.slaComplianceRate}%</span>
            <span className="text-2xs font-semibold text-status-resolved">Target &ge; 95%</span>
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">Calculated against operating SLA deadlines</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Total Volume Logged</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-text-main">{summary.totalTickets}</span>
            <span className="text-2xs font-medium text-brand">Real MongoDB Count</span>
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">{summary.resolvedTickets} tickets resolved</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">In-Progress Workload</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-status-inProgress">{summary.inProgressTickets}</span>
            <span className="text-2xs font-medium text-text-muted">{summary.newTickets} new</span>
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">Active technician queue</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">SLA Breached Tickets</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-status-breached">{summary.breachedTickets}</span>
            <AlertTriangle className="w-4 h-4 text-status-breached" />
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">Auto-escalated to IT Lead</p>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-surface rounded border border-border p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-serif font-bold text-text-main border-b border-border pb-2">
            Ticket Volume Distribution by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B6559' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#6B6559' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5DE', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#B5502F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Chart */}
        <div className="bg-surface rounded border border-border p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-serif font-bold text-text-main border-b border-border pb-2">
            Ticket Distribution by Priority Level
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPriority}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ priority, count }) => `${priority.toUpperCase()}: ${count}`}
                >
                  {byPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={priorityColors[entry.priority] || '#3E5C76'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5DE', borderRadius: '6px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
