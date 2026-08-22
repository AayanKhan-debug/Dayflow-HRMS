import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle, trend, trendValue, index = 0 }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-sky-100',
      glow: 'shadow-sky-500/10',
      ring: 'group-hover:border-sky-300'
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-500/10',
      ring: 'group-hover:border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'shadow-amber-500/10',
      ring: 'group-hover:border-amber-300'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'shadow-rose-500/10',
      ring: 'group-hover:border-rose-300'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'shadow-purple-500/10',
      ring: 'group-hover:border-purple-300'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'shadow-indigo-500/10',
      ring: 'group-hover:border-indigo-300'
    }
  };

  const currentStyle = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 relative overflow-hidden ${currentStyle.ring} ${currentStyle.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          
          {(subtitle || trendValue) && (
            <div className="flex items-center gap-1.5 pt-1">
              {trend && (
                <span className={`inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  trend === 'up' ? 'bg-emerald-50 text-emerald-700' : trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {trend === 'up' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {trend === 'down' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
                  {trendValue}
                </span>
              )}
              {subtitle && <span className="text-xs text-slate-500 font-semibold">{subtitle}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-4 rounded-2xl border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} shrink-0 shadow-xs transition-transform`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
