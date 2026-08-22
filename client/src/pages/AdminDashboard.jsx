import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Users, UserCheck, UserX, FileClock, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const todayStr = new Date().toISOString().split('T')[0];

        const [empRes, attRes, leaveRes] = await Promise.all([
          API.get('/admin/employees'),
          API.get(`/attendance?date=${todayStr}`),
          API.get('/leaves?status=PENDING')
        ]);

        setEmployees(empRes.data);
        setAttendance(attRes.data);
        setLeaves(leaveRes.data);
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
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" /> Administrative Control Panel
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">HR Management Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Company-wide overview & daily operational metrics</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees.toString()}
          icon={Users}
          color="blue"
          subtitle="Active workforce"
        />
        <StatCard
          title="Present Today"
          value={presentToday.toString()}
          icon={UserCheck}
          color="green"
          subtitle="Checked-in team"
        />
        <StatCard
          title="Absent / Unmarked"
          value={absentToday.toString()}
          icon={UserX}
          color="rose"
          subtitle="Not checked in"
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves.toString()}
          icon={FileClock}
          color="amber"
          subtitle="Requires approval"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Approval Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Pending Leave Requests</h3>
            <Link
              to="/admin/leaves"
              className="text-sky-600 hover:text-sky-700 font-semibold text-xs flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {leaves.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No pending leave requests requiring review.
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.slice(0, 4).map((item) => (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {item.user?.firstName} {item.user?.lastName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.leaveType} • {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 italic font-light">"{item.reason}"</p>
                  </div>
                  <Link
                    to="/admin/leaves"
                    className="px-3 py-1.5 bg-sky-600 text-white rounded-lg font-semibold text-xs shadow-xs hover:bg-sky-700"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Employee Directory Preview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Recent Employees</h3>
            <Link
              to="/admin/employees"
              className="text-sky-600 hover:text-sky-700 font-semibold text-xs flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {employees.slice(0, 4).map((emp) => (
              <div key={emp._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-200">
                    {emp.firstName ? emp.firstName[0] : 'E'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {emp.firstName} {emp.lastName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {emp.designation} ({emp.department})
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                  ${emp.baseSalary ? emp.baseSalary.toLocaleString() : '50,000'}/yr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
