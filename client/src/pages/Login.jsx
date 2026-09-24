import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

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

  // Quick Demo Account Switcher
  const fillDemoAccount = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen bg-base flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-brand-light selection:text-brand">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-brand text-white font-serif font-bold text-2xl shadow-sm mb-2">
          S
        </div>
        <h2 className="text-3xl font-serif font-bold text-text-main tracking-tight">
          ServiceDesk <span className="font-sans font-normal text-sm text-brand">PRO</span>
        </h2>
        <p className="text-xs text-text-muted">
          Enterprise IT Operations & Asset Management Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-6 sm:px-8 border border-border rounded shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3 rounded bg-status-breached/10 border border-status-breached/20 text-status-breached text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-base border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-base border border-border rounded text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded text-xs font-semibold text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand disabled:opacity-50 transition-colors shadow-sm mt-2"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Account Switcher Helper */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-brand" />
              <span>Demo Persona Quick Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-2xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@servicedesk.com', 'Admin123!')}
                className="p-2 border border-border rounded bg-base hover:border-brand text-left font-medium transition-colors"
              >
                <div className="font-semibold text-text-main">System Admin</div>
                <div className="text-text-muted text-[10px]">admin@servicedesk.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('manager@servicedesk.com', 'Manager123!')}
                className="p-2 border border-border rounded bg-base hover:border-brand text-left font-medium transition-colors"
              >
                <div className="font-semibold text-text-main">IT Manager</div>
                <div className="text-text-muted text-[10px]">manager@servicedesk.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('tech@servicedesk.com', 'Tech123!')}
                className="p-2 border border-border rounded bg-base hover:border-brand text-left font-medium transition-colors"
              >
                <div className="font-semibold text-text-main">Technician</div>
                <div className="text-text-muted text-[10px]">tech@servicedesk.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('employee@servicedesk.com', 'Employee123!')}
                className="p-2 border border-border rounded bg-base hover:border-brand text-left font-medium transition-colors"
              >
                <div className="font-semibold text-text-main">Employee</div>
                <div className="text-text-muted text-[10px]">employee@servicedesk.com</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-2xs text-text-muted">Need a new account? </span>
            <Link to="/register" className="text-2xs font-semibold text-brand hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
