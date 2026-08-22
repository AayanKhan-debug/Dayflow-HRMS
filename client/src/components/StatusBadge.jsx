import React from 'react';

const StatusBadge = ({ status, type = 'general' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  const s = String(status || '').toUpperCase();

  if (s === 'PRESENT' || s === 'APPROVED' || s === 'PAID') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (s === 'PENDING') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (s === 'REJECTED' || s === 'ABSENT') {
    style = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (s === 'HALF_DAY' || s === 'LEAVE') {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full fill-current bg-current"></span>
      {s.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
