import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Clock, CheckCircle2, LogOut as LogOutIcon, AlertCircle, Calendar, Timer } from 'lucide-react';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get('/attendance/my');
      setAttendance(res.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((r) => r.date === todayStr);

  const totalWorkedHours = attendance.reduce((acc, curr) => acc + (curr.workedHours || 0), 0);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setActionMessage({ type: '', text: '' });
      await API.post('/attendance/check-in');
      setActionMessage({ type: 'success', text: 'Checked in successfully!' });
      await fetchMyAttendance();
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
      await fetchMyAttendance();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Check-out failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Logs</h2>
          <p className="text-sm text-slate-500 font-medium">Track your daily check-in, check-out times and accumulated hours</p>
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <Timer className="w-5 h-5 text-sky-600" />
          <div className="text-xs">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Total Logged Hours</span>
            <span className="font-extrabold text-slate-900 text-sm">{totalWorkedHours.toFixed(1)} hrs</span>
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

      {/* Interactive Clock Action Widget */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 rounded-3xl p-6 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Today • {todayStr}
            </div>
            <h3 className="text-xl font-black text-white">
              Status: {todayRecord ? todayRecord.status : 'Not Clocked In'}
            </h3>
            <p className="text-slate-300 text-xs">
              {todayRecord?.checkIn
                ? `Clocked In at ${new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Please check in when you begin work.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleCheckIn}
              disabled={!!todayRecord || actionLoading}
              className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 text-white disabled:text-slate-500 font-bold rounded-2xl text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Check In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!todayRecord || !!todayRecord.checkOut || actionLoading}
              className="py-3 px-5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white disabled:text-slate-500 font-bold rounded-2xl text-xs shadow-md flex items-center gap-2 transition-all"
            >
              <LogOutIcon className="w-4 h-4" /> Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" /> Historical Attendance Records
        </div>

        {attendance.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No attendance records found yet. Use the Check In button above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Worked Hours</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.date}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {item.checkIn
                        ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {item.checkOut
                        ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
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

export default AttendancePage;
