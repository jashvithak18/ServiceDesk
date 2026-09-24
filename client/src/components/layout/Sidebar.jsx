import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  FileText,
  X,
  Sparkles,
  ChevronRight,
  LogOut,
  Clock,
  Briefcase,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  // Role helper shortcuts
  const isAdmin = role === 'admin';
  const isManager = role === 'it_manager';
  const isTech = role === 'technician';
  const isAssetMgr = role === 'asset_manager';
  const isEmployee = role === 'employee';

  const canAdmin = isAdmin || isManager;
  const canTech = isAdmin || isManager || isTech;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between border-r border-slate-800 shadow-2xl font-sans`}
    >
      {/* Top Brand & Header */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center text-white font-serif font-bold text-base shadow-lg">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white tracking-tight leading-none block">
                ServiceDesk <span className="font-sans text-[10px] font-extrabold text-brand-border">PRO</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Enterprise Operations</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Link Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* OVERVIEW GROUP */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Overview
            </div>
            <NavLink
              to="/app"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </NavLink>
          </div>

          {/* TICKETING GROUP */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Ticketing
            </div>

            {canTech && (
              <NavLink
                to="/tickets/queue"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>My Active Queue</span>
              </NavLink>
            )}

            <NavLink
              to="/tickets"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive && location.pathname === '/tickets'
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Ticket className="w-4 h-4" />
              <span>All Tickets</span>
            </NavLink>

            <NavLink
              to="/tickets/new"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>New Support Ticket</span>
            </NavLink>

            {canAdmin && (
              <NavLink
                to="/admin/categories"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <FolderTree className="w-4 h-4" />
                <span>Ticket Categories</span>
              </NavLink>
            )}
          </div>

          {/* ASSETS & VENDORS GROUP */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Assets & Vendors
            </div>
            <NavLink
              to="/assets"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive && location.pathname.includes('/assets')
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Asset Inventory</span>
            </NavLink>

            {(canAdmin || isAssetMgr) && (
              <NavLink
                to="/inventory/vendors"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Building2 className="w-4 h-4" />
                <span>Hardware Vendors</span>
              </NavLink>
            )}
          </div>

          {/* KNOWLEDGE BASE GROUP */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Knowledge
            </div>
            <NavLink
              to="/kb"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>Knowledge Base</span>
            </NavLink>
          </div>

          {/* ADMINISTRATION GROUP (Only Admin & IT Manager) */}
          {canAdmin && (
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                Administration
              </div>

              <NavLink
                to="/admin/workload"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Technician Workload</span>
              </NavLink>

              <NavLink
                to="/admin/sla"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>SLA Analytics</span>
              </NavLink>

              <NavLink
                to="/admin/sla-policies"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SLA Operating Rules</span>
              </NavLink>

              <NavLink
                to="/admin/departments"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Building2 className="w-4 h-4" />
                <span>Departments</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>User Directory</span>
              </NavLink>

              <NavLink
                to="/admin/audit-logs"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`
                }
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>System Audit Logs</span>
              </NavLink>
            </div>
          )}

        </div>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-sm"
              style={{ backgroundColor: user?.avatarColor || '#4F46E5' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
