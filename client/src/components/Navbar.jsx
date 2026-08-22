import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Sun, CheckCheck, CalendarCheck, Clock, CreditCard, UserCheck, ChevronRight, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN';

  // Role-specific initial notifications
  const adminNotifications = [
    {
      id: 1,
      type: 'leave',
      title: 'New Leave Request',
      message: 'John Doe submitted a Casual Leave request (3 days).',
      time: '10 mins ago',
      unread: true,
      link: '/admin/leaves'
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Workforce Attendance',
      message: '4 employees clocked in for today.',
      time: '1 hour ago',
      unread: true,
      link: '/admin/attendance'
    },
    {
      id: 3,
      type: 'payroll',
      title: 'Payroll Generated',
      message: 'August payroll statements ready for review.',
      time: '3 hours ago',
      unread: false,
      link: '/admin/payroll'
    }
  ];

  const employeeNotifications = [
    {
      id: 1,
      type: 'leave',
      title: 'Leave Approved! 🎉',
      message: 'Your Sick Leave application was approved by Alex Morgan.',
      time: '15 mins ago',
      unread: true,
      link: '/leaves'
    },
    {
      id: 2,
      type: 'payroll',
      title: 'Salary Statement Issued',
      message: 'August payslip issued: $86,500 net salary.',
      time: '2 hours ago',
      unread: true,
      link: '/payroll'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Daily Check-In Confirmed',
      message: 'Checked in at 9:00 AM today.',
      time: '5 hours ago',
      unread: false,
      link: '/attendance'
    }
  ];

  const [notifications, setNotifications] = useState(isAdmin ? adminNotifications : employeeNotifications);

  useEffect(() => {
    setNotifications(isAdmin ? adminNotifications : employeeNotifications);
  }, [user?.role]);

  // Click outside listener for notifications popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (n) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
    );
    setShowNotifications(false);
    navigate(n.link);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-sky-500/20"
          >
            ☀️
          </motion.div>
          <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
            Day<span className="text-sky-600">flow</span>
          </span>
        </Link>
        <span className="hidden sm:inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Enterprise HRMS
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell & Interactive Dropdown */}
        <div className="relative" ref={popoverRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-2xl transition-all relative ${
              showNotifications ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* Notification Popover Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-50"
              >
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-sky-100 text-sky-700 font-extrabold text-[10px] rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                          n.unread ? 'bg-sky-50/40' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'leave' && (
                            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                              <CalendarCheck className="w-4 h-4" />
                            </div>
                          )}
                          {n.type === 'attendance' && (
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <Clock className="w-4 h-4" />
                            </div>
                          )}
                          {n.type === 'payroll' && (
                            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                              <CreditCard className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold ${n.unread ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                        </div>

                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 self-center"></span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Click any notification to navigate to details
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {user && (
          <Link
            to="/profile"
            className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-full py-1.5 px-3.5 transition-all shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {user.firstName} {user.lastName}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-semibold">
                {user.designation || user.department}
              </div>
            </div>
          </Link>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          title="Logout"
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs border border-slate-200 hover:border-rose-200 shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </header>
  );
};

export default Navbar;
