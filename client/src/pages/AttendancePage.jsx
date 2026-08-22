import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { Clock, CheckCircle2, LogOut as LogOutIcon, AlertCircle } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Attendance</h2>
          <p className="text-sm text-slate-500">Track daily check-ins, check-outs, and total worked hours</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckIn}
            disabled={!!todayRecord || actionLoading}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-xs shadow-xs flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Check In Today
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!todayRecord || !!todayRecord.checkOut || actionLoading}
            className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-xs shadow-xs flex items-center gap-2 transition-all"
          >
            <LogOutIcon className="w-4 h-4" /> Check Out Today
          </button>
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
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" /> Attendance Logs
        </div>

        {attendance.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No attendance records found yet. Perform your first Check In above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Check In</th>
                  <th className="px-6 py-3.5">Check Out</th>
                  <th className="px-6 py-3.5">Worked Hours</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.date}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {item.checkIn
                        ? new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {item.checkOut
                        ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '--'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
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
