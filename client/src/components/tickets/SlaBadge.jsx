import React from 'react';
import { Clock, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SlaBadge = ({ resolutionDeadline, isBreached, status }) => {
  if (['resolved', 'closed'].includes(status)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#F1F7F3] text-[#3D6B4F] border border-[#C8E0D2]">
        <CheckCircle2 className="w-3 h-3" />
        SLA Met
      </span>
    );
  }

  if (isBreached) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-[#FDF2F0] text-[#9C3B2E] border border-[#F2C9C4] animate-pulse">
        <ShieldAlert className="w-3 h-3" />
        SLA Breached
      </span>
    );
  }

  if (!resolutionDeadline) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-medium bg-base text-text-muted border border-border">
        <Clock className="w-3 h-3" />
        No SLA Target
      </span>
    );
  }

  const now = new Date().getTime();
  const deadline = new Date(resolutionDeadline).getTime();
  const diffMins = Math.round((deadline - now) / 60000);

  if (diffMins <= 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-[#FDF2F0] text-[#9C3B2E] border border-[#F2C9C4]">
        <ShieldAlert className="w-3 h-3" />
        Breached
      </span>
    );
  }

  if (diffMins < 60) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-[#FAF5EB] text-[#B5822F] border border-[#EDE0C4]">
        <AlertTriangle className="w-3 h-3" />
        SLA: {diffMins}m left
      </span>
    );
  }

  const hrs = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-medium bg-[#F0F4F8] text-[#3E5C76] border border-[#D0DDE8]">
      <Clock className="w-3 h-3" />
      SLA: {hrs}h {remainingMins}m left
    </span>
  );
};
