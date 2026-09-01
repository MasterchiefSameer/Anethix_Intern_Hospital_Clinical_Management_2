/**
 * Navbar Component.
 * Displays top navigation bar with light/dark theme toggle, active links,
 * and a profile hover/click dropdown menu.
 */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Stethoscope,
    User,
    Sun,
    Moon,
    LogOut,
    Calendar,
    Settings,
    Shield,
    HeartPulse,
    LayoutDashboard,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme, isDark } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        toast.info('Signed Out', {
            description: 'You have been logged out of MedTrust Portal.',
        });
        navigate('/login');
    };

    const handleBookAppointmentClick = () => {
        if (!user) {
            toast.info('Sign in to Book Appointment', {
                description: 'Please sign in or register to schedule an OPD slot.',
            });
            navigate('/login', { state: { from: { pathname: '/doctors' } } });
        } else if (user.role === 'Receptionist') {
            navigate('/admin/appointments');
        } else if (user.role === 'Doctor') {
            navigate('/admin/appointments');
        } else if (user.role === 'Super Admin') {
            navigate('/admin');
        } else {
            navigate('/doctors');
        }
    };

    // Dynamic CTA button label based on role
    const getCtaLabel = () => {
        if (!user) return 'Book Appointment';
        if (user.role === 'Receptionist') return 'Walk-In Booking';
        if (user.role === 'Doctor') return 'My OPD Schedule';
        if (user.role === 'Super Admin') return 'Admin Console';
        return 'Book Appointment';
    };

    return (
        <header className="bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
            <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00478d] dark:bg-blue-600 flex items-center justify-center text-white shadow-sm">
                        <Stethoscope size={20} />
                    </div>
                    <span className="text-xl font-bold text-[#00478d] dark:text-blue-400 tracking-tight">
                        MedTrust Portal
                    </span>
                </Link>

                {/* Navigation Links (Match Stitch Platform Header) */}
                <nav className="hidden md:flex items-center gap-7">
                    <Link
                        to="/"
                        className={`text-sm font-medium transition-colors ${
                            isActive('/')
                                ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/departments"
                        className={`text-sm font-medium transition-colors ${
                            isActive('/departments')
                                ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                        }`}
                    >
                        Departments
                    </Link>
                    {(!user || user.role === 'Patient') && (
                        <Link
                            to="/doctors"
                            className={`text-sm font-medium transition-colors ${
                                isActive('/doctors')
                                    ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                            }`}
                        >
                            Find Doctors
                        </Link>
                    )}
                    {user?.role === 'Super Admin' && (
                        <Link
                            to="/admin/doctors"
                            className={`text-sm font-medium transition-colors ${
                                isActive('/admin/doctors')
                                    ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                            }`}
                        >
                            Manage Doctors
                        </Link>
                    )}
                    {user?.role === 'Receptionist' && (
                        <Link
                            to="/admin/appointments"
                            className={`text-sm font-medium transition-colors ${
                                isActive('/admin/appointments')
                                    ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                            }`}
                        >
                            Doctor Roster
                        </Link>
                    )}
                    <Link
                        to="/about"
                        className={`text-sm font-medium transition-colors ${
                            isActive('/about')
                                ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                        }`}
                    >
                        About Us
                    </Link>
                    <Link
                        to="/contact"
                        className={`text-sm font-medium transition-colors ${
                            isActive('/contact')
                                ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                        }`}
                    >
                        Contact
                    </Link>
                    {user && (
                        <Link
                            to={user.role === 'Patient' ? '/dashboard' : '/admin'}
                            className={`text-sm font-medium transition-colors ${
                                isActive('/dashboard') || isActive('/admin')
                                    ? 'text-[#00478d] dark:text-blue-400 border-b-2 border-[#00478d] dark:border-blue-400 pb-1 font-semibold'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400'
                            }`}
                        >
                            {user.role === 'Patient' ? 'Dashboard' : `${user.role} Portal`}
                        </Link>
                    )}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Dark/Light Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle Dark/Light Mode"
                        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                    >
                        {isDark ? (
                            <Sun size={18} className="text-amber-400" />
                        ) : (
                            <Moon size={18} className="text-slate-700" />
                        )}
                    </button>

                    {/* Dynamic Action CTA */}
                    {(!user || user.role === 'Patient') && (
                        <button
                            type="button"
                            onClick={handleBookAppointmentClick}
                            className="hidden sm:inline-flex items-center justify-center bg-[#00478d] dark:bg-blue-600 text-white hover:bg-[#003870] dark:hover:bg-blue-700 transition-colors text-sm font-semibold px-5 py-2 rounded-xl shadow-sm"
                        >
                            Book Appointment
                        </button>
                    )}

                    {/* Profile Section with Hover & Click Dropdown */}
                    {user ? (
                        <div className="relative group">
                            {/* Avatar Trigger Button */}
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#00478d] dark:hover:border-blue-400 transition-all focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#00478d] dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </button>

                            {/* Dropdown Menu (Opens on hover or click) */}
                            <div
                                className={`absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-3 z-50 transition-all duration-200 ${
                                    dropdownOpen
                                        ? 'opacity-100 visible translate-y-0'
                                        : 'opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
                                }`}
                            >
                                {/* User Info Header */}
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {user.name || 'Staff User'}
                                        </p>
                                        {user.bloodGroup && (
                                            <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-extrabold px-1.5 py-0.5 rounded">
                                                {user.bloodGroup}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user.email}
                                    </p>
                                    <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                                        {user.role || 'Patient'}
                                    </span>
                                </div>

                                {/* Menu Links Based on Role */}
                                <div className="py-2 space-y-0.5">
                                    {/* Receptionist Dropdown */}
                                    {user.role === 'Receptionist' && (
                                        <>
                                            <Link
                                                to="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-[#00478d] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>Reception Dashboard</span>
                                            </Link>
                                            <Link
                                                to="/admin/receptionist-profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors"
                                            >
                                                <User size={16} />
                                                <span>My Staff Profile</span>
                                            </Link>
                                            <Link
                                                to="/admin/appointments"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors"
                                            >
                                                <Calendar size={16} />
                                                <span>Live OPD Queue</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Doctor Dropdown */}
                                    {user.role === 'Doctor' && (
                                        <>
                                            <Link
                                                to="/admin/appointments"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-[#00478d] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <Calendar size={16} />
                                                <span>Doctor Schedule</span>
                                            </Link>
                                            <Link
                                                to="/admin/doctor-profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors"
                                            >
                                                <User size={16} />
                                                <span>My Doctor Profile</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Super Admin Dropdown */}
                                    {user.role === 'Super Admin' && (
                                        <>
                                            <Link
                                                to="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <Shield size={16} />
                                                <span>Admin Console</span>
                                            </Link>
                                            <Link
                                                to="/admin/doctors"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-purple-600 transition-colors"
                                            >
                                                <User size={16} />
                                                <span>Manage Staff & Doctors</span>
                                            </Link>
                                        </>
                                    )}

                                    {/* Patient Dropdown (Default) */}
                                    {(!user.role || user.role === 'Patient') && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-[#00478d] dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                <span>Dashboard & Appointments</span>
                                            </Link>
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors"
                                            >
                                                <User size={16} />
                                                <span>My Medical Profile</span>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Sign Out Option */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
                            title="Login"
                        >
                            <User size={18} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
