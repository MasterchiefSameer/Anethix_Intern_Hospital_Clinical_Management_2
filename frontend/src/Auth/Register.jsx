/**
 * Register Component.
 * Contains the Create Account (Register) Form logic, state,
 * API submission with window.localStorage fallback for test & deployment purposes.
 */
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const Register = ({ onError, onSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPath = location.state?.from?.pathname || '/dashboard';
    const { login } = useAuth();

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: 'male',
        dob: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        if (onError) onError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (onError) onError('');

        if (registerData.password.length < 6) {
            toast.error('Password too short', {
                description: 'Password must be at least 6 characters long.',
            });
            setLoading(false);
            return;
        }

        // =========================================================================
        // NOTE: This is for local storage (test / deployment purpose)
        // Helper function to persist registered users and session in window.localStorage
        // =========================================================================
        const saveToLocalStorage = (userData) => {
            try {
                // Retrieve existing registered users from window.localStorage
                const existingUsers = JSON.parse(
                    window.localStorage.getItem('medtrust_registered_users') || '[]'
                );

                // Check if the email already exists in local storage
                const exists = existingUsers.some(
                    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
                );

                if (!exists) {
                    existingUsers.push(userData);
                    // Store updated users list into window.localStorage
                    window.localStorage.setItem(
                        'medtrust_registered_users',
                        JSON.stringify(existingUsers)
                    );
                }

                // Persist current logged-in user in window.localStorage
                window.localStorage.setItem('medtrust_user', JSON.stringify(userData));
            } catch (storageErr) {
                console.warn('LocalStorage save error:', storageErr);
            }
        };

        try {
            // Attempt backend API registration first
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/register',
                {
                    name: registerData.name,
                    email: registerData.email,
                    phone: registerData.phone,
                    password: registerData.password,
                    gender: registerData.gender,
                    dob: registerData.dob,
                },
                { withCredentials: true }
            );

            // Update Auth Context & save to window.localStorage
            login(data);
            saveToLocalStorage(data);

            toast.success(`Welcome to MedTrust, ${data.name}!`, {
                description: 'Your patient account has been created successfully.',
            });
            if (onSuccess) onSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                navigate(fromPath, { replace: true });
            }, 1000);
        } catch (err) {
            // =========================================================================
            // NOTE: LocalStorage Fallback for Testing / Offline Deployment
            // If the live backend is unavailable or deployment has no connected DB,
            // we save the account directly into window.localStorage so test registration works.
            // =========================================================================
            const localUser = {
                _id: 'user_' + Date.now(),
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                phone: registerData.phone,
                gender: registerData.gender,
                dob: registerData.dob,
                role: 'patient',
            };

            // Save user to window.localStorage and update context
            saveToLocalStorage(localUser);
            login(localUser);

            toast.success(`Welcome to MedTrust, ${localUser.name}!`, {
                description: 'Account created (Local Storage Mode). Redirecting...',
            });
            if (onSuccess) onSuccess('Account created successfully (Local Storage Mode)! Redirecting...');
            setTimeout(() => {
                navigate(fromPath, { replace: true });
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                            type="text"
                            name="name"
                            required
                            value={registerData.name}
                            onChange={handleChange}
                            placeholder="e.g. Ramesh Sharma"
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        />
                    </div>
                </div>

                {/* Email & Phone (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                            Email *
                        </label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={registerData.email}
                                onChange={handleChange}
                                placeholder="name@email.com"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                            Phone (+91)
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={registerData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Gender & DOB (Grid) */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={registerData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={registerData.dob}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                        Create Password *
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={registerData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Submit Register Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-70 mt-2"
                >
                    <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                    {!loading && <ArrowRight size={16} />}
                </button>
            </form>
        </div>
    );
};

export default Register;
