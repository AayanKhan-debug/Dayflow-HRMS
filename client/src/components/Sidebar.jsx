import React, { useContext } from 'react';
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
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
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
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 shadow-lg">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {isAdmin ? 'Management Portal' : 'Employee Workspace'}
        </div>
        <nav className="mt-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4 text-sky-400" />
          Dayflow HR System
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Signed in as <span className="text-sky-300 font-medium">{user?.role}</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
