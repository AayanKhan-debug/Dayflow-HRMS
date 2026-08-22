import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { User, Phone, MapPin, Building2, Briefcase, Lock, CheckCircle2, AlertCircle, Save, Camera, Shield, Mail } from 'lucide-react';

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
      setMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-sm text-slate-500 font-medium">Manage your personal profile and contact preferences</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Profile Overview Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center space-y-4 flex flex-col items-center">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-xs font-semibold text-slate-500">{user?.designation}</p>
          </div>

          <div className="w-full pt-2 space-y-2 border-t border-slate-100 text-left text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-400">Department</span>
              <span className="font-bold text-slate-800">{user?.department}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-400">Role Privilege</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-400">Email</span>
              <span className="font-bold text-slate-800 truncate max-w-[140px]">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Right Details & Edit Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Read-Only Employment System Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  Employment Records (System Managed)
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                Admin Locked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase">Department</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.department}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase">Designation</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.designation}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase">System Role</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.role}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase">Base Compensation</span>
                <p className="font-extrabold text-emerald-700 text-sm mt-0.5">
                  ${user?.baseSalary ? user.baseSalary.toLocaleString() : '50,000'} / year
                </p>
              </div>
            </div>
          </div>

          {/* Editable Contact Profile Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Editable Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="742 Evergreen Terrace, Springfield"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
