import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Bell, Search, Shield, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            ☀️
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Day<span className="text-sky-600">flow</span>
          </span>
        </Link>
        <span className="hidden sm:inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Enterprise HRMS
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell Icon */}
        <button
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
        </button>

        {user && (
          <Link
            to="/profile"
            className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full py-1 px-3 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {user.firstName} {user.lastName}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {user.designation || user.department}
              </div>
            </div>
          </Link>
        )}

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all font-semibold text-xs border border-slate-200 hover:border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
