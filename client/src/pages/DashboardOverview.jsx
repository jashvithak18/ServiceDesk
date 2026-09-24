import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Ticket, Plus, ShieldAlert, CheckCircle2, ArrowUpRight, Clock, Users, HardDrive } from 'lucide-react';

export const DashboardOverview = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await API.get('/reports/analytics');
      return res.data.data;
    },
  });

  const summary = analyticsData?.summary || {
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    breachedTickets: 0,
    slaComplianceRate: 100,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main">Service Operations Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time queue monitoring, SLA tracking, and infrastructure health metrics derived live from MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </Link>
        </div>
      </div>

      {/* Live KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Total Ticket Volume</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-text-main">{summary.totalTickets}</span>
            <Ticket className="w-4 h-4 text-brand" />
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">{summary.newTickets} new requests</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Active Workload</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-status-inProgress">{summary.inProgressTickets}</span>
            <Clock className="w-4 h-4 text-status-inProgress" />
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">Assigned to technicians</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Resolved & Closed</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-status-resolved">{summary.resolvedTickets}</span>
            <CheckCircle2 className="w-4 h-4 text-status-resolved" />
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">Successfully completed</p>
        </div>

        <div className="bg-surface rounded border border-border p-5 space-y-2 shadow-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">SLA Compliance Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-brand">{summary.slaComplianceRate}%</span>
            <ShieldAlert className="w-4 h-4 text-brand" />
          </div>
          <p className="text-[11px] text-text-muted pt-1 border-t border-border">{summary.breachedTickets} breached deadline</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <Link
          to="/tickets"
          className="bg-surface border border-border rounded p-5 space-y-2 hover:border-brand/40 transition-colors shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-text-main text-base group-hover:text-brand transition-colors">Ticket Queue Directory</h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors" />
          </div>
          <p className="text-xs text-text-muted">Browse full helpdesk incident and service request list.</p>
        </Link>

        <Link
          to="/assets"
          className="bg-surface border border-border rounded p-5 space-y-2 hover:border-brand/40 transition-colors shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-text-main text-base group-hover:text-brand transition-colors">Hardware Inventory</h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors" />
          </div>
          <p className="text-xs text-text-muted">Track hardware lifecycle transitions, user assignments, and warranty status.</p>
        </Link>

        <Link
          to="/admin/sla"
          className="bg-surface border border-border rounded p-5 space-y-2 hover:border-brand/40 transition-colors shadow-subtle group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-text-main text-base group-hover:text-brand transition-colors">SLA & Recharts Analytics</h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors" />
          </div>
          <p className="text-xs text-text-muted">Executive analytics, category volume distribution, and CSV/PDF report downloads.</p>
        </Link>
      </div>
    </div>
  );
};
