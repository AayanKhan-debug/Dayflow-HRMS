import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  Clock,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  LogOut as LogOutIcon,
  AlertCircle,
  TrendingUp,
  UserCheck
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
      setActionMessage({ type: 'success', text: 'Checked in successfully!' });
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

  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
  const latestPayroll = payroll[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-semibold px-3 py-1 bg-white/20 rounded-full backdrop-blur-md uppercase tracking-wider text-sky-100">
            Employee Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-sky-100 text-sm mt-1 max-w-xl">
            {user?.designation} • {user?.department} Department
          </p>
        </div>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Status"
          value={todayRecord ? todayRecord.status : 'NOT CHECKED IN'}
          icon={UserCheck}
          color={todayRecord ? 'green' : 'amber'}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.toString()}
          icon={CalendarCheck}
          color="blue"
          subtitle={`${leaves.length} Total Requests`}
        />
        <StatCard
          title="Base Salary"
          value={`$${user?.baseSalary ? user.baseSalary.toLocaleString() : '50,000'}`}
          icon={CreditCard}
          color="purple"
          subtitle="Annual Compensation"
        />
        <StatCard
          title="Hours Worked Today"
          value={`${todayRecord?.workedHours || 0} hrs`}
          icon={Clock}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Action Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-sky-600" />
                Today's Attendance
              </h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                {todayStr}
              </span>
            </div>

            <div className="space-y-3 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Check-In Time</span>
                <span className="font-bold text-slate-800">
                  {todayRecord?.checkIn
                    ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '-- : --'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Check-Out Time</span>
                <span className="font-bold text-slate-800">
                  {todayRecord?.checkOut
                    ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '-- : --'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-medium">Current Status</span>
                <StatusBadge status={todayRecord ? todayRecord.status : 'ABSENT'} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleCheckIn}
              disabled={!!todayRecord || actionLoading}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Check In
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!todayRecord || !!todayRecord.checkOut || actionLoading}
              className="py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <LogOutIcon className="w-4 h-4" />
              Check Out
            </button>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-sky-600" />
              Recent Leave Activity
            </h3>
          </div>

          {leaves.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No leave applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.slice(0, 4).map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-700">{item.leaveType}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{item.reason}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
