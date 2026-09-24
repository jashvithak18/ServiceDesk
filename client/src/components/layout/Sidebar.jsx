import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  FolderTree,
  HardDrive,
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  Activity,
  History,
  X,
  LogOut,
  Clock,
  Briefcase,
  Zap,
} from 'lucide-react';

/* ── Link item with animated active indicator ───────────────────────── */
const NavItem = ({ to, icon: Icon, label, end = false, iconColor, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-brand/90 to-brand-end/80 text-white shadow-md shadow-brand/25'
          : 'text-stone-400 hover:text-stone-100 hover:bg-white/6'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-xl gradient-brand opacity-90"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className={`relative z-10 transition-colors ${isActive ? 'text-white' : iconColor || 'text-stone-400 group-hover:text-stone-200'}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="relative z-10">{label}</span>
      </>
    )}
  </NavLink>
);

/* ── Section label ──────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <div className="px-3 text-[9px] font-black uppercase tracking-[0.18em] text-stone-600 mb-1.5 mt-1">
    {children}
  </div>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const isAdmin    = role === 'admin';
  const isManager  = role === 'it_manager';
  const isTech     = role === 'technician';
  const isAssetMgr = role === 'asset_manager';

  const canAdmin = isAdmin || isManager;
  const canTech  = isAdmin || isManager || isTech;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 gradient-dark-sidebar text-stone-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col border-r border-stone-800/60 shadow-2xl font-sans`}
    >
      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-stone-800/60 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-white font-serif font-black text-sm shadow-lg shadow-brand/30 group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <span className="font-serif font-bold text-[15px] text-white tracking-tight leading-none block">
              ServiceDesk
              <span className="font-sans text-[9px] font-black text-brand-muted/80 ml-1 tracking-wide">PRO</span>
            </span>
            <span className="text-[9px] text-stone-500 font-medium">Enterprise Operations</span>
          </div>
        </Link>

        <button
          onClick={onClose}
          className="p-1.5 text-stone-500 hover:text-stone-200 rounded-lg hover:bg-stone-800/60 lg:hidden transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">

        {/* OVERVIEW */}
        <div className="space-y-0.5">
          <SectionLabel>Overview</SectionLabel>
          <NavItem to="/app" end icon={LayoutDashboard} label="Dashboard Overview" onClick={onClose} />
        </div>

        {/* TICKETING */}
        <div className="space-y-0.5">
          <SectionLabel>Ticketing</SectionLabel>
          {canTech && (
            <NavItem to="/tickets/queue" icon={Clock} label="My Active Queue" iconColor="text-amber-400" onClick={onClose} />
          )}
          <NavItem to="/tickets" icon={Ticket} label="All Tickets" onClick={onClose} />
          <NavItem to="/tickets/new" icon={PlusCircle} label="New Support Ticket" iconColor="text-teal" onClick={onClose} />
          {canAdmin && (
            <NavItem to="/admin/categories" icon={FolderTree} label="Ticket Categories" onClick={onClose} />
          )}
        </div>

        {/* ASSETS & VENDORS */}
        <div className="space-y-0.5">
          <SectionLabel>Assets &amp; Vendors</SectionLabel>
          <NavItem to="/assets" icon={HardDrive} label="Asset Inventory" iconColor="text-sky-400" onClick={onClose} />
          {(canAdmin || isAssetMgr) && (
            <NavItem to="/inventory/vendors" icon={Building2} label="Hardware Vendors" onClick={onClose} />
          )}
        </div>

        {/* KNOWLEDGE BASE */}
        <div className="space-y-0.5">
          <SectionLabel>Knowledge</SectionLabel>
          <NavItem to="/kb" icon={BookOpen} label="Knowledge Base" iconColor="text-violet-400" onClick={onClose} />
        </div>

        {/* ADMINISTRATION */}
        {canAdmin && (
          <div className="space-y-0.5">
            <SectionLabel>Administration</SectionLabel>
            <NavItem to="/admin/workload" icon={Briefcase} label="Technician Workload" iconColor="text-indigo-400" onClick={onClose} />
            <NavItem to="/admin/sla" icon={Activity} label="SLA Analytics" iconColor="text-teal" onClick={onClose} />
            <NavItem to="/admin/sla-policies" icon={ShieldCheck} label="SLA Operating Rules" onClick={onClose} />
            <NavItem to="/admin/departments" icon={Building2} label="Departments" onClick={onClose} />
            <NavItem to="/admin/users" icon={Users} label="User Directory" onClick={onClose} />
            <NavItem to="/admin/audit-logs" icon={History} label="System Audit Logs" iconColor="text-amber-400" onClick={onClose} />
          </div>
        )}
      </div>

      {/* ── Live Status Pill ──────────────────────────────────────────── */}
      <div className="px-4 py-2 border-t border-stone-800/40">
        <div className="flex items-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-[10px] font-semibold text-teal/80">MongoDB Atlas · Live</span>
        </div>
      </div>

      {/* ── User Footer ───────────────────────────────────────────────── */}
      <div className="px-4 py-3.5 border-t border-stone-800/60 bg-stone-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-sm"
              style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#C1455D'}, ${user?.avatarColor ? user.avatarColor + 'AA' : '#D4863C'})` }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-stone-100 truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-stone-500 capitalize leading-tight">{role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-stone-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
