import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PageWrapper from '../components/PageWrapper';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, FileClock, Shield, ArrowRight, DollarSign, CheckCircle2, Clock, Activity, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        const todayStr = new Date().toISOString().split('T')[0];

        const [empRes, attRes, leaveRes, payRes] = await Promise.all([
          API.get('/admin/employees'),
          API.get(`/attendance?date=${todayStr}`),
          API.get('/leaves?status=PENDING'),
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
  const presentToday = attendance.filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
  const absentToday = Math.max(0, totalEmployees - presentToday);
  const pendingLeaves = leaves.length;

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
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">HR Operations & Executive Summary</h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Monitor real-time company attendance, employee records, leave approvals, and payroll disbursement.
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
            ) : leaves.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                No leave applications awaiting review.
              </div>
            ) : (
              <div className="space-y-3">
                {leaves.slice(0, 4).map((item) => (
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
