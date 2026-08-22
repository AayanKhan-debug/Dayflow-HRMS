import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { CreditCard, Plus, CheckCircle2, AlertCircle, Edit3, DollarSign } from 'lucide-react';

const AdminPayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate modal state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    employeeId: '',
    month: 'August',
    year: 2026,
    baseSalary: 50000,
    allowances: 0,
    deductions: 0
  });

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [editForm, setEditForm] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const [payRes, empRes] = await Promise.all([
        API.get('/payroll'),
        API.get('/admin/employees')
      ]);
      setPayrolls(payRes.data);
      setEmployees(empRes.data);
      if (empRes.data.length > 0 && !generateForm.employeeId) {
        setGenerateForm((prev) => ({
          ...prev,
          employeeId: empRes.data[0]._id,
          baseSalary: empRes.data[0].baseSalary || 50000
        }));
      }
    } catch (err) {
      console.error('Error fetching admin payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const handleEmployeeSelectInGenerate = (e) => {
    const empId = e.target.value;
    const emp = employees.find((x) => x._id === empId);
    setGenerateForm({
      ...generateForm,
      employeeId: empId,
      baseSalary: emp ? emp.baseSalary || 50000 : 50000
    });
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      await API.post('/payroll', generateForm);
      setMessage({ type: 'success', text: 'Payroll record generated successfully!' });
      setIsGenerateOpen(false);
      await fetchPayrollData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to generate payroll.' });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedPayroll(item);
    setEditForm({
      baseSalary: item.baseSalary,
      allowances: item.allowances,
      deductions: item.deductions
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });

      await API.put(`/payroll/${selectedPayroll._id}`, editForm);
      setMessage({ type: 'success', text: 'Payroll allowances & deductions updated!' });
      setIsEditOpen(false);
      await fetchPayrollData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update payroll.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (payrollId) => {
    try {
      setMessage({ type: '', text: '' });
      await API.put(`/payroll/${payrollId}/pay`);
      setMessage({ type: 'success', text: 'Payroll status updated to PAID!' });
      await fetchPayrollData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to mark as paid.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payroll Operations</h2>
          <p className="text-sm text-slate-500 font-medium">Generate salary statements, adjust allowances & deductions, and disburse pay</p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="py-3 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" /> Issue New Payroll
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
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Payroll Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600" /> Company Payroll Records
        </div>

        {payrolls.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No payroll statements generated yet. Click "Issue New Payroll" to generate one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">Allowances</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Net Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrolls.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{item.user?.department}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.month} {item.year}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      ${item.baseSalary ? item.baseSalary.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">
                      +${item.allowances ? item.allowances.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-rose-600 font-bold">
                      -${item.deductions ? item.deductions.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 text-base">
                      ${item.netSalary ? item.netSalary.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                        >
                          Edit
                        </button>
                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => handleMarkPaid(item._id)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Payroll Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Employee Payroll Statement"
        icon={Plus}
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Select Employee *</label>
            <select
              value={generateForm.employeeId}
              onChange={handleEmployeeSelectInGenerate}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm bg-white font-medium"
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Month *</label>
              <select
                value={generateForm.month}
                onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm bg-white font-medium"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Year *</label>
              <input
                type="number"
                value={generateForm.year}
                onChange={(e) => setGenerateForm({ ...generateForm, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Base Salary</label>
              <input
                type="number"
                value={generateForm.baseSalary}
                onChange={(e) => setGenerateForm({ ...generateForm, baseSalary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Allowances</label>
              <input
                type="number"
                value={generateForm.allowances}
                onChange={(e) => setGenerateForm({ ...generateForm, allowances: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deductions</label>
              <input
                type="number"
                value={generateForm.deductions}
                onChange={(e) => setGenerateForm({ ...generateForm, deductions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-rose-700"
              />
            </div>
          </div>

          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex justify-between items-center text-sm font-bold">
            <span className="text-sky-900">Calculated Net Salary:</span>
            <span className="text-emerald-700 text-lg font-black">
              ${(Number(generateForm.baseSalary || 0) + Number(generateForm.allowances || 0) - Number(generateForm.deductions || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? 'Generating...' : 'Issue Statement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Payroll Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Payroll Allowances & Deductions"
        icon={Edit3}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Base Salary ($)</label>
            <input
              type="number"
              value={editForm.baseSalary}
              onChange={(e) => setEditForm({ ...editForm, baseSalary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Allowances ($)</label>
            <input
              type="number"
              value={editForm.allowances}
              onChange={(e) => setEditForm({ ...editForm, allowances: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold text-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Deductions ($)</label>
            <input
              type="number"
              value={editForm.deductions}
              onChange={(e) => setEditForm({ ...editForm, deductions: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold text-rose-700"
            />
          </div>

          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex justify-between items-center text-sm font-bold">
            <span className="text-sky-900">Updated Net Salary:</span>
            <span className="text-emerald-700 text-lg font-black">
              ${(Number(editForm.baseSalary || 0) + Number(editForm.allowances || 0) - Number(editForm.deductions || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold rounded-2xl text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPayrollPage;
