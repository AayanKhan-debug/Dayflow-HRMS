import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import PageWrapper from '../components/PageWrapper';
import { TableSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import { FileCheck, CheckCircle2, XCircle, MessageSquare, AlertCircle } from 'lucide-react';

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'APPROVE' or 'REJECT'
  const [adminComment, setAdminComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/leaves?status=${statusFilter}`);
      setLeaves(res.data);
    } catch (err) {
      console.error('Error fetching admin leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const openActionModal = (leave, type) => {
    setSelectedLeave(leave);
    setActionType(type);
    setAdminComment('');
    setIsModalOpen(true);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      const endpoint = actionType === 'APPROVE'
        ? `/leaves/${selectedLeave._id}/approve`
        : `/leaves/${selectedLeave._id}/reject`;

      await API.put(endpoint, { adminComment });

      setMessage({
        type: 'success',
        text: `Leave request ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully!`
      });
      setIsModalOpen(false);
      await fetchLeaves();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approvals Portal</h2>
          <p className="text-sm text-slate-500 font-medium">Review and process employee leave applications with feedback</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl shrink-0 self-start sm:self-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-semibold">{message.text}</span>
        </motion.div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-sky-600" /> Master Leave Applications Queue
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : leaves.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">
            No leave applications found matching status "{statusFilter}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {item.user?.department} • {item.user?.designation}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{item.leaveType}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                      {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs font-medium">{item.reason}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openActionModal(item, 'APPROVE')}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openActionModal(item, 'REJECT')}
                            className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </motion.button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium italic">
                          {item.adminComment ? `Feedback: ${item.adminComment}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${actionType === 'APPROVE' ? 'Approve' : 'Reject'} Leave Request`}
        icon={actionType === 'APPROVE' ? CheckCircle2 : XCircle}
      >
        <form onSubmit={handleActionSubmit} className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
            <p className="font-extrabold text-slate-900">
              {selectedLeave?.user?.firstName} {selectedLeave?.user?.lastName} ({selectedLeave?.leaveType})
            </p>
            <p className="text-xs text-slate-500 mt-1">"{selectedLeave?.reason}"</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Feedback Comment (Optional)
            </label>
            <textarea
              rows={3}
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="e.g. Approved. Have a good break!"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm font-medium"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className={`py-2.5 px-5 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50 ${
                actionType === 'APPROVE'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {submitting ? 'Processing...' : `Confirm ${actionType === 'APPROVE' ? 'Approval' : 'Rejection'}`}
            </motion.button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default AdminLeavePage;
