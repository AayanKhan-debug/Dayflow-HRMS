import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  UserPlus,
  AlertCircle,
  ArrowRight,
  Sun,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  Shield,
  User
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    department: 'Engineering',
    designation: 'Software Engineer',
    phone: '',
    address: '',
    baseSalary: 50000
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const userData = await register(formData);
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Left SaaS Hero Branding Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl"></div>

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
            Create your account & get started in seconds.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Join thousands of teams leveraging Dayflow for seamless attendance tracking, automated salary processing, and employee self-service.
          </p>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              Role-Based Access Control
            </div>
            <p className="text-slate-400">
              Choose between <b>Employee Workspace</b> or <b>Admin Management Portal</b> during registration.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © 2026 Dayflow HRMS • Modern MERN Stack Hackathon Platform
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-50 text-slate-900 overflow-y-auto">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 md:p-10 my-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md mb-3">
              <UserPlus className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-500 mt-1">Register for a new Dayflow account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane.smith@company.com"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-4 pr-11 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'EMPLOYEE' })}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    formData.role === 'EMPLOYEE'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User className="w-5 h-5 text-sky-600" />
                  <div>
                    <div className="font-bold text-xs">EMPLOYEE</div>
                    <div className="text-[10px] text-slate-500">Standard Access</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
                    formData.role === 'ADMIN'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-bold text-xs">ADMIN</div>
                    <div className="text-[10px] text-slate-500">Full Portal Mgmt</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Engineering"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Base Salary ($/year)
              </label>
              <input
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                placeholder="60000"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
            >
              {submitting ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-sky-600 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
