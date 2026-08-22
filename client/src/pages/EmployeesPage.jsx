import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Modal from '../components/Modal';
import PageWrapper from '../components/PageWrapper';
import { TableSkeleton } from '../components/SkeletonLoader';
import { motion } from 'framer-motion';
import { Users, Search, Edit3, Shield, Mail, Building2, Briefcase, DollarSign, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'EMPLOYEE',
    department: '',
    designation: '',
    baseSalary: 50000,
    phone: '',
    address: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      let url = '/admin/employees?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (department && department !== 'All') url += `department=${encodeURIComponent(department)}`;

      const res = await API.get(url);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department]);

  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setEditForm({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      role: emp.role || 'EMPLOYEE',
      department: emp.department || '',
      designation: emp.designation || '',
      baseSalary: emp.baseSalary || 50000,
      phone: emp.phone || '',
      address: emp.address || ''
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      await API.put(`/admin/employees/${selectedEmp._id}`, editForm);
      setMessage({ type: 'success', text: 'Employee details updated successfully!' });
      setIsModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update employee.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-sm text-slate-500 font-medium">Search and manage workforce designations, roles, and salaries</p>
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

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search name, email, designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Dept Filter:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-white font-semibold w-full sm:w-auto"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Human Resources">Human Resources</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} />
        ) : employees.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">
            No employees found matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                          {emp.firstName ? emp.firstName[0].toUpperCase() : 'E'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-bold">{emp.department}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">{emp.designation}</td>
                    <td className="px-6 py-4 font-black text-emerald-700">
                      ${emp.baseSalary ? emp.baseSalary.toLocaleString() : '50,000'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(emp)}
                        className="py-1.5 px-3.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto transition-all shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Details
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Employee Information"
        icon={Edit3}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">First Name</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Last Name</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm bg-white font-medium"
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Designation</label>
              <input
                type="text"
                value={editForm.designation}
                onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Base Salary ($)</label>
              <input
                type="number"
                value={editForm.baseSalary}
                onChange={(e) => setEditForm({ ...editForm, baseSalary: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="py-2.5 px-5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Employee Details'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default EmployeesPage;
