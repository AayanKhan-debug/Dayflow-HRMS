import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { CalendarCheck, Plus, CheckCircle2, AlertCircle, MessageSquare, Calendar } from 'lucide-react';

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState('ALL');

  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get('/leaves/my');
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      await API.post('/leaves', formData);
      setMessage({ type: 'success', text: 'Leave application submitted successfully!' });
      setIsModalOpen(false);
      setFormData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      await fetchMyLeaves();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit leave request.' });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaves = leaves.filter((l) => {
    if (filterTab === 'ALL') return true;
    return l.status === filterTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Management</h2>
          <p className="text-sm text-slate-500 font-medium">Apply for time off and monitor status updates</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold">{actionMessage.text || message.text}</span>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-max">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTab === tab
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leave Application History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-sky-600" /> My Leave Submissions
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No leave requests found for status "{filterTab}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Admin Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.leaveType}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs">{item.reason}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {item.adminComment ? (
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{item.adminComment}</span>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">No comments</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for Leave"
        icon={CalendarCheck}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Leave Type *
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-white font-medium"
            >
              <option value="CASUAL">CASUAL</option>
              <option value="SICK">SICK</option>
              <option value="UNPAID">UNPAID</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100 flex items-center justify-between text-xs font-bold text-sky-900">
              <span>Total Leave Duration:</span>
              <span className="text-sky-700 text-sm">{calculateDays()} Days</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason *
            </label>
            <textarea
              name="reason"
              required
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              placeholder="State the reason for your leave application..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Leave Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeavePage;
