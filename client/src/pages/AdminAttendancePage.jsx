import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PageWrapper from '../components/PageWrapper';
import { TableSkeleton } from '../components/SkeletonLoader';
import { Clock, Filter, Calendar, User, RefreshCw } from 'lucide-react';

const AdminAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      let url = '/attendance?';
      if (dateFilter) url += `date=${encodeURIComponent(dateFilter)}&`;
      if (employeeFilter) url += `employeeId=${encodeURIComponent(employeeFilter)}`;

      const [attRes, empRes] = await Promise.all([
        API.get(url),
        API.get('/admin/employees')
      ]);

      setAttendance(attRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error('Error fetching admin attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [dateFilter, employeeFilter]);

  const clearFilters = () => {
    setDateFilter('');
    setEmployeeFilter('');
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Attendance Logs</h2>
          <p className="text-sm text-slate-500 font-medium">Monitor check-ins, check-outs, and hours worked across the company</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {(dateFilter || employeeFilter) && (
          <button
            onClick={clearFilters}
            className="text-xs text-sky-600 font-bold hover:underline self-end sm:self-center flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Clear Filters
          </button>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" /> Master Attendance Register
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : attendance.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">
            No attendance records found matching selected filter options.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown User'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{item.user?.designation}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {item.user?.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.date}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                      {item.checkIn
                        ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                      {item.checkOut
                        ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900">
                      {item.workedHours ? `${item.workedHours} hrs` : '--'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AdminAttendancePage;
