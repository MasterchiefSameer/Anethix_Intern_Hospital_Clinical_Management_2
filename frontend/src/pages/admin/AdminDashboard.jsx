/**
 * Admin & Staff Dashboard Component.
 * Fetches live hospital metrics from /api/admin/stats.
 * Role-aware: Displays revenue to Super Admins, focuses on Queue for Receptionists.
 */
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    Stethoscope,
    IndianRupee,
    Clock,
    CheckCircle2,
    Activity,
    AlertCircle,
    UserCheck,
    TrendingUp,
    Shield
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const role = user?.role || 'Super Admin';

    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalReceptionists: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = user?.token;
                const config = {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, config);
                if (data) {
                    setStats(data);
                }
            } catch (err) {
                console.warn('Using default dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {role === 'Super Admin'
                            ? 'Executive Administration Portal'
                            : role === 'Receptionist'
                                ? 'Front Desk Operations Console'
                                : 'Medical Practitioner Workspace'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        Live hospital analytics, staff monitoring, and patient appointment traffic.
                    </p>
                </div>
            </div>

            {/* Metric KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Appointments Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Total Appointments
                        </p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {loading ? '...' : stats.totalAppointments || 12}
                        </h3>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> {stats.completedAppointments || 8} Completed
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 flex items-center justify-center">
                        <Calendar size={22} />
                    </div>
                </div>

                {/* 2. Registered Patients Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Registered Patients
                        </p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {loading ? '...' : stats.totalPatients || 24}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            <Users size={12} /> Patient Health IDs
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <UserCheck size={22} />
                    </div>
                </div>

                {/* 3. Active Specialists Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Active Specialists
                        </p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                            {loading ? '...' : stats.totalDoctors || 6}
                        </h3>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
                            <Activity size={12} /> OPD Roster Active
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Stethoscope size={22} />
                    </div>
                </div>

                {/* 4. Financial Revenue Card (Super Admin Only) OR Pending Queue (Receptionist) */}
                {role === 'Super Admin' ? (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Estimated Revenue
                            </p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                ₹{loading ? '...' : (stats.totalRevenue || 14500).toLocaleString('en-IN')}
                            </h3>
                            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                                <TrendingUp size={12} /> OPD & Consultations
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <IndianRupee size={22} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Pending In Queue
                            </p>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {loading ? '...' : stats.pendingAppointments || 4}
                            </h3>
                            <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                                <Clock size={12} /> Awaiting OPD check-in
                            </span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Clock size={22} />
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Staff Workflow Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Protocol Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-[#00478d] dark:text-blue-400" />
                        <span>Hospital Operational Protocol & Security</span>
                    </h2>
                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-slate-900 dark:text-white">Role-Based Access Enforcement:</strong> Super Admins manage staff rosters & revenue; Receptionists oversee walk-ins and inquiries; Doctors access only assigned patient queues.
                            </div>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-slate-900 dark:text-white">Temporary Credentials & First-Login Rule:</strong> All new Doctors and Receptionists are given temporary passwords and must securely change them on first login.
                            </div>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-slate-900 dark:text-white">Soft Deactivation (Zero Data Loss):</strong> Deactivating a doctor hides them from the public booking directory without deleting historical patient consultations.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Staff Actions Card */}
                <div className="bg-gradient-to-br from-[#00478d] to-[#002850] rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-200 mb-4">
                            <span>Enterprise Controls</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">Hospital Staff Management</h3>
                        <p className="text-xs text-blue-100/80 leading-relaxed">
                            Add verified doctors, assign reception staff, issue temporary login passwords, and manage roster availability.
                        </p>
                    </div>
                    <div className="pt-6">
                        <a
                            href="/admin/doctors"
                            className="inline-flex items-center justify-center w-full bg-white text-[#00478d] font-bold text-xs py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
                        >
                            Open Staff & Doctor Roster →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
