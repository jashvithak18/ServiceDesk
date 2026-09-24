import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { SearchCommandModal } from './SearchCommandModal';
import {
  Search,
  Menu,
  ChevronRight,
  User,
  LogOut,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Command,
} from 'lucide-react';

export const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Generate dynamic breadcrumb items
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return { name: formatted, url };
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'it_manager':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'technician':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'asset_manager':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between shadow-subtle font-sans">
        
        {/* Left Side: Mobile Menu Button & Dynamic Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-text-muted hover:text-text-main rounded-lg hover:bg-slate-100 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb Navigation */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <Link to="/" className="hover:text-brand transition-colors">
              Workspace
            </Link>
            {breadcrumbs.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-light" />}
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-light" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-text-main">{crumb.name}</span>
                ) : (
                  <Link to={crumb.url} className="hover:text-brand transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar Trigger (Ctrl + K) */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-1.5 bg-surfaceSubtle border border-border rounded-xl text-xs text-text-muted hover:border-brand/40 hover:bg-white transition-all shadow-subtle w-64 lg:w-80 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-brand transition-colors" />
            <span>Search tickets, assets, articles...</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-border text-[10px] font-mono text-text-muted">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        {/* Right Side: Action Icons & Profile Drawer */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-text-muted hover:text-text-main rounded-lg hover:bg-slate-100 md:hidden transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Help Center Link */}
          <Link
            to="/kb"
            className="p-2 text-text-muted hover:text-brand rounded-lg hover:bg-slate-100 transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            title="Help Center"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* Notification Center Bell */}
          <NotificationBell />

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div
                className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-sm"
                style={{ backgroundColor: user?.avatarColor || '#4F46E5' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-text-main line-clamp-1 leading-tight">
                  {user?.name || 'User Profile'}
                </div>
                <div className="text-[10px] text-text-muted capitalize">
                  {user?.role?.replace('_', ' ') || 'employee'}
                </div>
              </div>
            </button>

            {/* Profile Dropdown Drawer */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-2xl shadow-xl p-2 z-50 space-y-1 font-sans">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-bold text-text-main">{user?.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/tickets');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-text-main hover:bg-slate-50 rounded-xl transition-colors font-medium flex items-center justify-between"
                >
                  <span>My Workspace Requests</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Global Command Palette Search Modal */}
      <SearchCommandModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
