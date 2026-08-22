import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, Award, FileText, Download } from 'lucide-react';

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

  const latestPay = payroll[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Payroll & Salary Slips</h2>
        <p className="text-sm text-slate-500 font-medium">Review monthly salary breakdowns, allowances, deductions, and payment records</p>
      </div>

      {latestPay && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Latest Issued Statement • {latestPay.month} {latestPay.year}
            </span>
            <h3 className="text-3xl font-black text-white">
              ${latestPay.netSalary?.toLocaleString()}
            </h3>
            <p className="text-xs text-purple-200">
              Base: ${latestPay.baseSalary?.toLocaleString()} | Allowances: +${latestPay.allowances?.toLocaleString()} | Deductions: -${latestPay.deductions?.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <StatusBadge status={latestPay.status} />
          </div>
        </div>
      )}

      {/* Salary Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600" /> Salary Statements History
        </div>

        {payroll.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No payroll statements generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pay Period</th>
                  <th className="px-6 py-4">Base Salary</th>
                  <th className="px-6 py-4">Allowances</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Net Salary</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payroll.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {item.month} {item.year}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      ${item.baseSalary ? item.baseSalary.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">
                      +${item.allowances ? item.allowances.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 text-rose-600 font-semibold">
                      -${item.deductions ? item.deductions.toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 text-base">
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
