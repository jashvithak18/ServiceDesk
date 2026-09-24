import React from 'react';
import { Search, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';

export const Header = () => {
  const { user, logout } = useAuth();

  const roleNameMap = {
    admin: 'System Admin',
    it_manager: 'IT Manager',
    technician: 'Technician',
    employee: 'Employee',
    asset_manager: 'Asset Manager',
  };

  const currentRole = roleNameMap[user?.role] || user?.role || 'Guest';
  const userName = user?.name || 'User';

  return (
    <header className="h-14 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10 shadow-subtle">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search tickets, assets, articles (Ctrl+K)..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-base border border-border rounded focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main placeholder:text-text-muted transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-light border border-brand-border text-brand text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{currentRole}</span>
        </div>

        {/* Notifications & User Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <NotificationBell />

          <div className="h-4 w-[1px] bg-border" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div 
            className="w-7 h-7 rounded text-white flex items-center justify-center font-medium text-xs shadow-sm font-sans"
            style={{ backgroundColor: user?.avatarColor || '#B5502F' }}
          >
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text-main leading-none">{userName}</p>
            <p className="text-[11px] text-text-muted leading-tight mt-0.5">{user?.email || 'Authenticated'}</p>
          </div>
          
          <button
            onClick={logout}
            className="p-1.5 text-text-muted hover:text-status-breached hover:bg-status-breached/10 rounded transition-colors ml-1"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

