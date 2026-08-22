import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import {
  Clock,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  LogOut as LogOutIcon,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Plus,
  ArrowRight,
  User,
  Zap,
  Sparkles
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [attRes, leaveRes, payRes] = await Promise.all([
        API.get('/attendance/my'),
        API.get('/leaves/my'),
        API.get('/payroll/my')
      ]);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setPayroll(payRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((r) => r.date === todayStr);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setActionMessage({ type: '', text: '' });
      await API.post('/attendance/check-in');
      setActionMessage({ type: 'success', text: 'Checked in successfully for today!' });
      await fetchDashboardData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Check-in failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setActionMessage({ type: '', text: '' });
      await API.post('/attendance/check-out');
      setActionMessage({ type: 'success', text: 'Checked out successfully!' });
      await fetchDashboardData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED').length;
  const latestPayroll = payroll[0];

  return (
    <div className="space-y-8">
      {/* Large SaaS Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/15 text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Employee Workspace
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {getTimeOfDayGreeting()}, {user?.firstName || 'Team Member'}! 👋
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Here is your daily attendance log, leave applications status, and salary summary.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {user?.department}
              </div>
              <div className="text-sm font-extrabold text-sky-400">{user?.designation}</div>
            </div>
          </div>
        </div>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 shadow-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold">{actionMessage.text}</span>
        </div>
      )}

      {/* Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Attendance"
          value={todayRecord ? todayRecord.status : 'NOT CHECKED IN'}
          icon={UserCheck}
          color={todayRecord ? 'green' : 'amber'}
          subtitle={todayRecord?.checkIn ? `In at ${new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Action Required'}
        />

        <StatCard
          title="Hours Worked Today"
          value={`${todayRecord?.workedHours || 0} hrs`}
          icon={Clock}
          color="indigo"
          subtitle={todayRecord?.checkOut ? 'Day Completed' : todayRecord ? 'Currently Working' : 'Not Started'}
        />

        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.toString()}
          icon={CalendarCheck}
          color="blue"
          subtitle={`${approvedLeaves} Approved leaves`}
        />

        <StatCard
          title="Annual Base Salary"
          value={`$${user?.baseSalary ? user.baseSalary.toLocaleString() : '50,000'}`}
          icon={CreditCard}
          color="purple"
          subtitle="Fixed Compensation"
        />
      </div>

      {/* Quick Action Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-sky-500" />
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/leaves"
            className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-100 text-sky-900 transition-all flex flex-col justify-between group"
          >
            <div className="p-2.5 rounded-xl bg-white text-sky-600 w-max shadow-2xs group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="font-bold text-sm">Apply for Leave</div>
              <div className="text-[11px] text-sky-600">Submit new request</div>
            </div>
          </Link>

          <Link
            to="/attendance"
            className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-900 transition-all flex flex-col justify-between group"
          >
            <div className="p-2.5 rounded-xl bg-white text-emerald-600 w-max shadow-2xs group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="font-bold text-sm">Attendance Log</div>
              <div className="text-[11px] text-emerald-600">View check-ins history</div>
            </div>
          </Link>

          <Link
            to="/payroll"
            className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-100 text-purple-900 transition-all flex flex-col justify-between group"
          >
            <div className="p-2.5 rounded-xl bg-white text-purple-600 w-max shadow-2xs group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="font-bold text-sm">View Salary Slips</div>
              <div className="text-[11px] text-purple-600">Pay statements</div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 text-indigo-900 transition-all flex flex-col justify-between group"
          >
            <div className="p-2.5 rounded-xl bg-white text-indigo-600 w-max shadow-2xs group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="font-bold text-sm">Update Profile</div>
              <div className="text-[11px] text-indigo-600">Edit contact details</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-600" />
                Live Attendance Action
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {todayStr}
              </span>
            </div>

            <div className="space-y-3.5 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Check-In Time</span>
                <span className="font-bold text-slate-900">
                  {todayRecord?.checkIn
                    ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '-- : --'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Check-Out Time</span>
                <span className="font-bold text-slate-900">
                  {todayRecord?.checkOut
                    ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '-- : --'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-slate-200/80 pt-3">
                <span className="text-slate-500 font-medium">Status</span>
                <StatusBadge status={todayRecord ? todayRecord.status : 'ABSENT'} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleCheckIn}
              disabled={!!todayRecord || actionLoading}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Check In
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!todayRecord || !!todayRecord.checkOut || actionLoading}
              className="py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LogOutIcon className="w-4 h-4" />
              Check Out
            </button>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-sky-600" />
                Recent Leave Submissions
              </h3>
              <Link
                to="/leaves"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leaves.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No leave applications submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaves.slice(0, 4).map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-800">{item.leaveType}</td>
                        <td className="px-4 py-3.5 text-slate-600 text-xs font-medium">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">{item.reason}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {latestPayroll && (
            <div className="mt-4 pt-4 border-t border-slate-100 bg-purple-50/50 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-semibold text-purple-900">
                Latest Payroll Statement ({latestPayroll.month} {latestPayroll.year}):
              </span>
              <span className="font-black text-purple-900 text-sm">
                ${latestPayroll.netSalary?.toLocaleString()} ({latestPayroll.status})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
