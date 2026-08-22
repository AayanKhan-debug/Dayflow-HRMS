import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
  Sun
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
    <aside
      className={`bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-xl transition-all duration-300 relative ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-6 bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white p-1 rounded-full border border-slate-700 shadow-md transition-colors z-20"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-3 mb-4 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-900/30 shrink-0 font-bold">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">Dayflow</h2>
              <p className="text-[11px] font-semibold text-slate-400">
                {isAdmin ? 'Admin Console' : 'Employee Workspace'}
              </p>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                  `flex items-center ${collapsed ? 'justify-center px-0' : 'space-x-3 px-3.5'} py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-950/50 font-semibold'
                      : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Widget */}
      {!collapsed ? (
        <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>SaaS Dayflow v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Role: <span className="text-sky-300 font-semibold">{user?.role}</span>
          </p>
        </div>
      ) : (
        <div className="flex justify-center p-2 text-slate-500">
          <ShieldCheck className="w-5 h-5 text-sky-400" />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
