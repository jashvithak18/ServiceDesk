import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket,
  ShieldCheck,
  HardDrive,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  BookOpen,
  ChevronRight,
  Play,
  Lock,
  Layers,
  Activity,
  Cpu,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const heroFloatingCards = [
    {
      type: 'ticket',
      id: 'INC-1042',
      title: 'VPN TLS Handshake Timeout',
      assignee: 'Arjun Mehta',
      priority: 'high',
      sla: '42m remaining',
      status: 'in_progress',
    },
    {
      type: 'asset',
      tag: 'AST-4001',
      name: 'MacBook Pro 16" M3 Max',
      assignedTo: 'Sarah Jenkins (DevOps)',
      status: 'assigned',
    },
    {
      type: 'sla',
      rate: '96.8%',
      breached: 1,
      target: '95% SLA Target',
    },
  ];

  const scrollLifecycleSteps = [
    {
      step: '01',
      title: 'Employee Raises Request',
      desc: 'Employee submits incident via standard portal with automatic attachments and category selection.',
      badge: 'Request Submitted',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'AI Triage & Root Cause Analysis',
      desc: 'Groq LLM engine predicts ticket category, severity level, and suggests probable root cause instantly.',
      badge: 'AI Classified 98%',
      color: 'from-violet-500 to-purple-600',
    },
    {
      step: '03',
      title: 'Smart Technician Assignment',
      desc: 'Automated routing assigns ticket to available technician based on workload capacity.',
      badge: 'Assigned to Tech',
      color: 'from-amber-500 to-orange-600',
    },
    {
      step: '04',
      title: 'Business-Hours SLA Countdown',
      desc: 'SLA engine tracks operating hours, excluding weeknights and weekends, triggering warnings before breach.',
      badge: 'SLA Tracking Live',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '05',
      title: 'Resolution & Audit Logged',
      desc: 'Technician resolves ticket, logs billable work hours, and system creates an immutable audit trail entry.',
      badge: 'Resolved & Audited',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-base font-sans text-text-main selection:bg-brand-light selection:text-brand overflow-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-white font-serif font-bold text-xl shadow-glow">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-text-main tracking-tight block leading-none">
                ServiceDesk <span className="font-sans font-extrabold text-xs text-brand tracking-wide">PRO</span>
              </span>
              <span className="text-[10px] text-text-muted font-medium">Enterprise Operations Platform</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-muted">
            <a href="#features" className="hover:text-brand transition-colors">Features</a>
            <a href="#lifecycle" className="hover:text-brand transition-colors">Ticket Lifecycle</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-hover transition-colors shadow-sm"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-text-main hover:text-brand transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-hover transition-colors shadow-sm"
                >
                  <span>Explore Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Soft Background Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-brand-light via-indigo-100/50 to-sky-100/40 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-gradient-to-br from-violet-100 to-rose-100 rounded-full blur-2xl -z-10 opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand/20 shadow-subtle text-xs font-medium text-brand"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>Next-Gen Enterprise IT Service Management</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-main tracking-tight leading-[1.1]"
              >
                IT support, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  without the chaos.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
              >
                ServiceDesk Pro brings tickets, hardware assets, technician workloads, operating SLA timers, and AI knowledge into one intelligent, unified workspace.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-brand text-white font-semibold text-sm rounded-xl hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-text-main border border-border font-semibold text-sm rounded-xl hover:bg-surfaceSubtle transition-all shadow-subtle"
                >
                  <Play className="w-4 h-4 fill-text-main text-text-main" />
                  <span>Try Interactive Demo</span>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6 border-t border-border/80 flex items-center justify-center lg:justify-start gap-6 text-xs text-text-muted"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span>RBAC Access Control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Groq AI Triage</span>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Dashboard Canvas Representation */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative bg-white/90 backdrop-blur-xl border border-border/90 rounded-2xl p-6 shadow-2xl space-y-5 overflow-hidden"
              >
                {/* Simulated Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-border/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-text-muted ml-2">ServiceDesk Operations Console</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live MongoDB Engine</span>
                  </div>
                </div>

                {/* Floating Metric Cards Container */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surfaceSubtle p-3.5 rounded-xl border border-border/70 space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Active Workload</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-serif font-bold text-text-main">18 Tickets</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.5 rounded">+12% vs last week</span>
                    </div>
                  </div>
                  <div className="bg-surfaceSubtle p-3.5 rounded-xl border border-border/70 space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">SLA Compliance Rate</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-serif font-bold text-brand">96.8%</span>
                      <span className="text-[10px] text-brand font-medium">Business Hours</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Main Ticket Queue Card */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white p-4 rounded-xl border border-border shadow-md space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-light text-brand text-xs font-bold rounded">#INC-1042</span>
                      <span className="text-xs font-bold text-text-main">VPN Access & Handshake Timeout</span>
                    </div>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full">HIGH</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-1">
                    Unable to connect to staging cluster WireGuard VPN receiving TLS handshake timeout.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-2 text-text-muted">
                      <div className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">AM</div>
                      <span className="font-medium text-text-main text-[11px]">Assigned → Arjun Mehta</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span>SLA → 42 min left</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Micro Cards Around Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Floating Asset Card */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3.5 rounded-xl shadow-lg space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                        Asset AST-4001
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">Assigned</span>
                    </div>
                    <p className="text-xs font-semibold">MacBook Pro 16" M3 Max</p>
                    <p className="text-[10px] text-slate-400">Sarah Jenkins • Engineering Dept</p>
                  </motion.div>

                  {/* Floating AI Insight Card */}
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                    className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200/80 p-3.5 rounded-xl space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        Groq AI Diagnostic
                      </span>
                      <span className="text-[10px] font-extrabold text-brand bg-white px-1.5 py-0.5 rounded shadow-2xs">98% Match</span>
                    </div>
                    <p className="text-[11px] text-indigo-950 font-medium line-clamp-2">
                      Suggested Category: <span className="font-bold text-brand">Identity & Access (IAM)</span>
                    </p>
                  </motion.div>
                </div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Scroll Storytelling Lifecycle Section */}
      <section id="lifecycle" className="py-20 bg-white border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand bg-brand-light px-3 py-1 rounded-full border border-brand/20">
              End-to-End Resolution Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main tracking-tight">
              Everything your IT team needs. In one workspace.
            </h2>
            <p className="text-sm text-text-muted">
              Follow a single ticket through its entire lifecycle from employee submission to AI classification, technician SLA resolution, and executive reporting.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
            {scrollLifecycleSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeTab === idx
                    ? 'bg-gradient-to-br from-brand/5 to-indigo-50/50 border-brand shadow-md scale-[1.02]'
                    : 'bg-surface border-border hover:border-brand/40 hover:bg-surfaceSubtle'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold font-serif text-brand">{s.step}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === idx ? 'bg-brand text-white' : 'bg-slate-100 text-text-muted'}`}>
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-text-main line-clamp-1">{s.title}</h3>
              </button>
            ))}
          </div>

          {/* Active Lifecycle Display Card */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-sky-300 backdrop-blur-sm">
                <span>Phase {scrollLifecycleSteps[activeTab].step} of 05</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                {scrollLifecycleSteps[activeTab].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {scrollLifecycleSteps[activeTab].desc}
              </p>
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab((prev) => (prev + 1) % scrollLifecycleSteps.length)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
                >
                  <span>Next Phase</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-700">
                <span className="font-mono">TICKET STATUS DEMO</span>
                <span className="text-emerald-400 font-bold">Active Engine</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Ticket Ref</span>
                  <span className="font-mono text-sky-400 font-bold">INC-1002</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Current Phase</span>
                  <span className="text-amber-400 font-bold">{scrollLifecycleSteps[activeTab].badge}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Audit Status</span>
                  <span className="text-emerald-400">Validated</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Enterprise Feature Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main tracking-tight">
            Built for modern IT operations teams
          </h2>
          <p className="text-sm text-text-muted">
            ServiceDesk Pro brings together all 8 critical operational modules needed for seamless IT service delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Intelligent Ticket Management</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Autoincrement ticket IDs, public response threads, technician-only internal notes, and billable hour work logging.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Operating SLA Engine</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Business hours engine (Mon-Fri 09:00-18:00 UTC) with automatic weekend minute rollover and cron breach alerts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Hardware Asset & Vendor Directory</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              State machine validation (In Stock → Assigned → In Repair → Retired), 30-day warranty warning pills, and vendor management.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Groq LLM AI Triage</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Instant AI category prediction, priority classification, and probable cause diagnostic summary with 10s fallback circuit breaker.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Technician Capacity Balancing</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Monitor technician active queue counts, SLA risk exposure, and workload distribution to prevent staff burnout.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle hover:border-brand/40 transition-all hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-text-main">Live Analytics & Exports</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Dynamic MongoDB pipelines, Recharts visualizations, streaming server-side CSV exports, and executive PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Ready to bring clarity to your IT operations?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Test ServiceDesk Pro now with 1-click pre-seeded demo accounts for System Admin, IT Manager, Technician, Asset Manager, and Employee personas.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3.5 bg-brand text-white font-semibold text-sm rounded-xl hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
            >
              Launch Demo Persona Switcher
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-slate-800 text-white border border-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-700 transition-colors"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-8 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand text-white font-serif font-bold text-xs flex items-center justify-center">S</div>
            <span className="font-serif font-bold text-slate-300">ServiceDesk Pro</span>
            <span>© 2026 Enterprise Operations. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>MongoDB Atlas Connected</span>
            <span>Groq LLM Powered</span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
