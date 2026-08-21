/**
 * Staff Unified Login Page Component.
 * Secure portal for Super Admins, Receptionists, and Doctors.
 * Includes First-Time Login temporary password change enforcement.
 */
import React, { useState } from 'react';
import {
    ShieldCheck,
    Stethoscope,
    Lock,
    Mail,
    Eye,
    EyeOff,
    ArrowRight,
    KeyRound,
    AlertCircle,
    CheckCircle2,
    Building2,
    Users,
    Activity
} from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // First Login Password Change State
    const [isFirstLoginState, setIsFirstLoginState] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Role-based redirect helper
    const handleRoleRedirect = (userObj) => {
        const role = userObj.role;
        toast.success(`Welcome, ${userObj.name}!`, {
            description: `Signed in as ${role}`,
        });

        if (role === 'Super Admin') {
            navigate('/admin');
        } else if (role === 'Receptionist') {
            navigate('/admin');
        } else if (role === 'Doctor') {
            navigate('/admin/appointments');
        } else {
            navigate('/dashboard');
        }
    };

    // 1. Handle Staff Login Submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/staff/login',
                { email, password },
                { withCredentials: true }
            );

            // Check if this is the first login requiring a password change
            if (data.mustChangePassword || data.isFirstLogin) {
                setTempUserData(data);
                setIsFirstLoginState(true);
                toast.info('First-Time Login Security Notice', {
                    description: 'You must set a new personal password before accessing the hospital portal.',
                });
            } else {
                // Update Context and proceed
                login(data);
                window.localStorage.setItem('medtrust_user', JSON.stringify(data));
                handleRoleRedirect(data);
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                'Invalid staff credentials. Please check your email and password.';
            setErrorMessage(msg);
            toast.error('Staff Authentication Failed', { description: msg });
        } finally {
            setLoading(false);
        }
    };

    // 2. Handle First-Time Login Password Change
    const handleFirstPasswordChangeSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters long.');
            toast.error('Password too short', { description: 'At least 6 characters required.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match. Please verify.');
            toast.error('Mismatch', { description: 'New password and confirmation do not match.' });
            return;
        }

        setChangingPassword(true);

        try {
            const token = tempUserData?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/auth/first-login-password',
                { newPassword },
                config
            );

            toast.success('Password Changed Successfully!', {
                description: 'Your staff account is now secured.',
            });

            // Merge updated data & authenticate
            const fullUserData = { ...tempUserData, ...data, isFirstLogin: false };
            login(fullUserData);
            window.localStorage.setItem('medtrust_user', JSON.stringify(fullUserData));

            handleRoleRedirect(fullUserData);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update password. Please try again.';
            setErrorMessage(msg);
            toast.error('Password Update Failed', { description: msg });
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                {/* Header Branding */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <Stethoscope size={22} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">
                            MedTrust <span className="text-blue-400">Enterprise</span>
                        </span>
                    </Link>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-xs font-semibold text-blue-300">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>Hospital Staff & Provider Portal</span>
                    </div>
                </div>

                {/* Main Card Container */}
                <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative">
                    {/* Security Notice / Error Alert */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-200 flex items-start gap-3">
                            <AlertCircle size={17} className="text-rose-400 flex-shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* VIEW 1: Standard Staff Login */}
                    {!isFirstLoginState ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Sign In to Hospital Portal
                                </h2>
                                <p className="text-slate-400 text-xs mt-1">
                                    Authorized access for Doctors, Receptionists, and Super Admins.
                                </p>
                            </div>

                            {/* Role Badge Indicator Pills */}
                            <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col items-center gap-1">
                                    <Activity size={16} className="text-blue-400" />
                                    <span className="text-[11px] font-semibold text-slate-300">Doctors</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col items-center gap-1">
                                    <Users size={16} className="text-emerald-400" />
                                    <span className="text-[11px] font-semibold text-slate-300">Reception</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col items-center gap-1">
                                    <Building2 size={16} className="text-purple-400" />
                                    <span className="text-[11px] font-semibold text-slate-300">Super Admin</span>
                                </div>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Staff Official Email *
                                    </label>
                                    <div className="relative">
                                        <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@medtrust.org or doctor@medtrust.org"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 mt-2"
                                >
                                    <span>{loading ? 'Authenticating Staff...' : 'Sign In to Staff Console'}</span>
                                    {!loading && <ArrowRight size={17} />}
                                </button>
                            </form>

                            {/* Demo Credentials Tip for Super Admin */}
                            <div className="mt-6 p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl text-[11px] text-blue-200">
                                <span className="font-bold text-blue-300">Initial Super Admin Credentials:</span><br />
                                <span>Email: <code className="bg-slate-950 px-1 py-0.5 rounded text-blue-400">admin@medtrust.org</code></span> |
                                <span> Pass: <code className="bg-slate-950 px-1 py-0.5 rounded text-blue-400">Admin@12345</code></span>
                            </div>
                        </>
                    ) : (
                        /* VIEW 2: Forced First-Time Password Change */
                        <>
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                                    <KeyRound size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Set Your Personal Password
                                </h2>
                                <p className="text-slate-400 text-xs mt-1">
                                    Welcome, <strong className="text-slate-200">{tempUserData?.name}</strong>. Since this is your first time logging in with a temporary password, you must create a new secure password.
                                </p>
                            </div>

                            <form onSubmit={handleFirstPasswordChangeSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        New Secure Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-500" />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Confirm New Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-500" />
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter your new password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 mt-2"
                                >
                                    <span>{changingPassword ? 'Securing Account...' : 'Set Password & Enter Portal'}</span>
                                    {!changingPassword && <CheckCircle2 size={17} />}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Bottom Back to Patient Login */}
                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500">
                            Are you a Patient?{' '}
                            <Link to="/login" className="text-blue-400 hover:underline font-semibold">
                                Go to Patient Portal
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
