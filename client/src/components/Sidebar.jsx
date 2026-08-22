import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarCheck,
  CreditCard,
  Users,
  Building2,
  FileCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const employeeLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leave Management', path: '/leaves', icon: CalendarCheck },
    { name: 'Payroll', path: '/payroll', icon: CreditCard },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance Mgmt', path: '/admin/attendance', icon: Clock },
    { name: 'Leave Requests', path: '/admin/leaves', icon: FileCheck },
    { name: 'Payroll Mgmt', path: '/admin/payroll', icon: CreditCard },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-2xl relative z-20"
    >
      {/* Collapse Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white p-1.5 rounded-full border border-slate-700 shadow-lg transition-colors z-30"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </motion.button>

      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-3 mb-4 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-900/40 shrink-0 font-bold">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-base font-black text-white tracking-wide">Dayflow</h2>
              <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">
                {isAdmin ? 'Admin Portal' : 'Employee Portal'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {isAdmin ? 'Management' : 'Navigation'}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5 mt-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                title={collapsed ? link.name : ''}
                className={({ isActive }) =>
                  `relative flex items-center ${collapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-950/60 font-bold'
                      : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{link.name}</span>}
                    {isActive && !collapsed && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xs"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Widget */}
      {!collapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-800 text-xs space-y-1 backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 text-slate-200 font-extrabold">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>SaaS Dayflow v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Role Privilege: <span className="text-sky-300 font-bold">{user?.role}</span>
          </p>
        </motion.div>
      ) : (
        <div className="flex justify-center p-2 text-slate-500">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
