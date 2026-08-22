import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PageWrapper from '../components/PageWrapper';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  FileClock,
  Shield,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Clock,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [empRes, attRes, leaveRes, payRes] = await Promise.all([
          API.get('/admin/employees'),
          API.get('/attendance'),
          API.get('/leaves'),
          API.get('/payroll')
        ]);

        setEmployees(empRes.data);
        setAttendance(attRes.data);
        setLeaves(leaveRes.data);
        setPayrolls(payRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const totalEmployees = employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentToday = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
  const absentToday = Math.max(0, totalEmployees - presentToday);
  const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;

  // A. Attendance Overview Data (Bar Chart)
  const attendanceCounts = {
    PRESENT: attendance.filter((a) => a.status === 'PRESENT').length,
    HALF_DAY: attendance.filter((a) => a.status === 'HALF_DAY').length,
    LEAVE: attendance.filter((a) => a.status === 'LEAVE').length,
    ABSENT: absentToday
  };
  const attendanceChartData = [
    { name: 'Present', count: attendanceCounts.PRESENT || 1, fill: '#10b981' },
    { name: 'Half Day', count: attendanceCounts.HALF_DAY || 0, fill: '#6366f1' },
    { name: 'Leave', count: attendanceCounts.LEAVE || 0, fill: '#f59e0b' },
    { name: 'Absent', count: attendanceCounts.ABSENT || 0, fill: '#ef4444' }
  ];

  // B. Leave Analytics Data (Donut Chart)
  const leaveCounts = {
    PENDING: leaves.filter((l) => l.status === 'PENDING').length,
    APPROVED: leaves.filter((l) => l.status === 'APPROVED').length,
    REJECTED: leaves.filter((l) => l.status === 'REJECTED').length
  };
  const leavePieData = [
    { name: 'Pending', value: leaveCounts.PENDING || 1, color: '#f59e0b' },
    { name: 'Approved', value: leaveCounts.APPROVED || 1, color: '#10b981' },
    { name: 'Rejected', value: leaveCounts.REJECTED || 1, color: '#ef4444' }
  ];

  // C. Department Distribution Data (Bar Chart)
  const deptMap = {};
  employees.forEach((emp) => {
    const d = emp.department || 'General';
    deptMap[d] = (deptMap[d] || 0) + 1;
  });
  const deptChartData = Object.keys(deptMap).map((d) => ({
    department: d,
    count: deptMap[d]
  }));

  // D. Payroll Overview Data (Line/Bar Chart)
  const monthMap = {};
  payrolls.forEach((p) => {
    const key = `${p.month} ${p.year}`;
    monthMap[key] = (monthMap[key] || 0) + (p.netSalary || 0);
  });
  const payrollChartData = Object.keys(monthMap).map((m) => ({
    month: m,
    totalSpend: monthMap[m]
  }));

  return (
    <PageWrapper className="space-y-8">
      {/* Executive Overview Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Administrative Control Console
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">HR Operations & Analytics Summary</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Monitor real-time company attendance, employee distribution, leave analytics, and payroll trends.
          </p>
        </div>

        <div className="relative z-10 flex items-center space-x-3 shrink-0">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/admin/leaves"
              className="px-5 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              Review Pending Leaves ({pendingLeaves})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            index={0}
            title="Total Workforce"
            value={totalEmployees.toString()}
            icon={Users}
            color="blue"
            subtitle="Registered Employees"
            trend="up"
            trendValue="Active"
          />

          <StatCard
            index={1}
            title="Present Today"
            value={presentToday.toString()}
            icon={UserCheck}
            color="green"
            subtitle="Checked In"
            trend="up"
            trendValue={`${totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0}%`}
          />

          <StatCard
            index={2}
            title="Absent / Unmarked"
            value={absentToday.toString()}
            icon={UserX}
            color="rose"
            subtitle="Not Clocked In"
          />

          <StatCard
            index={3}
            title="Pending Leave Review"
            value={pendingLeaves.toString()}
            icon={FileClock}
            color="amber"
            subtitle="Requires Action"
          />
        </div>
      )}

      {/* ==================================================
          ADMIN DASHBOARD RECHARTS ANALYTICS GRID (4 CHARTS)
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Attendance Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-600" />
                Attendance Overview
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Breakdown across all attendance statuses</p>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              Live Register
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                  {attendanceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* B. Leave Analytics Chart (Donut / Pie) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-amber-500" />
                Leave Analytics
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Distribution by approval status</p>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              Applications
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leavePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leavePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* C. Department Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Department Distribution
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Headcount per department</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Workforce
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* D. Payroll Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Payroll Spend Overview
              </h3>
              <p className="text-xs text-slate-500 font-semibold">Monthly net salary disbursement totals</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Expenditure
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollChartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spend']}
                />
                <Line type="monotone" dataKey="totalSpend" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Approval Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileClock className="w-5 h-5 text-amber-500" />
                Pending Leave Queue
              </h3>
              <Link
                to="/admin/leaves"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Go to Approvals Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <TableSkeleton rows={3} />
            ) : leaves.filter((l) => l.status === 'PENDING').length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                No leave applications awaiting review.
              </div>
            ) : (
              <div className="space-y-3">
                {leaves.filter((l) => l.status === 'PENDING').slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.user?.firstName} {item.user?.lastName}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {item.leaveType} • {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 italic font-medium">"{item.reason}"</p>
                    </div>

                    <Link
                      to="/admin/leaves"
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Employee Directory Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                Employee Roster Peek
              </h3>
              <Link
                to="/admin/employees"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                View Directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <TableSkeleton rows={3} />
            ) : (
              <div className="divide-y divide-slate-100">
                {employees.slice(0, 4).map((emp) => (
                  <div key={emp._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                        {emp.firstName ? emp.firstName[0].toUpperCase() : 'E'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {emp.firstName} {emp.lastName}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          {emp.designation} ({emp.department})
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black px-3 py-1 bg-slate-100 text-slate-900 rounded-full">
                      ${emp.baseSalary ? emp.baseSalary.toLocaleString() : '50,000'}/yr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
