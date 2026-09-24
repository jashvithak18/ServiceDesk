import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LifeBuoy, 
  Ticket, 
  PlusCircle, 
  HardDrive, 
  BookOpen, 
  Clock, 
  Users, 
  Building2, 
  Tag,
  FileText, 
  SlidersHorizontal,
  LayoutDashboard,
  Activity,
  History,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { role: userRole } = useAuth();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      ]
    },
    {
      title: 'TICKETING ENGINE',
      items: [
        { label: 'My Queue', path: '/tickets/queue', icon: Ticket },
        { label: 'All Tickets', path: '/tickets', icon: LifeBuoy },
        { label: 'New Ticket', path: '/tickets/new', icon: PlusCircle },
      ]
    },
    {
      title: 'ASSETS & VENDORS',
      items: [
        { label: 'Asset Inventory', path: '/assets', icon: HardDrive },
        { label: 'Knowledge Base', path: '/kb', icon: BookOpen },
      ]
    },
    {
      title: 'Admin Governance',
      roles: ['admin', 'it_manager'],
      items: [
        { label: 'SLA Analytics', path: '/admin/sla', icon: Activity },
        { label: 'Technician Workload', path: '/admin/workload', icon: Users },
        { label: 'System Audit Logs', path: '/admin/audit-logs', icon: History },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Ticket Categories', path: '/admin/categories', icon: Tag },
        { label: 'SLA Policies', path: '/admin/sla-policies', icon: Clock },
        { label: 'User Directory', path: '/admin/users', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 border-b border-border px-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 className="font-serif font-bold text-text-main text-base leading-none">ServiceDesk<span className="text-brand font-sans font-medium text-xs ml-1">PRO</span></h1>
            <p className="text-[11px] text-text-muted mt-0.5 font-sans">IT Operations Console</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-7rem)]">
          {navSections.map((section, idx) => {
            if (section.roles && !section.roles.includes(userRole)) return null;

            return (
              <div key={idx} className="space-y-1">
                <h3 className="px-3 text-[10px] font-semibold text-text-light uppercase tracking-wider">
                  {section.title}
                </h3>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-light text-brand font-semibold border-l-2 border-brand'
                            : 'text-text-muted hover:text-text-main hover:bg-base'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-border bg-base text-2xs text-text-muted flex justify-between items-center">
        <span>ServiceDesk v1.0</span>
        <span className="w-2 h-2 rounded-full bg-status-resolved" title="System Operational"></span>
      </div>
    </aside>
  );
};
