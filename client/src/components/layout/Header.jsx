import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';
import { SearchCommandModal } from './SearchCommandModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Menu,
  ChevronRight,
  LogOut,
  HelpCircle,
  Command,
  Zap,
} from 'lucide-react';

const ROLE_CONFIG = {
  admin:         { label: 'System Admin',    color: 'bg-brand-light text-brand border-brand-border' },
  it_manager:    { label: 'IT Manager',      color: 'bg-amber-light text-amber border-amber-border' },
  technician:    { label: 'Technician',      color: 'bg-teal-light text-teal border-teal-border' },
  asset_manager: { label: 'Asset Manager',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  employee:      { label: 'Employee',        color: 'bg-surfaceSubtle text-text-muted border-border' },
};

export const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();

  const [isSearchOpen,      setIsSearchOpen]      = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled,          setScrolled]          = useState(false);

  // Track scroll for subtle shadow upgrade
  useEffect(() => {
    const el = document.querySelector('main');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Close profile menu on route change
  useEffect(() => { setIsProfileMenuOpen(false); }, [location.pathname]);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Dynamic breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs  = pathSegments.map((seg, i) => ({
    name: seg.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    url:  `/${pathSegments.slice(0, i + 1).join('/')}`,
  }));

  const roleConf = ROLE_CONFIG[user?.role] || ROLE_CONFIG.employee;

  return (
    <>
      <header
        className={`sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 border-b border-border transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-xs'
        }`}
      >
        {/* ── Left: Hamburger + Breadcrumbs ─────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-surfaceMid lg:hidden transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <Link to="/" className="hover:text-brand transition-colors font-semibold text-text-main">
              Workspace
            </Link>
            {breadcrumbs.length > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-light" />}
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-light" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-text-main">{crumb.name}</span>
                ) : (
                  <Link to={crumb.url} className="hover:text-brand transition-colors">{crumb.name}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* ── Center: Search Trigger ─────────────────────────────────── */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 px-3.5 py-2 bg-surfaceSubtle border border-border rounded-xl text-xs text-text-muted hover:border-brand/40 hover:bg-white hover:shadow-sm transition-all w-64 lg:w-80 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-text-light group-hover:text-brand transition-colors" />
            <span className="group-hover:text-text-main transition-colors">Search tickets, assets, articles…</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-border text-[10px] font-mono text-text-muted shadow-xs">
            <Command className="w-3 h-3" />K
          </div>
        </button>

        {/* ── Right: Actions + Profile ───────────────────────────────── */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-surfaceMid md:hidden transition-all"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Help */}
          <Link
            to="/kb"
            className="p-2 text-text-muted hover:text-teal rounded-xl hover:bg-teal-light hidden sm:flex transition-all"
            title="Help Center"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* Notifications */}
          <NotificationBell />

          <div className="h-5 w-px bg-border hidden sm:block mx-1" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen((v) => !v)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-surfaceMid transition-all focus:outline-none"
            >
              <div
                className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#C1455D'}, #D4863C)` }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-text-main leading-tight">{user?.name || 'User'}</div>
                <div className="text-[10px] text-text-muted capitalize leading-tight">{user?.role?.replace('_', ' ')}</div>
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-2xl shadow-xl p-2 z-50 space-y-0.5"
                >
                  {/* Header info */}
                  <div className="px-3 py-2.5 border-b border-border mb-1">
                    <p className="text-xs font-bold text-text-main">{user?.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${roleConf.color}`}>
                      {roleConf.label}
                    </span>
                  </div>

                  <button
                    onClick={() => { setIsProfileMenuOpen(false); navigate('/tickets'); }}
                    className="w-full text-left px-3 py-2 text-xs text-text-main hover:bg-surfaceSubtle rounded-xl transition-colors font-medium"
                  >
                    My Workspace Requests
                  </button>

                  <button
                    onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                    className="w-full text-left px-3 py-2 text-xs text-brand hover:bg-brand-light rounded-xl transition-colors font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <SearchCommandModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
