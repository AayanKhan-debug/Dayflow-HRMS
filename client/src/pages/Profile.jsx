import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { User, Phone, MapPin, Building2, Briefcase, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUserState } = useContext(AuthContext);

  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const res = await API.put('/employees/me', {
        phone,
        address,
        profilePicture
      });

      updateUserState(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-sm text-slate-500">Manage your personal information and contact details</p>
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

      {/* Read-Only System Information Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-4 h-4 text-slate-400" />
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Employment Details (System Managed)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Full Name</span>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">{user?.email}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Role</span>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                {user?.role}
              </span>
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Department</span>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">{user?.department}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Designation</span>
            <p className="font-semibold text-slate-800 text-sm mt-0.5">{user?.designation}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Base Salary</span>
            <p className="font-semibold text-emerald-700 text-sm mt-0.5">
              ${user?.baseSalary ? user.baseSalary.toLocaleString() : '50,000'} / year
            </p>
          </div>
        </div>
      </div>

      {/* Editable Contact Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-sky-600" />
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Editable Contact Information
          </h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Residential Address
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street, Suite 400..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Profile Picture URL
          </label>
          <input
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
