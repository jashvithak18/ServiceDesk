import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { SlaBadge } from '../../components/tickets/SlaBadge';
import { Ticket, Plus, Search, Filter, Clock, ChevronRight, Inbox, ShieldAlert } from 'lucide-react';

export const TicketsListPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const queueType = searchParams.get('queue') || 'all';

  const { data: ticketsResponse, isLoading } = useQuery({
    queryKey: ['tickets', queueType, statusFilter, priorityFilter, searchTerm],
    queryFn: async () => {
      const params = {};
      if (queueType === 'queue') params.queue = 'my_queue';
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await API.get('/tickets', { params });
      return res.data;
    },
  });

  const tickets = ticketsResponse?.data || [];

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'critical': return 'bg-status-breached/15 text-status-breached border-status-breached/30 font-semibold';
      case 'high': return 'bg-status-inProgress/15 text-status-inProgress border-status-inProgress/30 font-medium';
      case 'medium': return 'bg-status-open/15 text-status-open border-status-open/30';
      default: return 'bg-status-onHold/15 text-status-onHold border-status-onHold/30';
    }
  };

  const getStatusPillClass = (s) => {
    switch (s) {
      case 'new': return 'status-pill status-open';
      case 'assigned': return 'status-pill status-open';
      case 'in_progress': return 'status-pill status-in-progress';
      case 'on_hold': return 'status-pill status-on-hold';
      case 'resolved': return 'status-pill status-resolved';
      case 'closed': return 'status-pill status-resolved';
      default: return 'status-pill status-on-hold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text-main flex items-center gap-2">
            <Ticket className="w-6 h-6 text-brand" />
            <span>{queueType === 'queue' ? 'My Assigned Queue' : 'Service Queue Directory'}</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {queueType === 'queue'
              ? 'Tickets currently assigned to your workload queue.'
              : 'Real-time IT helpdesk tickets and service request tracking.'}
          </p>
        </div>
        <Link
          to="/tickets/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Queue View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-base p-1 border border-border rounded">
          <button
            onClick={() => setSearchParams({})}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              queueType !== 'queue' ? 'bg-surface text-text-main shadow-subtle font-semibold' : 'text-text-muted hover:text-text-main'
            }`}
          >
            All Tickets
          </button>
          {user?.role !== 'employee' && (
            <button
              onClick={() => setSearchParams({ queue: 'queue' })}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                queueType === 'queue' ? 'bg-surface text-brand shadow-subtle font-semibold' : 'text-text-muted hover:text-text-main'
              }`}
            >
              My Work Queue
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, description, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface border border-border rounded text-text-main focus:outline-none focus:border-brand"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Data Table */}
      <div className="bg-surface rounded border border-border overflow-hidden shadow-subtle">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-muted">Loading tickets dataset...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-base text-text-muted flex items-center justify-center mx-auto border border-border">
              <Inbox className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h3 className="text-base font-serif font-semibold text-text-main">No tickets logged in queue</h3>
              <p className="text-xs text-text-muted mt-1">
                {searchTerm || statusFilter || priorityFilter
                  ? 'No tickets match your active filter criteria.'
                  : 'Your request queue is clean. Create a new support ticket to begin.'}
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-base text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject & Description</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Countdown</th>
                <th className="py-3 px-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {tickets.map((t) => (
                <tr key={t._id} className="hover:bg-base/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand">{t.ticketNumber}</td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link to={`/tickets/${t._id}`} className="font-semibold text-text-main hover:text-brand transition-colors block truncate">
                      {t.title}
                    </Link>
                    <p className="text-2xs text-text-muted truncate mt-0.5">{t.description}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded text-white flex items-center justify-center font-bold text-[10px]"
                        style={{ backgroundColor: t.requester?.avatarColor || '#B5502F' }}
                      >
                        {t.requester?.name?.[0] || 'U'}
                      </div>
                      <span className="text-text-main font-medium">{t.requester?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs uppercase border ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={getStatusPillClass(t.status)}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <SlaBadge resolutionDeadline={t.resolutionDeadline} isBreached={t.isSlaBreached} status={t.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/tickets/${t._id}`}
                      className="inline-flex items-center text-text-muted hover:text-brand transition-colors p-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

