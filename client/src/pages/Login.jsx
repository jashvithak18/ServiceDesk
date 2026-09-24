import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  HardDrive,
  Users,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activePersona, setActivePersona] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app';

  const demoPersonas = [
    {
      role: 'admin',
      title: 'System Admin',
      email: 'admin@servicedesk.com',
      pass: 'Admin123!',
      color: 'from-blue-600 to-indigo-700',
      icon: ShieldCheck,
      desc: 'Full organization governance & audit visibility',
    },
    {
      role: 'it_manager',
      title: 'IT Manager',
      email: 'manager@servicedesk.com',
      pass: 'Manager123!',
      color: 'from-indigo-600 to-violet-700',
      icon: Users,
      desc: 'Team SLA pulse & technician workload management',
    },
    {
      role: 'technician',
      title: 'Technician',
      email: 'tech@servicedesk.com',
      pass: 'Tech123!',
      color: 'from-amber-500 to-orange-600',
      icon: Clock,
      desc: 'Personal work queue & SLA timer tracking',
    },
    {
      role: 'asset_manager',
      title: 'Asset Manager',
      email: 'asset@servicedesk.com',
      pass: 'Asset123!',
      color: 'from-emerald-600 to-teal-700',
      icon: HardDrive,
      desc: 'Hardware inventory & warranty alerts',
    },
    {
      role: 'employee',
      title: 'Employee',
      email: 'employee@servicedesk.com',
      pass: 'Employee123!',
      color: 'from-slate-600 to-slate-800',
      icon: UserCheck,
      desc: 'Self-service helpdesk portal & request tracker',
    },
  ];

  const fillDemoAccount = (persona) => {
    setActivePersona(persona.role);
    setEmail(persona.email);
    setPassword(persona.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col lg:flex-row font-sans selection:bg-brand-light selection:text-brand">
      
      {/* Left Column: Branding & Visual Showcase */}
      <div className="lg:w-1/2 bg-slate-950 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Soft Background Accent Glows */}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-brand/30 via-indigo-600/20 to-purple-600/10 rounded-full blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-violet-600/30 to-sky-600/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-indigo-600 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              S
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white tracking-tight leading-none block">
                ServiceDesk <span className="font-sans text-xs font-extrabold text-brand-border">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Enterprise Operations Platform</span>
            </div>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Main Left Visual & Messaging */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-sky-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Intelligent Operations Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight">
            Your IT operations, <br />
            <span className="bg-gradient-to-r from-brand-border via-indigo-200 to-sky-200 bg-clip-text text-transparent">
              finally in one place.
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Manage incidents, hardware lifecycle assets, operating SLA timers, and AI-powered root cause diagnostics with role-tailored workspaces.
          </p>

          {/* Visual Showcase Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-bold text-sky-300">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Live SLA Monitoring
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                MongoDB Atlas Connected
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <div className="text-2xl font-serif font-bold text-white">96.8% Compliance</div>
                <div className="text-[11px] text-slate-400">Business Operating Hours (Mon–Fri)</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-amber-400">18 Open Incidents</div>
                <div className="text-[11px] text-slate-400">4 Personas Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>Groq LLM AI Integrated</span>
          <span>© 2026 ServiceDesk Pro</span>
        </div>
      </div>

      {/* Right Column: Login Form & Persona Switcher */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-main tracking-tight">
              Sign in to your workspace
            </h2>
            <p className="text-xs text-text-muted">
              Enter your credentials below or select a 1-click demo persona to explore role features.
            </p>
          </div>

          {/* Interactive Demo Persona Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand">
              Try a Demo Workspace Persona:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {demoPersonas.map((persona) => {
                const IconComponent = persona.icon;
                const isSelected = activePersona === persona.role;

                return (
                  <button
                    key={persona.role}
                    type="button"
                    onClick={() => fillDemoAccount(persona)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand/5 border-brand ring-1 ring-brand shadow-sm'
                        : 'bg-surface border-border hover:border-brand/40 hover:bg-surfaceSubtle'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${persona.color} text-white flex items-center justify-center`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-text-main line-clamp-1">{persona.title}</span>
                    </div>
                    <span className="text-[10px] text-text-muted line-clamp-1 leading-tight block">{persona.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2"
            >
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-text-main mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-subtle"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-subtle"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand disabled:opacity-50 transition-all shadow-md shadow-brand/20"
            >
              {submitting ? (
                <span>Authenticating Workspace...</span>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-text-muted">
            Need a new organization workspace?{' '}
            <Link to="/register" className="font-bold text-brand hover:underline">
              Create an Account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
