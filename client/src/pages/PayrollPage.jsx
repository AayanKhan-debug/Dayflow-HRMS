import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';

const PayrollPage = () => {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPayroll = async () => {
      try {
        setLoading(true);
        const res = await API.get('/payroll/my');
        setPayroll(res.data);
      } catch (err) {
        console.error('Error fetching payroll:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayroll();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Payroll</h2>
        <p className="text-sm text-slate-500">View salary breakdown, allowances, deductions, and payment status</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-800 text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600" /> Salary Records & Statements
        </div>

        {payroll.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No payroll statements generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Period</th>
                  <th className="px-6 py-3.5">Base Salary</th>
                  <th className="px-6 py-3.5">Allowances</th>
                  <th className="px-6 py-3.5">Deductions</th>
                  <th className="px-6 py-3.5">Net Salary</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payroll.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.month} {item.year}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
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

export default PayrollPage;
