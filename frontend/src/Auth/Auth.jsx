/**
 * Authentication Wrapper Component.
 * Integrates Login.jsx and Register.jsx with a split-screen layout
 * and smooth animated sliding carousel transitions between forms.
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import Login from './Login';
import Register from './Register';

const Auth = ({ initialMode = 'login' }) => {
    const location = useLocation();

    // Mode: 'login' or 'register'
    const [mode, setMode] = useState(
        location.pathname === '/register' || initialMode === 'register' ? 'register' : 'login'
    );

    // Sync mode with route if user navigates
    useEffect(() => {
        if (location.pathname === '/register') {
            setMode('register');
        } else if (location.pathname === '/login') {
            setMode('login');
        }
    }, [location.pathname]);

    // UI Feedback States
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Auto-clear feedback messages after 4 seconds
    useEffect(() => {
        if (!error && !successMessage) return;
        const timer = setTimeout(() => {
            setError('');
            setSuccessMessage('');
        }, 4000);
        return () => clearTimeout(timer);
    }, [error, successMessage]);

    const isRegister = mode === 'register';

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
            {/* Left Side: Hospital Branding / Visual (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden select-none">
                <img
                    alt="Serene Hospital Interior"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80"
                    onError={(e) => {
                        e.currentTarget.src =
                            "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1400&q=80";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003870] via-[#00478d]/75 to-transparent" />

                {/* Left Side Branding Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full text-white">
                    {/* Top Logo */}
                    <Link to="/" className="inline-flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm">
                            <Stethoscope size={22} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            MedTrust Portal
                        </span>
                    </Link>

                    {/* Bottom Headline */}
                    <div className="mb-6 max-w-lg">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/20 mb-4">
                            <ShieldCheck size={14} className="text-emerald-300" />
                            <span>NABH & HIPAA Compliant Healthcare Portal</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                            Your Health Records & Doctors, All in One Place.
                        </h1>
                        <p className="text-blue-100/90 text-base leading-relaxed mb-6">
                            Access real-time OPD appointments, consult top AIIMS specialists, view lab reports,
                            and manage your family's health profile seamlessly.
                        </p>
                        <div className="flex items-center gap-6 text-xs text-blue-200 font-medium">
                            <span>✓ 100% Data Privacy</span>
                            <span>✓ Instant OPD Booking</span>
                            <span>✓ 24x7 Seva</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 md:p-12">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden transition-all">
                    {/* Mobile Branding */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-[#00478d] dark:bg-blue-600 flex items-center justify-center text-white">
                            <Stethoscope size={18} />
                        </div>
                        <span className="text-xl font-bold text-[#00478d] dark:text-blue-400">
                            MedTrust
                        </span>
                    </div>

                    {/* Sliding Mode Tab Bar */}
                    <div className="relative bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 flex">
                        {/* Animated sliding background pill */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-blue-600 rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
                                isRegister ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setMode('login');
                                setError('');
                                setSuccessMessage('');
                            }}
                            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 text-center ${
                                !isRegister
                                    ? 'text-[#00478d] dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode('register');
                                setError('');
                                setSuccessMessage('');
                            }}
                            className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 text-center ${
                                isRegister
                                    ? 'text-[#00478d] dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Header Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {isRegister ? 'Join MedTrust Healthcare' : 'Welcome Back'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {isRegister
                                ? 'Create your patient profile in just a minute'
                                : 'Please enter your details to sign in'}
                        </p>
                    </div>

                    {/* Error / Success Feedback Banner */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Sliding Forms Container */}
                    <div className="overflow-hidden relative w-full">
                        <div
                            className={`flex w-[200%] transition-transform duration-500 ease-in-out ${
                                isRegister ? '-translate-x-1/2' : 'translate-x-0'
                            }`}
                        >
                            {/* LOGIN FORM COMPONENT (Left Slide) */}
                            <div className="w-1/2 pr-2 flex-shrink-0">
                                <Login onError={setError} onSuccess={setSuccessMessage} />
                            </div>

                            {/* REGISTER FORM COMPONENT (Right Slide) */}
                            <div className="w-1/2 pl-2 flex-shrink-0">
                                <Register onError={setError} onSuccess={setSuccessMessage} />
                            </div>
                        </div>
                    </div>

                    {/* Staff Portal Portal Link */}
                    <div className="mt-5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            Hospital Doctor or Staff Member?{' '}
                            <Link to="/staff/login" className="text-[#00478d] dark:text-blue-400 font-bold hover:underline">
                                Staff Portal Login →
                            </Link>
                        </p>
                    </div>

                    {/* Bottom Legal Notice */}
                    <div className="mt-4 text-center">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            By continuing, you agree to MedTrust's{' '}
                            <Link to="/terms" className="text-[#00478d] dark:text-blue-400 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-[#00478d] dark:text-blue-400 hover:underline">
                                Privacy Policy
                            </Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
