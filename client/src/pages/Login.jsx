import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LogIn,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Clock,
  CalendarCheck,
  CreditCard,
  Users,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Building2
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
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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

  const isAdminSelected = email === 'admin@dayflow.com';
  const isEmployeeSelected = email === 'employee@dayflow.com';

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Left SaaS Hero Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950 p-12 flex-col justify-between relative border-r border-slate-800/80 overflow-hidden"
      >
        {/* Subtle Animated Background Glow Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-sky-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-24 -left-24 w-[450px] h-[450px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"
        />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-sky-500/25 border border-white/10"
            >
              <Sun className="w-7 h-7" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Day<span className="text-sky-400">flow</span>
              </h1>
              <p className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest">
                Human Resource Management System
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/15 text-sky-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            SaaS Platform v1.0
          </div>
        </div>

        {/* Hero Middle Feature Content */}
        <div className="relative z-10 space-y-8 my-auto max-w-lg">
          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Empower your workforce with modern HR operations.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              Seamlessly manage attendance check-ins, leave application approval workflows, employee records, and monthly salary disbursement in one place.
            </p>
          </div>

          {/* Floating HR Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 backdrop-blur-md shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Attendance Logs</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">1-click daily check-in</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 backdrop-blur-md shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Leave Workflow</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Instant status reviews</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 backdrop-blur-md shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Automated Payroll</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Salary slips & history</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3 backdrop-blur-md shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Employee Roster</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Role & department directory</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Left Footer Info */}
        <div className="relative z-10 text-xs text-slate-500 font-semibold flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span>© 2026 Dayflow HRMS • Hackathon Edition</span>
          <span className="text-sky-400 font-bold">MERN Stack Architecture</span>
        </div>
      </motion.div>

      {/* 2. Right Login Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50 text-slate-900"
      >
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden relative">
          {/* Top Accent Gradient Border */}
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 w-full" />

          <div className="p-8 md:p-10">
            {/* Header Title */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md mb-3"
              >
                <LogIn className="w-7 h-7" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Dayflow</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Enter your credentials to access your HR workspace</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50 font-medium transition-all"
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

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* 3. Demo Persona Section */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 text-center">
                1-Click Selectable Persona Login
              </p>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => fillQuickLogin('ADMIN')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                    isAdminSelected
                      ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/30 text-purple-900 shadow-md'
                      : 'bg-slate-50 hover:bg-purple-50/60 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {isAdminSelected && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 font-bold" />
                    )}
                  </div>
                  <div className="mt-2.5">
                    <div className="font-extrabold text-xs text-purple-950">Admin Persona</div>
                    <div className="text-[10px] text-purple-700 font-semibold">Full Control Panel</div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => fillQuickLogin('EMPLOYEE')}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                    isEmployeeSelected
                      ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/30 text-sky-900 shadow-md'
                      : 'bg-slate-50 hover:bg-sky-50/60 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700 font-bold">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    {isEmployeeSelected && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 font-bold" />
                    )}
                  </div>
                  <div className="mt-2.5">
                    <div className="font-extrabold text-xs text-sky-950">Employee Persona</div>
                    <div className="text-[10px] text-sky-700 font-semibold">Staff Portal</div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Footer Link */}
            <p className="text-center text-xs text-slate-500 font-semibold mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-sky-600 font-extrabold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
