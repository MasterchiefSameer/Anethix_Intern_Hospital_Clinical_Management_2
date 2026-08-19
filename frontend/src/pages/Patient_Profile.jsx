/**
 * Patient Profile Page Component.
 * Displays patient details, Registration Date, Blood Group, Address,
 * Languages, and Emergency Contact with full edit and save functionality.
 */
import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    HeartPulse,
    MapPin,
    Globe,
    ShieldCheck,
    Save,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Activity,
    Clock,
    PhoneCall
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientProfile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Profile form state
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        dob: '',
        bloodGroup: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        languages: 'Hindi, English',
        emergencyContact: '',
        createdAt: '',
    });
    console.log(profile);

    // Populate profile from current user or fetch from backend API
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?._id) return;
            try {
                const token = user?.token;
                const config = {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                };

                const { data } = await axios.get(
                    `http://localhost:5000/api/user/profile/${user._id}`,
                    config
                );
                if (data) {
                    setProfile({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        gender: data.gender || 'Male',
                        dob: data.dob ? data.dob.split('T')[0] : '',
                        bloodGroup: data.bloodGroup || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        pincode: data.pincode || '',
                        languages: data.languages || 'Hindi, English',
                        emergencyContact: data.emergencyContact || '',
                        createdAt: data.createdAt || new Date().toISOString(),
                    });
                }
            } catch (err) {
                console.warn('Could not fetch latest profile from backend, using local state:', err);
                // Fallback to AuthContext / localStorage user
                if (user) {
                    setProfile({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        gender: user.gender || 'Male',
                        dob: user.dob ? user.dob.split('T')[0] : '',
                        bloodGroup: user.bloodGroup || '',
                        address: user.address || '',
                        city: user.city || '',
                        state: user.state || '',
                        pincode: user.pincode || '',
                        languages: user.languages || 'Hindi, English',
                        emergencyContact: user.emergencyContact || '',
                        createdAt: user.createdAt || new Date().toISOString(),
                    });
                }
            }
        };

        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        setStatusMessage({ type: '', text: '' });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        try {
            const targetId = user?._id || '';
            const token = user?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            // 1. Send update request to Backend API (Saves directly to MongoDB Database)
            const { data } = await axios.put(
                `http://localhost:5000/api/user/profile/${targetId}`,
                profile,
                config
            );

            // Update AuthContext session & localStorage
            const mergedUser = { ...user, ...data, token: token || data.token };
            login(mergedUser);
            window.localStorage.setItem('medtrust_user', JSON.stringify(mergedUser));

            setIsEditing(false);
            setStatusMessage({
                type: 'success',
                text: '✓ Profile updated and saved to MongoDB database successfully!',
            });
        } catch (err) {
            console.error('Profile update error:', err);
            const errorMsg =
                err.response?.data?.message || err.message || 'Failed to update profile on database';
            setStatusMessage({
                type: 'error',
                text: `Database Update Failed: ${errorMsg}`,
            });
        } finally {
            setLoading(false);
        }
    };

    // Format registration date nicely
    const formatRegisteredDate = (dateString) => {
        if (!dateString) return 'Recently Registered';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return 'Recently Registered';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex items-center justify-center p-6 text-center">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-md w-full">
                    <User size={48} className="text-[#00478d] dark:text-blue-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Please Sign In
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        You must be logged in to view and manage your Patient Medical Profile.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-[#00478d] dark:bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-[#003870] transition-colors text-sm"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 font-sans antialiased transition-colors duration-200">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Top Profile Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-50 dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 flex items-center justify-center text-[#00478d] dark:text-blue-400 font-bold text-3xl shadow-sm">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            {profile.bloodGroup && (
                                <span className="absolute -bottom-2 -right-2 bg-green-600 dark:white text-white text-xs font-extrabold px-2 py-0.5 rounded-lg shadow-md border-2 border-white dark:border-slate-900">
                                    {profile.bloodGroup}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {profile.name || 'Patient Profile'}
                                </h1>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#006a63] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    Verified Patient
                                </span>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                                <span>{profile.email}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-[#00478d] dark:text-blue-400 font-medium">
                                    <Clock size={13} />
                                    Registered on: {formatRegisteredDate(profile.createdAt)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Toggle Button */}
                    <div>
                        {isEditing ? (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
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
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all"
                            >
                                <Edit3 size={15} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Message Notification */}
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

                {/* Profile Form Grid */}
                <form onSubmit={handleSave} className="space-y-8">
                    {/* 1. Essential Health & Blood Group Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <HeartPulse size={22} className="text-red-500" />
                            <h2>Medical & Emergency Details</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Blood Group */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Blood Group * (Rakt Samooh)
                                </label>
                                {isEditing ? (
                                    <select
                                        name="bloodGroup"
                                        value={profile.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="">Select Blood Group...</option>
                                        <option value="A+">A+ (A Positive)</option>
                                        <option value="A-">A- (A Negative)</option>
                                        <option value="B+">B+ (B Positive)</option>
                                        <option value="B-">B- (B Negative)</option>
                                        <option value="AB+">AB+ (AB Positive)</option>
                                        <option value="AB-">AB- (AB Negative)</option>
                                        <option value="O+">O+ (O Positive)</option>
                                        <option value="O-">O- (O Negative)</option>
                                    </select>
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-bold text-green-600 dark:text-red-400 flex items-center justify-between">
                                        <span>{profile.bloodGroup || 'Not specified yet'}</span>
                                        <span className="text-xs text-slate-400 font-normal">
                                            {profile.bloodGroup ? 'Recorded' : 'Click Edit to Add'}
                                        </span>
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {profile.emergencyContact || 'No emergency contact set'}
                                    </div>
                                )}
                            </div>

                            {/* Preferred Languages */}
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.languages || 'Hindi, English'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Personal Information Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <User size={22} />
                            <h2>Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.email}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.phone || 'Not provided'}
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.gender || 'Not specified'}
                                    </div>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Date of Birth
                                </label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        value={profile.dob}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.dob || 'Not provided'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Address & Residential Information Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex items-center gap-2.5 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <MapPin size={22} />
                            <h2>Residential Address (Pata)</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Street Address */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    House / Street Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        placeholder="e.g. H.No 104, Block B, Green Park Extension"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                ) : (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {profile.address || 'No street address saved'}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* City */}
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
                                            placeholder="e.g. New Delhi"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {profile.city || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* State */}
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
                                            placeholder="e.g. Delhi / Maharashtra"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {profile.state || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Pincode */}
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
                                            placeholder="e.g. 110016"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                        />
                                    ) : (
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {profile.pincode || 'Not provided'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
