import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend, trendValue }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100',
      ring: 'group-hover:border-sky-200'
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      ring: 'group-hover:border-emerald-200'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      ring: 'group-hover:border-amber-200'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      ring: 'group-hover:border-rose-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      ring: 'group-hover:border-purple-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      ring: 'group-hover:border-indigo-200'
    }
  };

  const currentStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${currentStyle.ring}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          
          {(subtitle || trendValue) && (
            <div className="flex items-center gap-1.5 pt-1">
              {trend && (
                <span className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  trend === 'up' ? 'bg-emerald-50 text-emerald-700' : trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                  {trendValue}
                </span>
              )}
              {subtitle && <span className="text-xs text-slate-500 font-medium">{subtitle}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} shrink-0 transition-transform group-hover:scale-105`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
