/**
 * Receptionist Profile Page Component.
 * Enforces strict read-only administrative fields (Employee ID, Desk Number, Shift Timings, Hospital Email)
 * and allows Receptionist to edit Personal Email, Phone, Address, Emergency Contact, and Security Password.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    User,
    Mail,
    Phone,
    BadgeCheck,
    Clock,
    Building,
    ShieldCheck,
    Save,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Lock,
    Eye,
    EyeOff,
    LayoutDashboard,
    RefreshCw,
    MapPin,
    PhoneCall,
    Languages,
    LockKeyhole,
    Calendar
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReceptionistProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Password change state
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordText, setShowPasswordText] = useState(false);

    // Profile form state
    const [profile, setProfile] = useState({
        name: '',
        email: '',               // Official Hospital Login Email (Read-only)
        personalEmail: '',       // Personal Alternate Email (Editable)
        phone: '',
        gender: 'Female',
        employeeId: 'REC-2024-002', // Administrative (Read-only)
        deskNumber: 'Front Desk #1 - Main OPD Registration', // Administrative (Read-only)
        shiftTimings: 'Morning Shift (08:00 AM - 04:00 PM)', // Administrative (Read-only)
        dateOfJoining: '',
        languages: 'Hindi, English',
        emergencyContact: '',
        address: '',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '',
    });

    // Fetch Receptionist Profile from MongoDB API
    const fetchReceptionistProfile = useCallback(async () => {
        if (!user) return;
        setFetching(true);
        try {
            const token = user?.token || user?.rest?.token;
            const targetId = user?._id || user?.rest?._id;

            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const endpoint = targetId
                ? `${import.meta.env.VITE_API_URL}/api/user/profile/${targetId}`
                : `${import.meta.env.VITE_API_URL}/api/user/profile`;

            const { data } = await axios.get(endpoint, config);

            if (data) {
                setProfile({
                    name: data.name || user.name || '',
                    email: data.hospitalEmail || data.email || user.email || '',
                    personalEmail: data.personalEmail || '',
                    phone: data.phone || user.phone || '',
                    gender: data.gender || user.gender || 'Female',
                    employeeId: data.employeeId || 'REC-2024-001',
                    deskNumber: data.deskNumber || 'Front Desk #1 - Main OPD Registration',
                    shiftTimings: data.shiftTimings || 'Morning Shift (08:00 AM - 04:00 PM)',
                    dateOfJoining: data.dateOfJoining || data.createdAt || '',
                    languages: data.languages || 'Hindi, English',
                    emergencyContact: data.emergencyContact || '',
                    address: data.address || '',
                    city: data.city || 'New Delhi',
                    state: data.state || 'Delhi',
                    pincode: data.pincode || '',
                });
            }
        } catch (err) {
            console.warn('Could not fetch Receptionist Profile from API:', err);
            if (user) {
                setProfile((prev) => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                }));
            }
        } finally {
            setFetching(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchReceptionistProfile();
        }
    }, [fetchReceptionistProfile, user]);

    // Automatically clear status message banner after 3 seconds
    useEffect(() => {
        if (!statusMessage.text) return;
        const timer = setTimeout(() => {
            setStatusMessage({ type: '', text: '' });
        }, 3000);
        return () => clearTimeout(timer);
    }, [statusMessage]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setStatusMessage({ type: '', text: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        // Validate personal email format if entered
        if (profile.personalEmail && !/\S+@\S+\.\S+/.test(profile.personalEmail)) {
            toast.error('Invalid Email', { description: 'Please enter a valid personal email address.' });
            setLoading(false);
            return;
        }

        // Validate password change
        if (showPasswordChange && newPassword) {
            if (newPassword.length < 6) {
                toast.error('Password too short', { description: 'Password must be at least 6 characters.' });
                setLoading(false);
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error('Passwords do not match', { description: 'Please ensure both passwords match.' });
                setLoading(false);
                return;
            }
        }

        try {
            const token = user?.token || user?.rest?.token;
            const targetId = user?._id || user?.rest?._id;

            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const endpoint = targetId
                ? `${import.meta.env.VITE_API_URL}/api/user/profile/${targetId}`
                : `${import.meta.env.VITE_API_URL}/api/user/profile`;

            // Only send editable fields (admin fields like employeeId, deskNumber are protected on backend)
            const payload = {
                name: profile.name,
                personalEmail: profile.personalEmail,
                phone: profile.phone,
                gender: profile.gender,
                languages: profile.languages,
                emergencyContact: profile.emergencyContact,
                address: profile.address,
                city: profile.city,
                state: profile.state,
                pincode: profile.pincode,
                ...(showPasswordChange && newPassword ? { password: newPassword } : {}),
            };

            const { data } = await axios.put(endpoint, payload, config);

            // Update AuthContext session & localStorage
            const mergedUser = { ...user, ...data, token: token || data.token };
            login(mergedUser);
            window.localStorage.setItem('medtrust_user', JSON.stringify(mergedUser));

            setIsEditing(false);
            setShowPasswordChange(false);
            setNewPassword('');
            setConfirmPassword('');

            toast.success('Profile Saved Successfully', {
                description: 'Your contact details and personal records are updated in MongoDB.',
            });
            setStatusMessage({
                type: 'success',
                text: '✓ Receptionist profile updated successfully!',
            });
        } catch (err) {
            console.error('Receptionist profile update error:', err);
            const errorMsg =
                err.response?.data?.message || err.message || 'Failed to update profile';
            toast.error('Update Failed', { description: errorMsg });
            setStatusMessage({
                type: 'error',
                text: `Database Update Failed: ${errorMsg}`,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex items-center justify-center p-6 text-center">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
                    <Building size={48} className="text-[#00478d] dark:text-blue-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Receptionist Portal Access
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Please log in with your verified Receptionist staff account.
                    </p>
                    <button
                        onClick={() => navigate('/staff/login')}
                        className="w-full bg-[#00478d] dark:bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-[#003870] transition-colors text-sm"
                    >
                        Go to Staff Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-3 px-3 font-sans antialiased transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-3xl shadow-sm">
                                <Building size={36} />
                            </div>
                            <span className="absolute -bottom-2 -right-2 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-md border-2 border-white dark:border-slate-900">
                                FRONT DESK
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {profile.name || 'Receptionist Staff'}
                                </h1>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                    Operational Staff
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-slate-600 dark:text-slate-300">{profile.email}</span>
                                <span>•</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <BadgeCheck size={13} className="text-[#00478d]" />
                                    Emp ID: {profile.employeeId}
                                </span>
                                <span>•</span>
                                <span className="text-[#006a63] dark:text-emerald-400 font-semibold">
                                    {profile.deskNumber}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            onClick={fetchReceptionistProfile}
                            disabled={fetching}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Refresh from Database"
                        >
                            <RefreshCw size={15} className={fetching ? 'animate-spin' : ''} />
                        </button>

                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setShowPasswordChange(false);
                                    }}
                                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
                                >
                                    <Save size={15} />
                                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/appointments')}
                                    className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                                >
                                    <LayoutDashboard size={15} className="text-[#00478d] dark:text-blue-400" />
                                    <span>Live OPD Queue</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all"
                                >
                                    <Edit3 size={15} />
                                    <span>Edit Contact Info</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage.text && (
                    <div
                        className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${
                            statusMessage.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}
                    >
                        {statusMessage.type === 'success' ? (
                            <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : (
                            <AlertCircle size={18} className="text-red-500" />
                        )}
                        <span>{statusMessage.text}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    {/* 1. Official Hospital Assignment (Strictly Read-Only / Admin Managed) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-6 flex-wrap gap-2">
                            <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg">
                                <Building size={22} className="text-amber-500" />
                                <h2>Official Hospital Assignment</h2>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                <LockKeyhole size={12} className="text-amber-500" />
                                <span>Locked (Managed by Super Admin)</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Employee ID (Read-Only) */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Staff Employee ID</span>
                                    <Lock size={12} className="text-slate-400" />
                                </label>
                                <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {profile.employeeId}
                                </div>
                            </div>

                            {/* Assigned Desk / Counter (Read-Only) */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Assigned Desk / Counter</span>
                                    <Lock size={12} className="text-slate-400" />
                                </label>
                                <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {profile.deskNumber}
                                </div>
                            </div>

                            {/* Shift Timings (Read-Only) */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Assigned Shift</span>
                                    <Lock size={12} className="text-slate-400" />
                                </label>
                                <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {profile.shiftTimings}
                                </div>
                            </div>

                            {/* Official Hospital Email (Login ID - Read-Only) */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                                    <span>Official Login Hospital Email</span>
                                    <Lock size={12} className="text-slate-400" />
                                </label>
                                <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {profile.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Personal & Contact Information (Editable) */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <User size={22} />
                            <h2>Personal & Contact Information</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Full Name *
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.name}
                                    </div>
                                )}
                            </div>

                            {/* Personal Alternate Email */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Personal Email (Alternate)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="personalEmail"
                                        value={profile.personalEmail}
                                        onChange={handleChange}
                                        placeholder="receptionist.personal@gmail.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.personalEmail || 'No personal email added'}
                                    </div>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Phone Number (+91)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.phone || 'Not recorded'}
                                    </div>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Gender
                                </label>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={profile.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.gender}
                                    </div>
                                )}
                            </div>

                            {/* Languages */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Languages Spoken
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="languages"
                                        value={profile.languages}
                                        onChange={handleChange}
                                        placeholder="e.g. Hindi, English, Punjabi"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.languages}
                                    </div>
                                )}
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Emergency Contact Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={profile.emergencyContact}
                                        onChange={handleChange}
                                        placeholder="e.g. 9811122334 (Guardian/Family)"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.emergencyContact || 'Not set'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Residential Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        placeholder="e.g. House No. 24, Near City Mall"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.address || 'No address provided'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    City
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="city"
                                        value={profile.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200">
                                        {profile.city}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    State
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="state"
                                        value={profile.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200">
                                        {profile.state}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Pincode
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={profile.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200">
                                        {profile.pincode || 'Not set'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Optional Password Change in Edit Mode */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <Lock size={16} className="text-[#00478d] dark:text-blue-400" />
                                            Update Security Password
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Change your password from temporary to a secure personal password
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                                        className="text-xs font-semibold text-[#00478d] dark:text-blue-400 hover:underline"
                                    >
                                        {showPasswordChange ? 'Cancel Password Change' : '+ Change Password'}
                                    </button>
                                </div>

                                {showPasswordChange && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                New Password *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswordText ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordText(!showPasswordText)}
                                                    className="absolute right-2.5 top-2.5 text-slate-400"
                                                >
                                                    {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                                Confirm New Password *
                                            </label>
                                            <input
                                                type={showPasswordText ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReceptionistProfile;
