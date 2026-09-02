/**
 * Front Desk & Live OPD Queue Management Component.
 * Features live queue metrics, 1-Click Check-In / No-Show / Reschedule actions,
 * and a Front Desk Walk-In Registration Modal syncing live with MongoDB.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
    UserPlus,
    UserCheck,
    Calendar,
    Stethoscope,
    RefreshCw,
    Activity,
    AlertCircle,
    ArrowRight,
    Phone,
    User,
    Check,
    X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const ManageAppointments = () => {
    const { user } = useAuth();

    const [queue, setQueue] = useState([]);
    const [stats, setStats] = useState({
        totalToday: 0,
        pendingQueue: 0,
        checkedIn: 0,
        scheduled: 0,
        completed: 0,
        noShow: 0,
        activeDoctorsCount: 0,
    });
    const [doctorsList, setDoctorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Walk-In Registration Modal State
    const [walkInOpen, setWalkInOpen] = useState(false);
    const [submittingWalkIn, setSubmittingWalkIn] = useState(false);
    const [walkInData, setWalkInData] = useState({
        patientName: '',
        patientPhone: '',
        doctor: '',
        time: '10:00 AM',
        reason: 'General Walk-In Consultation',
        autoCheckIn: true,
    });

    // Reschedule Modal State
    const [rescheduleModal, setRescheduleModal] = useState({
        open: false,
        appointmentId: null,
        patientName: '',
        newDate: new Date().toISOString().split('T')[0],
        newTime: '10:00 AM',
    });

    // Fetch Live Queue Data from MongoDB API
    const fetchQueueData = useCallback(async () => {
        setLoading(true);
        try {
            const token = user?.token || user?.rest?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const [queueRes, doctorsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/queue/today`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/doctors`),
            ]);

            if (queueRes.data) {
                setQueue(queueRes.data.queue || []);
                if (queueRes.data.stats) {
                    setStats(queueRes.data.stats);
                }
            }

            if (doctorsRes.data) {
                const docs = Array.isArray(doctorsRes.data) ? doctorsRes.data : doctorsRes.data.doctors || [];
                setDoctorsList(docs);
                if (docs.length > 0 && !walkInData.doctor) {
                    setWalkInData((prev) => ({ ...prev, doctor: docs[0]._id }));
                }
            }
        } catch (err) {
            console.error('Error fetching OPD queue:', err);
            toast.error('Failed to load queue', {
                description: 'Could not connect to MongoDB appointment service.',
            });
        } finally {
            setLoading(false);
        }
    }, [user, walkInData.doctor]);

    useEffect(() => {
        fetchQueueData();
    }, [fetchQueueData]);

    // Handle 1-Click Status Update (Checked-In, No-Show, Completed, Cancelled)
    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            const token = user?.token || user?.rest?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}/status`,
                { status: newStatus },
                config
            );

            toast.success(`Status updated: ${newStatus}`, {
                description: `Appointment marked as ${newStatus}.`,
            });
            fetchQueueData();
        } catch (err) {
            console.error('Status update error:', err);
            toast.error('Action Failed', {
                description: err.response?.data?.message || 'Could not update status.',
            });
        }
    };

    // Handle Front Desk Walk-In Booking
    const handleWalkInSubmit = async (e) => {
        e.preventDefault();
        setSubmittingWalkIn(true);
        try {
            const token = user?.token || user?.rest?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments/walkin`,
                walkInData,
                config
            );

            toast.success('Walk-In Registered & Queued!', {
                description: `Patient ${walkInData.patientName} is added to the live OPD list.`,
            });

            setWalkInOpen(false);
            setWalkInData({
                patientName: '',
                patientPhone: '',
                doctor: doctorsList[0]?._id || '',
                time: '10:00 AM',
                reason: 'General Walk-In Consultation',
                autoCheckIn: true,
            });

            fetchQueueData();
        } catch (err) {
            console.error('Walk-in booking error:', err);
            toast.error('Walk-In Booking Failed', {
                description: err.response?.data?.message || 'Please check patient details and try again.',
            });
        } finally {
            setSubmittingWalkIn(false);
        }
    };

    // Handle Reschedule Submit
    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = user?.token || user?.rest?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/appointments/${rescheduleModal.appointmentId}/reschedule`,
                {
                    date: rescheduleModal.newDate,
                    time: rescheduleModal.newTime,
                },
                config
            );

            toast.success('Appointment Rescheduled', {
                description: `Moved to ${rescheduleModal.newDate} at ${rescheduleModal.newTime}.`,
            });

            setRescheduleModal({ open: false, appointmentId: null, patientName: '', newDate: '', newTime: '' });
            fetchQueueData();
        } catch (err) {
            console.error('Reschedule error:', err);
            toast.error('Reschedule Failed', {
                description: err.response?.data?.message || 'Could not reschedule appointment.',
            });
        }
    };

    // Filter queue list
    const filteredQueue = queue.filter((item) => {
        const matchesSearch =
            (item.patientName || item.patient?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.patientPhone || item.patient?.phone || '').includes(searchTerm) ||
            (item.doctor?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Checked-In':
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} />
                        Checked-In
                    </span>
                );
            case 'Scheduled':
            case 'Confirmed':
            case 'Pending':
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-[#00478d] dark:text-blue-300 flex items-center gap-1 w-fit">
                        <Clock size={12} />
                        Scheduled
                    </span>
                );
            case 'Completed':
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 w-fit">
                        Completed
                    </span>
                );
            case 'No-Show':
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 flex items-center gap-1 w-fit">
                        <XCircle size={12} />
                        No-Show
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Operational Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Today's Bookings */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Today's Bookings
                        </p>
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                            {stats.totalToday}
                        </h3>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                            {stats.activeDoctorsCount} Specialists on Duty
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* 2. Pending in Queue */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Pending in Queue
                        </p>
                        <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                            {stats.pendingQueue}
                        </h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {stats.checkedIn} Checked-in, {stats.scheduled} Awaiting
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                </div>

                {/* 3. Checked-In Patients */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Checked-In OPD
                        </p>
                        <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                            {stats.checkedIn}
                        </h3>
                        <span className="text-[11px] text-emerald-600 font-medium">
                            Arrived at Front Desk
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <UserCheck size={24} />
                    </div>
                </div>

                {/* 4. Completed Today */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Completed Visits
                        </p>
                        <h3 className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                            {stats.completed}
                        </h3>
                        <span className="text-[11px] text-rose-500 font-medium">
                            {stats.noShow} No-Show
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {/* Header & Walk-In Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Live OPD Front Desk Queue
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        Real-time hospital queue management, patient check-ins, and walk-in OPD registration.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={fetchQueueData}
                        disabled={loading}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                        title="Refresh Live Queue"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>

                    {/* Book Walk-In Patient Modal Trigger */}
                    <button
                        type="button"
                        onClick={() => setWalkInOpen(true)}
                        className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all"
                    >
                        <UserPlus size={16} />
                        <span>+ Book Walk-In Patient</span>
                    </button>
                </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search patient, phone, doctor..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-slate-400 font-medium">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Checked-In">Checked-In</option>
                        <option value="Completed">Completed</option>
                        <option value="No-Show">No-Show</option>
                    </select>
                </div>
            </div>

            {/* Queue Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/60 dark:bg-slate-800/40">
                                <th className="py-3.5 px-6">Token & Patient</th>
                                <th className="py-3.5 px-6">Phone / Contact</th>
                                <th className="py-3.5 px-6">Specialist Doctor</th>
                                <th className="py-3.5 px-6">Time Slot</th>
                                <th className="py-3.5 px-6">Status</th>
                                <th className="py-3.5 px-6 text-right">Front Desk Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {filteredQueue.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <Clock size={36} className="mx-auto mb-2 opacity-40 text-[#00478d]" />
                                        <p className="font-semibold">No appointments in queue for today</p>
                                        <p className="text-[11px]">Click "+ Book Walk-In Patient" to add a patient to the live list.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQueue.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                        {/* Token & Patient Name */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#00478d] dark:text-blue-300 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                                                    #{item.tokenNumber || '—'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                        <span>{item.patientName || item.patient?.name || 'Patient'}</span>
                                                        {item.isWalkIn && (
                                                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                                                Walk-In
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {item.reason || 'General Checkup'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-300">
                                            {item.patientPhone || item.patient?.phone || '—'}
                                        </td>

                                        {/* Doctor */}
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                {item.doctor?.name || 'Assigned Specialist'}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {item.doctor?.specialty || 'OPD'}
                                            </p>
                                        </td>

                                        {/* Time */}
                                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                                            {item.time}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-6">
                                            {getStatusBadge(item.status)}
                                        </td>

                                        {/* 1-Click Front Desk Actions */}
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                {/* Action 1: Mark as Arrived / Checked-In */}
                                                {item.status === 'Scheduled' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(item._id, 'Checked-In')}
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                                                        title="Patient arrived at Front Desk"
                                                    >
                                                        Mark Arrived
                                                    </button>
                                                )}

                                                {/* Action 2: Mark as Completed (Consultation Done) */}
                                                {item.status === 'Checked-In' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(item._id, 'Completed')}
                                                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] shadow-sm transition-all"
                                                    >
                                                        Complete
                                                    </button>
                                                )}

                                                {/* Action 3: Mark No-Show */}
                                                {(item.status === 'Scheduled' || item.status === 'Checked-In') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(item._id, 'No-Show')}
                                                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-semibold transition-colors"
                                                        title="Mark patient as absent"
                                                    >
                                                        No-Show
                                                    </button>
                                                )}

                                                {/* Action 4: Reschedule */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRescheduleModal({
                                                            open: true,
                                                            appointmentId: item._id,
                                                            patientName: item.patientName || item.patient?.name || 'Patient',
                                                            newDate: new Date().toISOString().split('T')[0],
                                                            newTime: item.time || '10:00 AM',
                                                        })
                                                    }
                                                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold transition-colors"
                                                >
                                                    Reschedule
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal 1: Walk-In Registration Modal */}
            {walkInOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                            <div className="flex items-center gap-2 text-[#00478d] dark:text-blue-400 font-bold text-lg">
                                <UserPlus size={20} />
                                <h2>Front Desk Walk-In Registration</h2>
                            </div>
                            <button
                                onClick={() => setWalkInOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleWalkInSubmit} className="space-y-4">
                            {/* Patient Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Patient Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={walkInData.patientName}
                                    onChange={(e) => setWalkInData({ ...walkInData, patientName: e.target.value })}
                                    placeholder="e.g. Ramesh Kumar"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Phone Number (+91)
                                </label>
                                <input
                                    type="tel"
                                    value={walkInData.patientPhone}
                                    onChange={(e) => setWalkInData({ ...walkInData, patientPhone: e.target.value })}
                                    placeholder="9876543210"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                                />
                            </div>

                            {/* Doctor Selector */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Select Doctor / Specialist *
                                </label>
                                <select
                                    required
                                    value={walkInData.doctor}
                                    onChange={(e) => setWalkInData({ ...walkInData, doctor: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                                >
                                    {doctorsList.map((doc) => (
                                        <option key={doc._id} value={doc._id}>
                                            {doc.name} — {doc.specialty} (₹{doc.fees})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Slot & Reason */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Time Slot *
                                    </label>
                                    <select
                                        value={walkInData.time}
                                        onChange={(e) => setWalkInData({ ...walkInData, time: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                                    >
                                        {[
                                            '09:00 AM',
                                            '09:30 AM',
                                            '10:00 AM',
                                            '10:30 AM',
                                            '11:00 AM',
                                            '11:30 AM',
                                            '01:00 PM',
                                            '01:30 PM',
                                            '02:00 PM',
                                            '02:30 PM',
                                            '03:00 PM'
                                        ].map((slot) => (
                                            <option key={slot} value={slot}>
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Reason
                                    </label>
                                    <input
                                        type="text"
                                        value={walkInData.reason}
                                        onChange={(e) => setWalkInData({ ...walkInData, reason: e.target.value })}
                                        placeholder="Fever / Checkup"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Direct Check-In Toggle */}
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="autoCheckIn"
                                    checked={walkInData.autoCheckIn}
                                    onChange={(e) => setWalkInData({ ...walkInData, autoCheckIn: e.target.checked })}
                                    className="w-4 h-4 rounded text-[#00478d]"
                                />
                                <label htmlFor="autoCheckIn" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                    Direct Check-In (Patient is already standing at Front Desk)
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setWalkInOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingWalkIn}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00478d] hover:bg-[#003870] text-white shadow-sm disabled:opacity-60"
                                >
                                    {submittingWalkIn ? 'Generating Token...' : 'Register & Queue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Reschedule Modal */}
            {rescheduleModal.open && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                Reschedule for {rescheduleModal.patientName}
                            </h3>
                            <button
                                onClick={() => setRescheduleModal({ open: false, appointmentId: null, patientName: '', newDate: '', newTime: '' })}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    New Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={rescheduleModal.newDate}
                                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, newDate: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    New Time Slot *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={rescheduleModal.newTime}
                                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, newTime: e.target.value })}
                                    placeholder="11:30 AM"
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setRescheduleModal({ open: false, appointmentId: null, patientName: '', newDate: '', newTime: '' })}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00478d] text-white hover:bg-[#003870]"
                                >
                                    Confirm Reschedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAppointments;
