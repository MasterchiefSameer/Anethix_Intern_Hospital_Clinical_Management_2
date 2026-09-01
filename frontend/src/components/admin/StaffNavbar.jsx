/**
 * Staff Navbar Component.
 * Dedicated top navigation for Staff Portal (Super Admin, Receptionist, Doctor).
 * Excludes public links ("Doctors Directory", "Book Appointment") to ensure staff
 * cannot book appointments for themselves from staff console.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Bell, User, Hospital } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const StaffNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role || 'Super Admin';

    const handleLogout = () => {
        logout();
        toast.info('Staff Signed Out', {
            description: 'You have been safely logged out of the staff portal.',
        });
        navigate('/staff/login');
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-6 flex items-center justify-between flex-shrink-0 z-10 transition-colors">
            {/* Left: Brand / Hospital Workspace Label */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00478d] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        <Hospital size={18} />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block leading-tight">
                            MedTrust HMS
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            Clinical Operations
                        </span>
                    </div>
                </div>

                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                {/* Role Badge */}
                <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#00478d] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40">
                        {role} Workspace
                    </span>
                </div>
            </div>

            {/* Right: Security Badge & Profile Info */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 px-3 py-1 rounded-full">
                    <ShieldCheck size={15} className="text-emerald-500" />
                    <span>HIPAA Compliant Session</span>
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#00478d] to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="hidden lg:block text-left">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                            {user?.name || 'Staff User'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {user?.email || role}
                        </p>
                    </div>
                </div>

                {/* Quick Logout Button */}
                <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
};

export default StaffNavbar;
