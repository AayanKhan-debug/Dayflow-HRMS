import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-3 bg-slate-200 rounded-md w-24"></div>
      <div className="h-10 w-10 bg-slate-200 rounded-2xl"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded-lg w-32"></div>
    <div className="h-3 bg-slate-100 rounded-md w-40"></div>
  </div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 space-y-4 animate-pulse">
    <div className="h-4 bg-slate-200 rounded-md w-48 mb-6"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-200 rounded-md w-36"></div>
            <div className="h-2.5 bg-slate-100 rounded-md w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </div>
    ))}
  </div>
);

export default CardSkeleton;
