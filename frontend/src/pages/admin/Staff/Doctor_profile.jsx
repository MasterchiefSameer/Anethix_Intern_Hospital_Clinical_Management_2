/**
 * Doctor Profile Page Component.
 * Allows Doctors to view and edit their Medical Registration Number,
 * Specialty, Qualifications, Experience, Consultation Fees (₹),
 * Available Days, Consultation Time Slots, and Biography in MongoDB.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    User,
    Mail,
    Phone,
    Award,
    Stethoscope,
    IndianRupee,
    Clock,
    Calendar,
    FileText,
    ShieldCheck,
    Save,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Activity,
    Lock,
    Eye,
    EyeOff,
    LayoutDashboard,
    RefreshCw,
    MapPin,
    Check
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SPECIALTIES = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Neurologist',
    'Gynecologist',
    'ENT Specialist',
    'Ophthalmologist',
    'Psychiatrist',
    'Dentist',
    'Oncologist'
];

const DoctorProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Password change toggle
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordText, setShowPasswordText] = useState(false);

    // Profile form state
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        licenseNumber: 'MCI-84920',
        qualifications: 'MBBS, MD',
        specialty: '',
        experience: 5,
        fees: 500,
        timeSlots: '09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        about: '',
        address: '',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '',
    });

    // Fetch Doctor Profile from MongoDB API
    const fetchDoctorProfile = useCallback(async () => {
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
                ? `http://localhost:5000/api/user/profile/${targetId}`
                : 'http://localhost:5000/api/user/profile';

            const { data } = await axios.get(endpoint, config);

            if (data) {
                const doc = data.doctorProfile || {};
                setProfile({
                    name: data.name || user.name || '',
                    email: data.email || user.email || '',
                    phone: data.phone || user.phone || doc.phone || '',
                    gender: data.gender || user.gender || 'Male',
                    licenseNumber: doc.licenseNumber || data.licenseNumber || 'MCI-84920',
                    qualifications: doc.qualifications || data.qualifications || 'MBBS, MD',
                    specialty: doc.specialty || data.specialty || '',
                    experience: doc.experience !== undefined ? doc.experience : 5,
                    fees: doc.fees !== undefined ? doc.fees : 500,
                    timeSlots: doc.timeSlots || '09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
                    availableDays: doc.availableDays && doc.availableDays.length > 0
                        ? doc.availableDays
                        : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    about: doc.about || data.about || '',
                    address: data.address || '',
                    city: data.city || 'New Delhi',
                    state: data.state || 'Delhi',
                    pincode: data.pincode || '',
                });
            }
        } catch (err) {
            console.warn('Could not fetch Doctor Profile from API:', err);
            // Fallback from session user
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
            fetchDoctorProfile();
        }
    }, [fetchDoctorProfile, user]);

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

    // Toggle available day selection
    const toggleDay = (day) => {
        if (!isEditing) return;
        setProfile((prev) => {
            const exists = prev.availableDays.includes(day);
            const updated = exists
                ? prev.availableDays.filter((d) => d !== day)
                : [...prev.availableDays, day];
            return { ...prev, availableDays: updated };
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        // Validate password change if provided
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
                ? `http://localhost:5000/api/user/profile/${targetId}`
                : 'http://localhost:5000/api/user/profile';

            const payload = {
                ...profile,
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

            toast.success('Doctor Profile Updated', {
                description: 'Your medical details, schedule, and fees are synced to MongoDB.',
            });
            setStatusMessage({
                type: 'success',
                text: '✓ Doctor profile and consultation schedule updated successfully!',
            });
        } catch (err) {
            console.error('Doctor profile update error:', err);
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
                    <Stethoscope size={48} className="text-[#00478d] dark:text-blue-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Doctor Portal Access
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Please log in with your verified Doctor credentials to manage your clinic profile.
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
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 font-sans antialiased transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border-2 border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-[#006a63] dark:text-cyan-400 font-bold text-3xl shadow-sm">
                                <Stethoscope size={36} />
                            </div>
                            <span className="absolute -bottom-2 -right-2 bg-[#006a63] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-md border-2 border-white dark:border-slate-900">
                                MD / DOCTOR
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {profile.name.startsWith('Dr.') ? profile.name : `Dr. ${profile.name}`}
                                </h1>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/60 text-[#006a63] dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                                    {profile.specialty}
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                                <span>{profile.email}</span>
                                <span>•</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <Award size={13} className="text-amber-500" />
                                    Reg No: {profile.licenseNumber}
                                </span>
                                <span>•</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    Fee: ₹{profile.fees}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                            type="button"
                            onClick={fetchDoctorProfile}
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
                                    <span>{loading ? 'Saving...' : 'Save Schedule'}</span>
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
                                    <span>My Appointments</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all"
                                >
                                    <Edit3 size={15} />
                                    <span>Edit Doctor Profile</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {statusMessage.text && (
                    <div
                        className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all ${statusMessage.type === 'success'
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
                    {/* 1. Clinical Practice & Availability Schedule */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#006a63] dark:text-cyan-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Clock size={22} />
                            <h2>OPD Schedule & Consultation Availability</h2>
                        </div>

                        {/* Available Days Selector */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                                Available OPD Days {isEditing ? '(Click to Toggle)' : ''}
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {ALL_DAYS.map((day) => {
                                    const isSelected = profile.availableDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            disabled={!isEditing}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${isSelected
                                                    ? 'bg-[#006a63] text-white shadow-sm ring-2 ring-[#006a63]/20'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 opacity-60'
                                                } ${isEditing ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}`}
                                        >
                                            {isSelected && <Check size={14} />}
                                            <span>{day}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Consultation Fee */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Consultation Fee (₹ INR) *
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <IndianRupee size={16} className="absolute left-3.5 top-3 text-slate-400" />
                                        <input
                                            type="number"
                                            name="fees"
                                            required
                                            value={profile.fees}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#006a63] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <IndianRupee size={15} />
                                        <span>{profile.fees} per Consultation</span>
                                    </div>
                                )}
                            </div>

                            {/* Time Slots */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    OPD Timings / Consultation Slots
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="timeSlots"
                                        value={profile.timeSlots}
                                        onChange={handleChange}
                                        placeholder="e.g. 09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#006a63] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.timeSlots}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Medical Credentials & Specialty */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <Award size={22} className="text-amber-500" />
                            <h2>Medical Credentials & Experience</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Specialty */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Specialty / Department *
                                </label>
                                {isEditing ? (
                                    <select
                                        name="specialty"
                                        value={profile.specialty}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        {SPECIALTIES.map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.specialty}
                                    </div>
                                )}
                            </div>

                            {/* Medical License */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Medical Council Registration No. *
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={profile.licenseNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. MCI-REG-84920"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.licenseNumber}
                                    </div>
                                )}
                            </div>

                            {/* Qualifications */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Qualifications & Degrees
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="qualifications"
                                        value={profile.qualifications}
                                        onChange={handleChange}
                                        placeholder="e.g. MBBS, MD (Medicine), DM (Cardio)"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.qualifications}
                                    </div>
                                )}
                            </div>

                            {/* Experience (Years) */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Years of Experience
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="experience"
                                        value={profile.experience}
                                        onChange={handleChange}
                                        min="0"
                                        max="60"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.experience} Years
                                    </div>
                                )}
                            </div>

                            {/* About / Bio */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Doctor Biography / Clinical Background
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="about"
                                        rows={3}
                                        value={profile.about}
                                        onChange={handleChange}
                                        placeholder="Enter doctor's clinical achievements, hospital affiliations, and specialties..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                        {profile.about || 'Senior Consultant with extensive clinical experience in patient diagnostics and treatment protocols.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Personal & Contact Details */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <User size={22} />
                            <h2>Doctor Personal & Contact Info</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Doctor Name
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

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Hospital Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Direct Phone / Extension
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
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.phone || 'Extension not assigned'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Optional Password Change Accordion in Edit Mode */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <Lock size={16} className="text-[#00478d] dark:text-blue-400" />
                                            Update Security Password
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Set a new secure password for your Doctor Staff Account
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

export default DoctorProfile;
