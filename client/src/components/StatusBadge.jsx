import React from 'react';

const StatusBadge = ({ status, size = 'normal' }) => {
  const s = String(status || '').toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (s === 'PRESENT' || s === 'APPROVED' || s === 'PAID') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs shadow-emerald-100';
    dotColor = 'bg-emerald-500';
  } else if (s === 'PENDING') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-xs shadow-amber-100';
    dotColor = 'bg-amber-500';
  } else if (s === 'REJECTED' || s === 'ABSENT') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80 shadow-xs shadow-rose-100';
    dotColor = 'bg-rose-500';
  } else if (s === 'HALF_DAY' || s === 'LEAVE') {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-xs shadow-indigo-100';
    dotColor = 'bg-indigo-500';
  }

  const padding = size === 'small' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border transition-colors ${colorClasses} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor} ${s === 'PENDING' || s === 'PRESENT' ? 'animate-pulse-slow' : ''}`}></span>
      {s.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
