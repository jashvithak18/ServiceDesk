import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Bell, MessageSquare, ShieldAlert, UserCheck, RefreshCw, CheckCheck, Clock } from 'lucide-react';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Poll notifications every 10 seconds for real-time responsiveness
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await API.get('/notifications');
      return res.data;
    },
    refetchInterval: 10000,
  });

  const notifications = data?.data || [];
  const unreadCount = data?.unreadCount || 0;

  // Mark read mutation
  const markReadMutation = useMutation({
    mutationFn: async (payload) => {
      return API.put('/notifications/read', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markReadMutation.mutate({ notificationId: n._id });
    }
    setIsOpen(false);
    if (n.ticket?._id || n.ticket) {
      const ticketId = n.ticket._id || n.ticket;
      navigate(`/tickets/${ticketId}`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'comment_added':
        return <MessageSquare className="w-3.5 h-3.5 text-brand" />;
      case 'sla_breached':
        return <ShieldAlert className="w-3.5 h-3.5 text-status-breached" />;
      case 'ticket_assigned':
        return <UserCheck className="w-3.5 h-3.5 text-status-inProgress" />;
      default:
        return <RefreshCw className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-main rounded hover:bg-base transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-surface rounded border border-border shadow-md z-50 overflow-hidden font-sans space-y-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-base">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xs text-text-main">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-brand text-white text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markReadMutation.mutate({ markAll: true })}
                className="text-2xs font-semibold text-brand hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border text-xs">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-text-muted italic text-xs">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 space-y-1 cursor-pointer transition-colors ${
                    n.isRead ? 'bg-surface hover:bg-base/60' : 'bg-brand-light/20 hover:bg-brand-light/40 font-medium'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getIcon(n.type)}
                      <span className="font-semibold text-text-main text-xs">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-2xs text-text-muted leading-relaxed pl-5">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
