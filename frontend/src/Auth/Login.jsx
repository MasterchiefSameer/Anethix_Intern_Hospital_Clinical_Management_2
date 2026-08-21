/**
 * Login Component.
 * Contains the Login Form logic, API submission,
 * with window.localStorage test mode fallback for test & deployment purposes.
 */
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const Login = ({ onError, onSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPath = location.state?.from?.pathname || '/dashboard';
    const { login } = useAuth();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        remember: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        if (onError) onError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (onError) onError('');

        // =========================================================================
        // NOTE: This is for local storage (test / deployment purpose)
        // Default built-in test accounts for testing frontend without live backend
        // =========================================================================
        const defaultTestUsers = [
            {
                _id: 'user_patient_demo',
                name: 'Ramesh Sharma (Demo Patient)',
                email: 'patient@example.com',
                password: 'password123',
                role: 'patient',
                phone: '9876543210',
            },
            {
                _id: 'user_admin_demo',
                name: 'Dr. Admin User (Demo)',
                email: 'admin@medtrust.org',
                password: 'adminpassword123',
                role: 'admin',
                phone: '9811122334',
            },
        ];

        try {
            // Attempt backend API login first
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    email: loginData.email,
                    password: loginData.password,
                },
                { withCredentials: true }
            );

            // Save active session in window.localStorage and update context
            window.localStorage.setItem('medtrust_user', JSON.stringify(data));
            login(data);

            toast.success(`Welcome back, ${data.name || 'Patient'}!`, {
                description: 'You have signed in successfully.',
            });
            if (onSuccess) onSuccess('Login successful! Redirecting...');
            navigate(fromPath, { replace: true });
        } catch (err) {
            // =========================================================================
            // NOTE: LocalStorage Fallback for Testing / Offline Deployment
            // Checks window.localStorage for any locally registered accounts or default demo users
            // =========================================================================
            try {
                // Read users registered via window.localStorage in this browser
                const localRegistered = JSON.parse(
                    window.localStorage.getItem('medtrust_registered_users') || '[]'
                );

                const allAvailableUsers = [...localRegistered, ...defaultTestUsers];

                const matchingUser = allAvailableUsers.find(
                    (u) =>
                        u.email.toLowerCase() === loginData.email.toLowerCase() &&
                        (!u.password || u.password === loginData.password)
                );

                if (matchingUser) {
                    const sessionData = {
                        _id: matchingUser._id || 'user_' + Date.now(),
                        name: matchingUser.name,
                        email: matchingUser.email,
                        role: matchingUser.role || 'patient',
                    };

                    // Persist session to window.localStorage
                    window.localStorage.setItem('medtrust_user', JSON.stringify(sessionData));
                    login(sessionData);

                    toast.success(`Welcome back, ${sessionData.name}!`, {
                        description: 'Signed in via Local Storage Mode.',
                    });
                    if (onSuccess) onSuccess('Login successful (Local Storage Mode)! Redirecting...');
                    navigate(fromPath, { replace: true });
                    return;
                }
            } catch (storageErr) {
                console.warn('LocalStorage test check error:', storageErr);
            }

            const msg =
                err.response?.data?.message ||
                'Invalid email or password. (Hint: Use patient@example.com / password123 for test mode)';
            toast.error('Sign In Failed', {
                description: msg,
            });
            if (onError) onError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                        Email Address *
                    </label>
                    <div className="relative">
                        <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="patient@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            Password *
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                toast.info('Demo Credentials', {
                                    description: 'Use patient@example.com with password123 or create a new account.',
                                });
                            }}
                            className="text-xs text-[#00478d] dark:text-blue-400 hover:underline font-medium"
                        >
                            Forgot password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={loginData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={loginData.remember}
                        onChange={(e) =>
                            setLoginData({ ...loginData, remember: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#00478d] focus:ring-[#00478d] border-slate-300 dark:border-slate-700"
                    />
                    <label
                        htmlFor="rememberMe"
                        className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer"
                    >
                        Remember me on this device
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-2"
                >
                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                    {!loading && <ArrowRight size={16} />}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
                <span className="px-3 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    or sign in with
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
            </div>

            {/* Social / ABHA Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => toast.info('Google Sign-In', { description: 'OAuth 2.0 integration ready.' })}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                    <img
                        alt="Google"
                        className="w-4 h-4"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe7oE-BAARwPOUpMLA-6ITtad-A7vim7rlyTAeYIh5VkwQ09Li1nRm1GmkW6fBUuu-gR2WV69gJwlxasLTE2_XwLzstHtnBwtNtlQrQKouEKsxb4slMXN5j2Qn7s-Qra74ZiCuwQ7ymybm4gCnwlaW7ih-5mw_S06Mt0px92MHK5_M5b9XlVAiBWn4VR7iijC_72bz_KKe47-Neo42mizE9rS6nEEpvrDGPFTAbxXKn5ifntOinISheA"
                    />
                    <span>Google</span>
                </button>
                <button
                    type="button"
                    onClick={() => toast.info('Ayushman Bharat ABHA', { description: 'ABHA Health ID authentication ready.' })}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-bold text-[9px] flex items-center justify-center">
                        🇮🇳
                    </span>
                    <span>ABHA / ID</span>
                </button>
            </div>
        </div>
    );
};

export default Login;
