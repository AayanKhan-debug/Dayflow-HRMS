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
          <h2 className="text-2xl font-bold text-slate-800">Payroll Management</h2>
          <p className="text-sm text-slate-500">Generate, adjust, and disburse monthly employee payrolls</p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Generate Payroll
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600" /> Master Payroll Records
        </div>

        {payrolls.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No payroll statements found. Click "Generate Payroll" to issue a statement.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-6 py-3.5">Period</th>
                  <th className="px-6 py-3.5">Base Salary</th>
                  <th className="px-6 py-3.5">Allowances</th>
                  <th className="px-6 py-3.5">Deductions</th>
                  <th className="px-6 py-3.5">Net Salary</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrolls.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
                      </div>
                      <div className="text-xs text-slate-500">{item.user?.department}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {item.month} {item.year}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      ${item.baseSalary ? item.baseSalary.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">
                      +${item.allowances ? item.allowances.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-rose-600 font-medium">
                      -${item.deductions ? item.deductions.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 text-base">
                      ${item.netSalary ? item.netSalary.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Edit
                        </button>
                        {item.status === 'PENDING' && (
                          <button
                            onClick={() => handleMarkPaid(item._id)}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
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
      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Generate Payroll Statement">
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Employee *</label>
            <select
              value={generateForm.employeeId}
              onChange={handleEmployeeSelectInGenerate}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
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
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Month *</label>
              <select
                value={generateForm.month}
                onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Year *</label>
              <input
                type="number"
                value={generateForm.year}
                onChange={(e) => setGenerateForm({ ...generateForm, year: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Base Salary</label>
              <input
                type="number"
                value={generateForm.baseSalary}
                onChange={(e) => setGenerateForm({ ...generateForm, baseSalary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Allowances</label>
              <input
                type="number"
                value={generateForm.allowances}
                onChange={(e) => setGenerateForm({ ...generateForm, allowances: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Deductions</label>
              <input
                type="number"
                value={generateForm.deductions}
                onChange={(e) => setGenerateForm({ ...generateForm, deductions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-600">Calculated Net Salary:</span>
            <span className="text-emerald-700 text-base">
              ${(Number(generateForm.baseSalary || 0) + Number(generateForm.allowances || 0) - Number(generateForm.deductions || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-sky-600 text-white font-semibold rounded-xl text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? 'Generating...' : 'Generate Record'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Payroll Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Payroll Breakdown">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Base Salary</label>
            <input
              type="number"
              value={editForm.baseSalary}
              onChange={(e) => setEditForm({ ...editForm, baseSalary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Allowances ($)</label>
            <input
              type="number"
              value={editForm.allowances}
              onChange={(e) => setEditForm({ ...editForm, allowances: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Deductions ($)</label>
            <input
              type="number"
              value={editForm.deductions}
              onChange={(e) => setEditForm({ ...editForm, deductions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-600">Updated Net Salary:</span>
            <span className="text-emerald-700 text-base">
              ${(Number(editForm.baseSalary || 0) + Number(editForm.allowances || 0) - Number(editForm.deductions || 0)).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="py-2 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-sky-600 text-white font-semibold rounded-xl text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Save Payroll'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPayrollPage;
