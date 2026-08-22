import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
          Dayflow HRMS
        </h1>
        <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          v1.0 Demo
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-full py-1 px-3">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {user.firstName} {user.lastName}
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                  {user.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{user.designation || user.department}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors font-medium text-xs border border-slate-200 hover:border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
