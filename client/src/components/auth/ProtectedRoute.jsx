import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin mb-4"></div>
        <p className="text-xs text-text-muted font-medium">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 bg-surface rounded border border-border max-w-xl mx-auto my-12 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded bg-status-breached/10 text-status-breached flex items-center justify-center mx-auto border border-status-breached/20">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-text-main">Access Restricted</h2>
          <p className="text-xs text-text-muted mt-1">
            Your role (<span className="font-mono font-semibold text-text-main">{user.role}</span>) does not have permission to view this view. Required role(s): [{allowedRoles.join(', ')}].
          </p>
        </div>
      </div>
    );
  }

  return children;
};
