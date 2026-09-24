import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Plus,
  ShieldAlert,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Users,
  HardDrive,
  Sparkles,
  AlertTriangle,
  Activity,
  Briefcase,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  Layers,
  Building2,
} from 'lucide-react';

/* ====================================================================
   1. SYSTEM ADMIN DASHBOARD WORKSPACE
   ==================================================================== */
const AdminDashboard = ({ analyticsData, user }) => {
  const summary = analyticsData?.summary || {
    totalTickets: 0,
    newTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    breachedTickets: 0,
    slaComplianceRate: 100,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Greeting */}
      <div className="gradient-brand text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-brand/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width%3D%2230%22 height%3D%2230%22 viewBox%3D%220 0 30 30%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle cx%3D%221%22 cy%3D%221%22 r%3D%221%22 fill%3D%22%23fff%22 fill-opacity%3D%220.4%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white/90 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
            <span>System Administrator Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Good morning, {user?.name || 'Admin'}.
          </h1>
          <p className="text-xs sm:text-sm text-white/75 max-w-xl">
            Here's what's happening across your service operations, hardware assets, and SLA compliance.
          </p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-brand font-bold text-xs rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </Link>
        </div>
      </div>


      {/* Top Rich Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Total Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-text-main">{summary.totalTickets}</div>
          <div className="text-xs text-text-muted pt-2 border-t border-border/60 flex items-center justify-between">
            <span>New: {summary.newTickets}</span>
            <span className="text-emerald-600 font-bold">+12% this week</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Active Workload</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-600">{summary.inProgressTickets}</div>
          <div className="text-xs text-text-muted pt-2 border-t border-border/60">
            Assigned to active technicians
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">SLA Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-600">{summary.slaComplianceRate}%</div>
          <div className="text-xs text-text-muted pt-2 border-t border-border/60 flex items-center justify-between">
            <span>Breached: {summary.breachedTickets}</span>
            <span className="text-emerald-600 font-bold">Target: 95%</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Resolved & Closed</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-indigo-600">{summary.resolvedTickets}</div>
          <div className="text-xs text-text-muted pt-2 border-t border-border/60">
            Completed support requests
          </div>
        </motion.div>
      </div>

      {/* Service Operations Visual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket Distribution Card */}
        <div className="lg:col-span-8 bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-serif font-bold text-lg text-text-main">Service Operations Breakdown</h3>
              <p className="text-xs text-text-muted">Live ticket status distribution across the organization</p>
            </div>
            <Link to="/tickets" className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-center space-y-1">
              <span className="text-[11px] font-bold text-blue-700">NEW</span>
              <div className="text-2xl font-serif font-bold text-blue-900">{summary.newTickets}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-center space-y-1">
              <span className="text-[11px] font-bold text-amber-700">IN PROGRESS</span>
              <div className="text-2xl font-serif font-bold text-amber-900">{summary.inProgressTickets}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-700">RESOLVED</span>
              <div className="text-2xl font-serif font-bold text-emerald-900">{summary.resolvedTickets}</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 text-center space-y-1">
              <span className="text-[11px] font-bold text-rose-700">BREACHED</span>
              <div className="text-2xl font-serif font-bold text-rose-900">{summary.breachedTickets}</div>
            </div>
          </div>
        </div>

        {/* SLA Radial / Health Breakdown Card */}
        <div className="lg:col-span-4 bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-4">
          <div className="pb-3 border-b border-border">
            <h3 className="font-serif font-bold text-lg text-text-main">SLA Health Score</h3>
            <p className="text-xs text-text-muted">Business hours deadline compliance</p>
          </div>
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand"
                  strokeDasharray={`${summary.slaComplianceRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xl font-serif font-bold text-text-main">{summary.slaComplianceRate}%</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Operating Hours SLA Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====================================================================
   2. IT MANAGER DASHBOARD WORKSPACE
   ==================================================================== */
const ItManagerDashboard = ({ analyticsData }) => {
  const summary = analyticsData?.summary || { totalTickets: 0, inProgressTickets: 0, breachedTickets: 0, newTickets: 0 };
  
  return (
    <div className="space-y-8 font-sans">
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-amber/30 to-transparent pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber/90">
          <Briefcase className="w-3.5 h-3.5 text-amber" />
          <span>IT Manager Service Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Your team's service pulse.</h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
          Monitor technician workload capacity, unassigned ticket bottlenecks, and SLA deadline risks.
        </p>
      </div>

      {/* Manager KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Open Tickets</span>
          <div className="text-2xl font-serif font-bold text-text-main">{summary.totalTickets}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Unassigned Queue</span>
          <div className="text-2xl font-serif font-bold text-amber-600">{summary.newTickets}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">SLA At Risk</span>
          <div className="text-2xl font-serif font-bold text-rose-600">{summary.breachedTickets}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">In Progress</span>
          <div className="text-2xl font-serif font-bold text-emerald-600">{summary.inProgressTickets}</div>
        </div>
      </div>

      {/* Quick Action Link Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/workload" className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all flex items-center justify-between group">
          <div>
            <h3 className="font-serif font-bold text-base text-text-main group-hover:text-brand">Technician Capacity & Workload</h3>
            <p className="text-xs text-text-muted">Balance open ticket distribution across IT technicians.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-brand transition-colors" />
        </Link>
        <Link to="/admin/sla" className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all flex items-center justify-between group">
          <div>
            <h3 className="font-serif font-bold text-base text-text-main group-hover:text-brand">SLA Compliance Analytics</h3>
            <p className="text-xs text-text-muted">Review resolution deadline performance reports.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-brand transition-colors" />
        </Link>
      </div>
    </div>
  );
};

/* ====================================================================
   3. TECHNICIAN DASHBOARD WORKSPACE
   ==================================================================== */
const TechnicianDashboard = ({ user }) => {
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['myQueueTickets'],
    queryFn: async () => {
      const res = await API.get('/tickets');
      return res.data.data;
    },
  });

  const tickets = ticketsData || [];

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Technician Personal Work Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Good morning, {user?.name || 'Technician'}.
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Here are the tickets requiring your attention today. Track SLA timers and log billable work hours.
          </p>
        </div>
        <Link
          to="/tickets/queue"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-amber font-bold text-xs rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <span>View My Active Queue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Ticket Queue Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-text-main">Assigned Incidents ({tickets.length})</h3>
          <Link to="/tickets" className="text-xs font-bold text-brand hover:underline">View All Tickets →</Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading assigned tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="bg-surface p-8 rounded-2xl border border-border text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-serif font-bold text-text-main">No pending tickets in your queue!</p>
            <p className="text-xs text-text-muted">You have resolved all assigned requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.slice(0, 4).map((ticket) => (
              <motion.div
                key={ticket._id}
                whileHover={{ y: -2 }}
                className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3 hover:border-brand/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-brand-light text-brand text-xs font-extrabold rounded">
                    {ticket.ticketNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    ticket.priority === 'critical' || ticket.priority === 'high'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-text-main text-sm line-clamp-1">{ticket.title}</h4>
                <p className="text-xs text-text-muted line-clamp-2">{ticket.description}</p>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-text-muted text-[11px]">Requester: {ticket.requester?.name || 'Employee'}</span>
                  <Link
                    to={`/tickets/${ticket._id}`}
                    className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
                  >
                    <span>Open Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ====================================================================
   4. EMPLOYEE HELP PORTAL WORKSPACE
   ==================================================================== */
const EmployeeDashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Friendly Customer Support Hero Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-teal/80 to-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-teal-light to-transparent pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-xs font-bold text-white/90">
          <Sparkles className="w-4 h-4 text-amber" />
          <span>Self-Service Support Portal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
          How can we help you today, {user?.name?.split(' ')[0] || 'there'}?
        </h1>

        {/* Customer Search Box */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            onFocus={() => navigate('/kb')}
            placeholder="Describe your issue or search help articles (e.g., VPN, Password reset, HDMI)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white text-text-main placeholder:text-stone-400 text-xs sm:text-sm rounded-2xl border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/tickets/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 gradient-brand text-white font-bold text-xs rounded-xl hover:opacity-90 shadow-glow-brand transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Support Request</span>
          </Link>
          <Link
            to="/kb"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold text-xs rounded-xl hover:bg-white/25 transition-colors border border-white/20 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Knowledge Base</span>
          </Link>
        </div>
      </div>

      {/* Visual Lifecycle Progress Tracker Section */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-4">
        <h3 className="font-serif font-bold text-base text-text-main">Support Ticket Journey</h3>
        <p className="text-xs text-text-muted">How ServiceDesk Pro processes your request from submission to resolution:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
            <span className="text-[10px] font-extrabold text-blue-700 uppercase">Step 1</span>
            <p className="text-xs font-bold text-blue-950">Submitted</p>
            <p className="text-[11px] text-blue-700">Ticket created in portal</p>
          </div>
          <div className="p-3.5 rounded-xl bg-brand-light border border-brand-border space-y-1">
            <span className="text-[10px] font-extrabold text-brand uppercase">Step 2</span>
            <p className="text-xs font-bold text-text-main">Assigned</p>
            <p className="text-[11px] text-brand/70">Matched with technician</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-light border border-amber-border space-y-1">
            <span className="text-[10px] font-extrabold text-amber uppercase">Step 3</span>
            <p className="text-xs font-bold text-text-main">In Progress</p>
            <p className="text-[11px] text-amber/70">Technician working on fix</p>
          </div>
          <div className="p-3.5 rounded-xl bg-teal-light border border-teal-border space-y-1">
            <span className="text-[10px] font-extrabold text-teal uppercase">Step 4</span>
            <p className="text-xs font-bold text-text-main">Resolved</p>
            <p className="text-[11px] text-teal/70">Issue verified &amp; complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ====================================================================
   5. ASSET MANAGER DASHBOARD WORKSPACE
   ==================================================================== */
const AssetManagerDashboard = () => {
  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['assetsDashboard'],
    queryFn: async () => {
      const res = await API.get('/inventory/assets');
      return res.data.data;
    },
  });

  const assets = assetsData || [];
  const assignedCount = assets.filter((a) => a.status === 'assigned').length;
  const inStockCount = assets.filter((a) => a.status === 'in_stock').length;
  const inRepairCount = assets.filter((a) => a.status === 'in_repair').length;

  return (
    <div className="space-y-8 font-sans">
      <div className="gradient-teal text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white/90">
            <HardDrive className="w-3.5 h-3.5 text-white/80" />
            <span>Hardware Asset &amp; Infrastructure Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Keep your assets under control.</h1>
          <p className="text-xs sm:text-sm text-white/75 max-w-xl">
            Track hardware lifecycle states, vendor warranties, and employee device assignments.
          </p>
        </div>
        <Link to="/assets" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal font-bold text-xs rounded-xl hover:shadow-lg transition-all z-10">
          <span>Manage Asset Inventory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Asset Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Total Assets</span>
          <div className="text-2xl font-serif font-bold text-text-main">{assets.length}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Assigned</span>
          <div className="text-2xl font-serif font-bold text-blue-600">{assignedCount}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Available In Stock</span>
          <div className="text-2xl font-serif font-bold text-emerald-600">{inStockCount}</div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-muted">Under Repair</span>
          <div className="text-2xl font-serif font-bold text-amber-600">{inRepairCount}</div>
        </div>
      </div>
    </div>
  );
};

/* ====================================================================
   MAIN DISPATCHER COMPONENT
   ==================================================================== */
export const DashboardOverview = () => {
  const { user, role } = useAuth();

  const { data: analyticsData } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      const res = await API.get('/reports/analytics');
      return res.data.data;
    },
  });

  // Render Role-Tailored Workspace
  switch (role) {
    case 'admin':
      return <AdminDashboard analyticsData={analyticsData} user={user} />;
    case 'it_manager':
      return <ItManagerDashboard analyticsData={analyticsData} user={user} />;
    case 'technician':
      return <TechnicianDashboard user={user} />;
    case 'asset_manager':
      return <AssetManagerDashboard user={user} />;
    case 'employee':
      return <EmployeeDashboard user={user} />;
    default:
      return <AdminDashboard analyticsData={analyticsData} user={user} />;
  }
};
