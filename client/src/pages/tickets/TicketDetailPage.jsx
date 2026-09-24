import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { SlaBadge } from '../../components/tickets/SlaBadge';
import { AiKbSuggestionsPanel } from '../../components/ai/AiKbSuggestionsPanel';
import { 
  ArrowLeft, 
  Clock, 
  UserCheck, 
  MessageSquare, 
  Lock, 
  Send, 
  Plus, 
  RotateCcw, 
  ShieldAlert,
  History,
  CheckCircle2
} from 'lucide-react';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
  const [workDesc, setWorkDesc] = useState('');
  const [workMins, setWorkMins] = useState(30);

  // Fetch Ticket details
  const { data: ticketData, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await API.get(`/tickets/${id}`);
      return res.data.data;
    },
  });

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: async (newStatus) => {
      return API.put(`/tickets/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  // Self-assign mutation
  const assignMutation = useMutation({
    mutationFn: async () => {
      return API.put(`/tickets/${id}/assign`, { assigneeId: user._id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  // Reopen mutation
  const reopenMutation = useMutation({
    mutationFn: async () => {
      return API.post(`/tickets/${id}/reopen`, { reason: 'Requester requested reopen' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  // Add Comment mutation
  const commentMutation = useMutation({
    mutationFn: async () => {
      return API.post(`/tickets/${id}/comments`, {
        body: commentText,
        isInternalNote,
      });
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  // Worklog mutation
  const worklogMutation = useMutation({
    mutationFn: async () => {
      return API.post(`/tickets/${id}/worklogs`, {
        description: workDesc,
        timeSpentMinutes: Number(workMins),
      });
    },
    onSuccess: () => {
      setIsWorkLogModalOpen(false);
      setWorkDesc('');
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  if (isLoading || !ticketData) {
    return <div className="p-8 text-center text-xs text-text-muted">Loading ticket details...</div>;
  }

  const { ticket, comments = [], workLogs = [] } = ticketData;
  const isTechOrAdmin = ['admin', 'it_manager', 'technician'].includes(user?.role);

  const getPriorityPill = (p) => {
    switch (p) {
      case 'critical': return 'bg-status-breached/15 text-status-breached border-status-breached/30 font-semibold';
      case 'high': return 'bg-status-inProgress/15 text-status-inProgress border-status-inProgress/30 font-medium';
      case 'medium': return 'bg-status-open/15 text-status-open border-status-open/30';
      default: return 'bg-status-onHold/15 text-status-onHold border-status-onHold/30';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="p-1.5 rounded text-text-muted hover:text-text-main hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand text-sm">{ticket.ticketNumber}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs uppercase border ${getPriorityPill(ticket.priority)}`}>
                {ticket.priority} priority
              </span>
              <span className="status-pill status-in-progress uppercase">
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-text-main mt-1">{ticket.title}</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {['resolved', 'closed'].includes(ticket.status) && (
            <button
              onClick={() => reopenMutation.mutate()}
              disabled={reopenMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-status-inProgress text-white text-xs font-semibold rounded hover:opacity-90 transition-opacity"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Ticket ({ticket.reopenCount})</span>
            </button>
          )}

          {isTechOrAdmin && !ticket.assignee && (
            <button
              onClick={() => assignMutation.mutate()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign To Me</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: Details, Comments, Work Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description Box */}
          <div className="bg-surface rounded border border-border p-6 shadow-subtle space-y-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Issue Description
            </h3>
            <div className="text-xs text-text-main leading-relaxed whitespace-pre-line border-t border-border pt-3">
              {ticket.description}
            </div>
          </div>

          {/* Comment Thread */}
          <div className="bg-surface rounded border border-border p-6 shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-serif font-bold text-text-main flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand" />
                <span>Discussion & Communication Thread</span>
              </h3>
              <span className="text-2xs text-text-muted">{comments.length} comments</span>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-xs text-text-muted italic text-center py-4">No comments logged yet.</p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className={`p-4 rounded border text-xs space-y-2 ${
                      c.isInternalNote
                        ? 'bg-status-inProgress/10 border-status-inProgress/30'
                        : 'bg-base border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded text-white flex items-center justify-center font-bold text-[10px]"
                          style={{ backgroundColor: c.author?.avatarColor || '#B5502F' }}
                        >
                          {c.author?.name?.[0] || 'U'}
                        </div>
                        <span className="font-semibold text-text-main">{c.author?.name}</span>
                        <span className="text-2xs text-text-muted font-mono">({c.author?.role})</span>
                      </div>

                      <div className="flex items-center gap-2 text-2xs text-text-muted">
                        {c.isInternalNote && (
                          <span className="inline-flex items-center gap-1 font-semibold text-status-inProgress">
                            <Lock className="w-3 h-3" />
                            Internal Note
                          </span>
                        )}
                        <span>{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-text-main whitespace-pre-line pl-7">{c.body}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commentMutation.mutate();
              }}
              className="space-y-3 pt-4 border-t border-border"
            >
              <textarea
                required
                rows="3"
                placeholder="Type your response or update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
              ></textarea>

              <div className="flex items-center justify-between">
                {isTechOrAdmin ? (
                  <label className="flex items-center gap-1.5 text-xs text-text-muted font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="w-3.5 h-3.5 text-brand rounded border-border focus:ring-brand"
                    />
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-status-inProgress" />
                      Post as Technician Internal Note (Hidden from Requester)
                    </span>
                  </label>
                ) : (
                  <div></div>
                )}

                <button
                  type="submit"
                  disabled={commentMutation.isPending || !commentText.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1-Column: Metadata, Status Control, Work Logs */}
        <div className="space-y-6">
          {/* Status Control Card */}
          {isTechOrAdmin && (
            <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-3">
              <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider border-b border-border pb-2">
                Update Ticket Status
              </h3>
              <select
                value={ticket.status}
                onChange={(e) => statusMutation.mutate(e.target.value)}
                disabled={statusMutation.isPending}
                className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main font-semibold focus:outline-none focus:border-brand"
              >
                <option value="new">Status: New</option>
                <option value="assigned">Status: Assigned</option>
                <option value="in_progress">Status: In Progress</option>
                <option value="on_hold">Status: On Hold</option>
                <option value="resolved">Status: Resolved</option>
                <option value="closed">Status: Closed</option>
              </select>
            </div>
          )}

          {/* Ticket Metadata Card */}
          <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-4 text-xs">
            <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider border-b border-border pb-2">
              Ticket Details & SLA
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Requester:</span>
                <span className="font-semibold text-text-main">{ticket.requester?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Assigned Tech:</span>
                <span className="font-semibold text-text-main">
                  {ticket.assignee?.name || <span className="text-text-muted italic">Unassigned</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Category:</span>
                <span className="font-medium text-text-main">{ticket.category?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Department:</span>
                <span className="font-mono text-text-main">{ticket.department?.name || 'Global'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-text-muted">SLA Target:</span>
                <SlaBadge resolutionDeadline={ticket.resolutionDeadline} isBreached={ticket.isSlaBreached} status={ticket.status} />
              </div>
              <div className="flex justify-between items-center text-2xs text-text-muted">
                <span>Deadline Date:</span>
                <span className="font-mono">
                  {ticket.resolutionDeadline ? new Date(ticket.resolutionDeadline).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* AI KB Suggestions Panel */}
          <AiKbSuggestionsPanel categoryName={ticket.category?.name} ticketTitle={ticket.title} />

          {/* Work Log Summary (Technician Time Tracking) */}
          {isTechOrAdmin && (
            <div className="bg-surface rounded border border-border p-5 shadow-subtle space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-xs font-serif font-bold text-text-main uppercase tracking-wider">
                  Work Time Logged
                </h3>
                <button
                  onClick={() => setIsWorkLogModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-base border border-border text-brand text-2xs font-semibold rounded hover:bg-brand-light transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log Time</span>
                </button>
              </div>

              <div className="space-y-2">
                {workLogs.length === 0 ? (
                  <p className="text-2xs text-text-muted italic">No work hours logged yet.</p>
                ) : (
                  workLogs.map((wl) => (
                    <div key={wl._id} className="p-2 rounded bg-base border border-border text-2xs space-y-1">
                      <div className="flex justify-between font-semibold text-text-main">
                        <span>{wl.technician?.name}</span>
                        <span className="font-mono text-brand">{wl.timeSpentMinutes} mins</span>
                      </div>
                      <p className="text-text-muted">{wl.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Log Modal */}
      {isWorkLogModalOpen && (
        <div className="fixed inset-0 bg-text-main/30 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded border border-border w-full max-w-md p-6 shadow-md space-y-4">
            <h2 className="text-lg font-serif font-bold text-text-main border-b border-border pb-2">
              Log Technician Work Time
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                worklogMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Time Spent (Minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={workMins}
                  onChange={(e) => setWorkMins(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-main mb-1">Work Summary</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Summary of diagnostics, testing, or code fixes performed..."
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-base border border-border rounded text-text-main focus:outline-none focus:border-brand"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsWorkLogModalOpen(false)}
                  className="px-3.5 py-1.5 border border-border text-text-muted text-xs font-medium rounded hover:bg-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={worklogMutation.isPending}
                  className="px-3.5 py-1.5 bg-brand text-white text-xs font-semibold rounded hover:bg-brand-hover disabled:opacity-50"
                >
                  {worklogMutation.isPending ? 'Logging...' : 'Save Work Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
