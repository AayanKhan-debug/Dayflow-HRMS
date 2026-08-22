import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LogIn,
  Shield,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  CheckCircle2,
  Clock,
  CalendarCheck,
  CreditCard
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (role) => {
    if (role === 'ADMIN') {
      setEmail('admin@dayflow.com');
      setPassword('admin123');
    } else {
      setEmail('employee@dayflow.com');
      setPassword('emp123');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Left SaaS Hero Branding Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Dayflow</h1>
              <p className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                Human Resource Management System
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <h2 className="text-4xl font-black text-white leading-tight">
            Streamline your workforce, attendance & payroll in one place.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Dayflow empowers companies with automated daily check-ins, real-time worked hours tracking, instant leave approval workflows, and automated payroll processing.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-start space-x-3">
              <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Attendance Logs</h4>
                <p className="text-xs text-slate-400">1-click Check In & Check Out</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-start space-x-3">
              <CalendarCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">Leave Approvals</h4>
                <p className="text-xs text-slate-400">Instant status updates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Dayflow HRMS • Modern MERN Stack Hackathon Platform
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md mb-3">
              <LogIn className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Dayflow</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your HR workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Persona Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Instant Hackathon Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillQuickLogin('ADMIN')}
                className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <Shield className="w-4 h-4" />
                Admin Persona
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('EMPLOYEE')}
                className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-sky-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <User className="w-4 h-4" />
                Employee Persona
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-600 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
