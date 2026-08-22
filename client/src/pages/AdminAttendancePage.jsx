import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Clock, Filter, Calendar, User } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Company Attendance Records</h2>
          <p className="text-sm text-slate-500">Monitor check-ins, check-outs, and hours worked across the company</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(dateFilter || employeeFilter) && (
          <button
            onClick={clearFilters}
            className="text-xs text-sky-600 font-semibold hover:underline self-end sm:self-center"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" /> Master Attendance Log
        </div>

        {attendance.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No attendance records match the selected date/employee filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Check In</th>
                  <th className="px-6 py-3.5">Check Out</th>
                  <th className="px-6 py-3.5">Hours</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {item.user?.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{item.date}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {item.checkIn
                        ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {item.checkOut
                        ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
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
    </div>
  );
};

export default AdminAttendancePage;
