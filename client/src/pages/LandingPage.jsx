import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, ShieldCheck, HardDrive, Users, Sparkles, ArrowRight,
  CheckCircle2, Clock, Zap, BarChart3, BookOpen, ChevronRight,
  Play, Layers, Activity, FileText, Star, TrendingUp, Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Scroll-triggered animation wrapper ───────────────────────────────── */
const Reveal = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref  = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVis(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 28 : direction === 'down' ? -28 : 0,
      x: direction === 'left' ? 28 : direction === 'right' ? -28 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={vis ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Animated counter ─────────────────────────────────────────────────── */
const Counter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── Feature Card ─────────────────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, iconBg, iconColor, delay }) => (
  <Reveal delay={delay} className="h-full">
    <div className="group h-full bg-white border border-border rounded-2xl p-6 shadow-subtle hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-4 cursor-default relative overflow-hidden">
      {/* Hover gradient sheen */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-brand-light/60 via-transparent to-transparent rounded-2xl" />
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} ${iconColor} transition-all duration-300 group-hover:scale-110`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-base font-serif font-bold text-text-main relative">{title}</h3>
      <p className="text-xs text-text-muted leading-relaxed relative">{desc}</p>
    </div>
  </Reveal>
);

/* ── Lifecycle step data ──────────────────────────────────────────────── */
const LIFECYCLE = [
  {
    step: '01', badge: 'SUBMITTED', title: 'Employee Raises Request',
    desc: 'Employee submits an incident with category auto-detection, file attachments, and urgency tagging through a guided form.',
    icon: FileText, color: 'from-rose-500 to-orange-400',
  },
  {
    step: '02', badge: 'TRIAGED', title: 'Groq AI Classifies',
    desc: 'Groq LLM instantly predicts ticket category, suggested priority, and probable-cause summary — with a 10-second circuit-breaker fallback.',
    icon: Sparkles, color: 'from-violet-500 to-indigo-500',
  },
  {
    step: '03', badge: 'ASSIGNED', title: 'Technician Picked & SLA Starts',
    desc: 'Admin assigns the lowest-queue technician. The operating SLA clock begins, business-hours-aware (Mon–Fri 09:00–18:00 UTC).',
    icon: Users, color: 'from-amber-500 to-yellow-400',
  },
  {
    step: '04', badge: 'RESOLVING', title: 'Work Logged & Updated',
    desc: 'Technician adds internal notes, public replies, and time-tracked work logs. Employee notified at each state transition.',
    icon: Activity, color: 'from-teal-500 to-emerald-400',
  },
  {
    step: '05', badge: 'CLOSED', title: 'Resolved & Reported',
    desc: 'Ticket resolved and closed. Audit trail captured, SLA compliance recorded, and analytics pipelines updated in real-time.',
    icon: CheckCircle2, color: 'from-emerald-500 to-teal-400',
  },
];

/* ── Stats data ──────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Tickets Processed',  value: 2400, suffix: '+',  icon: Ticket },
  { label: 'SLA Compliance',     value: 96,   suffix: '%',  icon: ShieldCheck },
  { label: 'Avg Resolution',     value: 4,    suffix: 'h',  icon: Clock },
  { label: 'Assets Tracked',     value: 1200, suffix: '+',  icon: HardDrive },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen gradient-canvas font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white font-serif font-black text-lg shadow-glow-brand">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-[17px] text-text-main tracking-tight block leading-none">
                ServiceDesk <span className="font-sans font-black text-[10px] text-brand tracking-widest">PRO</span>
              </span>
              <span className="text-[10px] text-text-muted font-medium">Enterprise Operations Platform</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-muted">
            <a href="#features"  className="hover:text-brand transition-colors">Features</a>
            <a href="#lifecycle" className="hover:text-brand transition-colors">Ticket Lifecycle</a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-2 px-4 py-2 gradient-brand text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow-brand"
              >
                Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-xs font-semibold text-text-main hover:text-brand transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 gradient-brand text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow-brand"
                >
                  Explore Demo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* ── Animated Orb Field ──────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, #1A1814 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Large background halo — brand */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.18, 0.26, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-20 w-[640px] h-[640px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(193,69,93,0.22) 0%, transparent 70%)' }}
          />
          {/* Mid orb — teal */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.14, 0.22, 0.14], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-[30%] right-[-80px] w-[480px] h-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(30,107,94,0.18) 0%, transparent 70%)' }}
          />
          {/* Small orb — amber accent */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12], y: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-10 left-[35%] w-[280px] h-[280px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,134,60,0.20) 0%, transparent 70%)' }}
          />
          {/* Floating sparkle dots */}
          {[
            { x: '15%',  y: '20%', size: 6,  delay: 0,   dur: 6,  color: '#C1455D', opacity: 0.5 },
            { x: '80%',  y: '15%', size: 4,  delay: 1.5, dur: 8,  color: '#1E6B5E', opacity: 0.4 },
            { x: '90%',  y: '60%', size: 5,  delay: 3,   dur: 7,  color: '#D4863C', opacity: 0.45 },
            { x: '25%',  y: '75%', size: 3,  delay: 0.8, dur: 9,  color: '#C1455D', opacity: 0.35 },
            { x: '60%',  y: '85%', size: 4,  delay: 2,   dur: 6,  color: '#1E6B5E', opacity: 0.4 },
            { x: '50%',  y: '10%', size: 5,  delay: 4,   dur: 10, color: '#D4863C', opacity: 0.3 },
            { x: '70%',  y: '40%', size: 3,  delay: 1,   dur: 7,  color: '#C1455D', opacity: 0.25 },
            { x: '8%',   y: '55%', size: 4,  delay: 5,   dur: 8,  color: '#1E6B5E', opacity: 0.3 },
          ].map(({ x, y, size, delay, dur, color, opacity }, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -14, 0], opacity: [opacity, opacity * 1.6, opacity] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
              className="absolute rounded-full"
              style={{ left: x, top: y, width: size, height: size, background: color }}
            />
          ))}
          {/* Thin horizontal accent line */}
          <motion.div
            animate={{ scaleX: [0.4, 1, 0.4], opacity: [0, 0.12, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[38%] left-0 right-0 h-px origin-left"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(193,69,93,0.3), transparent)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* ── Copy ─────────────────────────────────────────────── */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-border shadow-subtle text-xs font-semibold text-brand"
              >
                <Zap className="w-3.5 h-3.5" />
                Next-Gen Enterprise IT Service Management
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-main tracking-tight leading-[1.08]"
              >
                IT support,{' '}
                <br className="hidden sm:inline" />
                <span className="text-brand">without the chaos.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                ServiceDesk Pro unifies tickets, hardware assets, technician workloads,
                live SLA timers, and AI knowledge into one intelligent workspace.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 gradient-brand text-white font-semibold text-sm rounded-xl hover:opacity-90 shadow-glow-brand transition-all hover:-translate-y-0.5"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-text-main border border-border font-semibold text-sm rounded-xl hover:border-brand/40 hover:shadow-md transition-all"
                >
                  <Play className="w-4 h-4 fill-text-muted text-text-muted" />
                  Try Interactive Demo
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.45 }}
                className="pt-5 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-text-muted"
              >
                {[
                  { icon: CheckCircle2, text: 'No credit card required', c: 'text-teal' },
                  { icon: ShieldCheck,  text: 'RBAC Access Control',     c: 'text-brand' },
                  { icon: Zap,          text: 'Groq AI Triage',          c: 'text-amber' },
                ].map(({ icon: Icon, text, c }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${c}`} /> {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Dashboard Preview Card ───────────────────────────── */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/95 border border-border rounded-2xl p-6 shadow-xl space-y-5 overflow-hidden"
              >
                {/* Top bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-teal" />
                    <span className="text-xs font-semibold text-text-muted ml-2">ServiceDesk Operations Console</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full border border-teal-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    Live MongoDB
                  </div>
                </div>

                {/* Metric row */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Active Workload', val: '18 Tickets',  badge: '+12%',   badgeCls: 'text-teal bg-teal-light' },
                    { label: 'SLA Compliance',  val: '96.8%',       badge: 'Target',  badgeCls: 'text-brand bg-brand-light' },
                  ].map(({ label, val, badge, badgeCls }) => (
                    <div key={label} className="bg-surfaceSubtle p-3.5 rounded-xl border border-border space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-serif font-bold text-text-main">{val}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badgeCls}`}>{badge}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ticket card */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-light text-brand text-xs font-bold rounded-lg">#INC-1042</span>
                      <span className="text-xs font-bold text-text-main">VPN Access &amp; Handshake Timeout</span>
                    </div>
                    <span className="px-2 py-0.5 bg-brand-light text-brand border border-brand-border text-[10px] font-bold rounded-full">HIGH</span>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-1">
                    Unable to connect to staging cluster WireGuard VPN — TLS handshake timeout.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                    <div className="flex items-center gap-2 text-text-muted">
                      <div className="w-5 h-5 rounded-lg gradient-brand text-white text-[10px] font-bold flex items-center justify-center">AM</div>
                      <span className="font-medium text-text-main text-[11px]">Arjun Mehta</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber text-[11px] font-semibold bg-amber-light px-2 py-0.5 rounded border border-amber-border">
                      <Clock className="w-3 h-3" /> SLA → 42 min
                    </div>
                  </div>
                </motion.div>

                {/* Floating cards */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-3.5 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-sky-400" /> AST-4001</span>
                      <span className="text-[10px] font-bold text-teal">Assigned</span>
                    </div>
                    <p className="text-xs font-semibold">MacBook Pro 16″ M3 Max</p>
                    <p className="text-[10px] text-stone-400">Sarah Jenkins · Engineering</p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                    className="bg-gradient-to-br from-brand-light to-amber-light border border-brand-border p-3.5 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-text-main">
                        <Sparkles className="w-3.5 h-3.5 text-brand" /> Groq AI
                      </span>
                      <span className="text-[10px] font-black text-brand bg-white px-1.5 py-0.5 rounded shadow-sm">98%</span>
                    </div>
                    <p className="text-[11px] text-text-muted font-medium">
                      Category: <span className="font-bold text-brand">IAM Access</span>
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Decorative halo */}
              <div className="absolute -inset-4 gradient-brand opacity-5 rounded-3xl blur-2xl -z-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ─────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ label, value, suffix, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <div className="text-center space-y-1">
                  <div className="text-3xl font-serif font-bold text-brand">
                    <Counter target={value} suffix={suffix} />
                  </div>
                  <div className="text-xs text-text-muted font-medium">{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLLYTELLING LIFECYCLE ────────────────────────────────────── */}
      <section id="lifecycle" className="py-24 relative overflow-hidden">
        {/* Background tone shift */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-light/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-widest text-brand bg-brand-light px-3 py-1 rounded-full border border-brand-border">
                End-to-End Resolution Workflow
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main tracking-tight mt-3">
                From request to resolved.<br />
                <span className="text-brand">Every step, visible.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm text-text-muted leading-relaxed">
                Follow a single ticket through its entire lifecycle — AI classification,
                SLA tracking, technician work logs, and executive reporting.
              </p>
            </Reveal>
          </div>

          {/* Step selector */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {LIFECYCLE.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={idx} delay={idx * 0.07}>
                  <button
                    onClick={() => setActiveTab(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all duration-300 space-y-2 group ${
                      activeTab === idx
                        ? 'border-brand/40 bg-white shadow-lg shadow-brand/10 scale-[1.02]'
                        : 'bg-white/60 border-border hover:border-brand/30 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{s.badge}</span>
                    <p className="text-xs font-bold text-text-main leading-snug line-clamp-2">{s.title}</p>
                    <div className={`h-0.5 rounded-full bg-gradient-to-r ${s.color} transition-all duration-300 ${activeTab === idx ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Active step display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-gradient-to-br ${LIFECYCLE[activeTab].color} rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%221.0%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22 opacity%3D%220.06%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />

              <div className="lg:col-span-7 space-y-5 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                  Phase {LIFECYCLE[activeTab].step} of 05
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {LIFECYCLE[activeTab].title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-lg">
                  {LIFECYCLE[activeTab].desc}
                </p>
                <button
                  onClick={() => setActiveTab((p) => (p + 1) % LIFECYCLE.length)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all backdrop-blur-sm border border-white/20"
                >
                  Next Phase <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-5 bg-white/15 border border-white/20 backdrop-blur-md rounded-2xl p-6 space-y-4 relative">
                <div className="flex items-center justify-between text-xs text-white/60 pb-3 border-b border-white/20">
                  <span className="font-mono uppercase tracking-widest text-[10px]">Ticket Status Engine</span>
                  <span className="text-white font-bold text-[11px]">● Active</span>
                </div>
                {[
                  { label: 'Ticket Ref',   val: 'INC-1002', cls: 'text-white font-mono font-bold' },
                  { label: 'Phase',        val: LIFECYCLE[activeTab].badge, cls: 'text-white font-bold' },
                  { label: 'Audit Status', val: 'Validated', cls: 'text-white/80' },
                  { label: 'SLA Status',   val: activeTab < 4 ? 'Within Target' : 'Resolved', cls: 'text-white/80' },
                ].map(({ label, val, cls }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{label}</span>
                    <span className={cls}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── FEATURES GRID ──────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-widest text-teal bg-teal-light px-3 py-1 rounded-full border border-teal-border">
                Enterprise Feature Suite
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main tracking-tight mt-3">
                Built for modern IT operations
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm text-text-muted">
                All 8 critical operational modules needed for seamless IT service delivery — tightly integrated.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Ticket,      title: 'Intelligent Ticket Management', desc: 'Auto-increment IDs, public threads, technician-only notes, and billable hour work logging.', iconBg: 'bg-brand-light', iconColor: 'text-brand', delay: 0 },
              { icon: Clock,       title: 'Operating SLA Engine',          desc: 'Business hours aware (Mon–Fri 09:00–18:00 UTC) with weekend rollover and cron breach alerts.', iconBg: 'bg-amber-light', iconColor: 'text-amber', delay: 0.06 },
              { icon: HardDrive,   title: 'Hardware Asset & Vendor',       desc: 'State machine validation (In Stock → Assigned → In Repair → Retired), 30-day warranty alerts.', iconBg: 'bg-teal-light', iconColor: 'text-teal', delay: 0.12 },
              { icon: Sparkles,    title: 'Groq LLM AI Triage',            desc: 'Instant category prediction, priority classification, and probable-cause with 10s circuit breaker.', iconBg: 'bg-violet-50', iconColor: 'text-violet-600', delay: 0.18 },
              { icon: Users,       title: 'Technician Capacity Balancing', desc: 'Monitor active queue counts, SLA risk exposure, and workload distribution to prevent burnout.', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', delay: 0.24 },
              { icon: BarChart3,   title: 'Live Analytics & Exports',      desc: 'MongoDB aggregation pipelines, Recharts visualizations, streaming CSV exports, and PDF reports.', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', delay: 0.30 },
            ].map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE SHOWCASE SCROLLYTELLING ───────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-light/20 to-amber-light/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-widest text-amber bg-amber-light px-3 py-1 rounded-full border border-amber-border">
                Role-Tailored Workspaces
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main tracking-tight mt-3">
                Every person sees{' '}
                <span className="text-teal">exactly what they need.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { role: 'System Admin',    icon: ShieldCheck, color: 'from-brand to-brand-end', desc: 'Full system health, SLA compliance, audit logs, user management, and all tickets.', tag: 'ADMIN' },
              { role: 'IT Manager',      icon: BarChart3,   color: 'from-indigo-500 to-violet-500', desc: 'Team workload balancing, SLA analytics, technician performance reports.', tag: 'IT_MANAGER' },
              { role: 'Technician',      icon: Activity,    color: 'from-teal to-emerald-400', desc: 'Personal active queue, SLA countdown, internal notes, and work time logging.', tag: 'TECHNICIAN' },
              { role: 'Asset Manager',   icon: HardDrive,   color: 'from-amber to-yellow-400', desc: 'Hardware inventory, vendor directory, warranty tracker, lifecycle state machine.', tag: 'ASSET_MGR' },
              { role: 'Employee',        icon: Ticket,      color: 'from-sky-500 to-blue-500', desc: 'Submit requests, track ticket status, browse self-service knowledge base.', tag: 'EMPLOYEE' },
              { role: 'AI Triage',       icon: Sparkles,    color: 'from-violet-500 to-purple-600', desc: 'Groq-powered instant classification, priority scoring, and category routing.', tag: 'AI ENGINE' },
            ].map(({ role, icon: Icon, color, desc, tag }, i) => (
              <Reveal key={role} delay={i * 0.07}>
                <div className="group h-full bg-white border border-border rounded-2xl p-6 shadow-subtle hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 space-y-4 cursor-default overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${color} blur-2xl`} />
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{tag}</span>
                    <h3 className="text-sm font-serif font-bold text-text-main mt-0.5">{role}</h3>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
                  <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-95" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%23ffffff%22 fill-opacity%3D%220.4%22%3E%3Cpath d%3D%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-xs font-semibold text-white backdrop-blur-sm">
              <Star className="w-3.5 h-3.5" /> 5 Role Personas. 1 Click Login.
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Ready to bring clarity to your IT operations?
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
              Test ServiceDesk Pro now with 1-click pre-seeded demo accounts for System Admin,
              IT Manager, Technician, Asset Manager, and Employee.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-7 py-3.5 bg-white text-brand font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Launch Demo Persona Switcher
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 bg-white/15 text-white border border-white/30 font-semibold text-sm rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm"
              >
                Sign In to Account
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-stone-950 text-stone-500 py-8 border-t border-stone-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg gradient-brand text-white font-serif font-black text-xs flex items-center justify-center">S</div>
            <span className="font-serif font-bold text-stone-300">ServiceDesk Pro</span>
            <span>© 2026 Enterprise Operations. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />MongoDB Atlas</span>
            <span>Groq LLM</span>
            <span>REST API v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
