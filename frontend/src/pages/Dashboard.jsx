/**
 * Appointment History & Patient Dashboard Page.
 * Matches Stitch platform design (Image 1) with:
 * - "Filter" & "+ New Appointment" actions
 * - Detailed table with Doctor Avatar initials, Department, Status pills (Confirmed/Completed/Cancelled)
 * - Actions (Reschedule, View Summary, Rebook, Cancel)
 * - Pagination (< [1] [2] [3] >)
 * - Modal for viewing appointment details & prescription summary
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    User,
    Filter,
    Plus,
    MoreVertical,
    CheckCircle2,
    Clock3,
    XCircle,
    X,
    FileText,
    Download,
    Stethoscope,
    ChevronLeft,
    ChevronRight,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const defaultAppointments = [
    {
        _id: 'app_101',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        doctor: {
            name: 'Dr. Jane Smith',
            specialty: 'Cardiologist',
            initials: 'JS',
            color: 'bg-blue-600',
        },
        department: 'Cardiology',
        status: 'Confirmed',
        fee: 800,
        room: 'OPD Room 104, Block A',
        symptoms: 'Routine cardiac checkup and BP monitoring',
        summary: 'Blood pressure 125/82 mmHg. ECG normal. Advised low sodium diet and regular morning walks.',
    },
    {
        _id: 'app_102',
        date: 'Sep 15, 2024',
        time: '02:30 PM',
        doctor: {
            name: 'Dr. Alan Davis',
            specialty: 'General Practitioner',
            initials: 'AD',
            color: 'bg-teal-500',
        },
        department: 'General Medicine',
        status: 'Completed',
        fee: 500,
        room: 'OPD Room 208, Block B',
        symptoms: 'Mild fever, cold and sore throat',
        summary: 'Viral pharyngitis. Prescribed antipyretics and warm saline gargles. Patient recovered fully.',
    },
    {
        _id: 'app_103',
        date: 'Aug 05, 2024',
        time: '09:15 AM',
        doctor: {
            name: 'Dr. Emily White',
            specialty: 'Dermatologist',
            initials: 'EW',
            color: 'bg-slate-400',
        },
        department: 'Dermatology',
        status: 'Cancelled',
        fee: 700,
        room: 'Skin Clinic, Floor 3',
        symptoms: 'Skin allergy and redness on forearms',
        summary: 'Appointment cancelled by patient.',
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedSummaryModal, setSelectedSummaryModal] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('medtrust_appointments') || '[]');
            if (stored.length > 0) {
                // Merge stored with default appointments
                const merged = [
                    ...stored.map((a) => ({
                        ...a,
                        doctor: {
                            ...a.doctor,
                            initials: a.doctor.name
                                .split(' ')
                                .filter((n) => !n.startsWith('Dr.'))
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase() || 'DR',
                            color: 'bg-blue-600',
                        },
                    })),
                    ...defaultAppointments,
                ];
                setAppointments(merged);
            } else {
                setAppointments(defaultAppointments);
            }
        } catch {
            setAppointments(defaultAppointments);
        }
    }, []);

    // Filter appointments
    const filteredAppointments = appointments.filter((app) => {
        if (filterStatus === 'All') return true;
        return app.status.toLowerCase() === filterStatus.toLowerCase();
    });

    const handleCancelAppointment = (id) => {
        setAppointments((prev) =>
            prev.map((app) => (app._id === id ? { ...app, status: 'Cancelled' } : app))
        );
        setActiveDropdown(null);
        toast.success('Appointment Cancelled', {
            description: 'The booking has been cancelled and refund initiated.',
        });
    };

    const handleReschedule = (app) => {
        setActiveDropdown(null);
        toast.info('Reschedule Slot', {
            description: 'Select your preferred new date and time for consultation.',
        });
        navigate('/book/doc_1');
    };

    const getStatusPill = (status) => {
        switch (status) {
            case 'Confirmed':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#00478d] text-white">
                        Confirmed
                    </span>
                );
            case 'Completed':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        Completed
                    </span>
                );
            case 'Cancelled':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 line-through">
                        Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section (Match Stitch Image 1) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Appointment History
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Review your past consultations and manage upcoming appointments.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Filter Status Selector */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 pl-8 pr-8 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00478d] shadow-sm cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <Filter size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                        </div>

                        {/* New Appointment Button */}
                        <button
                            type="button"
                            onClick={() => navigate('/doctors')}
                            className="inline-flex items-center gap-1.5 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                            <Plus size={15} />
                            <span>New Appointment</span>
                        </button>
                    </div>
                </div>

                {/* Main Table Card (Match Stitch Image 1) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                                    <th className="py-4 px-6">DATE & TIME</th>
                                    <th className="py-4 px-6">DOCTOR</th>
                                    <th className="py-4 px-6">DEPARTMENT</th>
                                    <th className="py-4 px-6">STATUS</th>
                                    <th className="py-4 px-6 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                {filteredAppointments.map((app) => {
                                    const isCancelled = app.status === 'Cancelled';
                                    return (
                                        <tr
                                            key={app._id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            {/* Date & Time */}
                                            <td className="py-4 px-6 font-medium">
                                                <p
                                                    className={`font-bold ${
                                                        isCancelled
                                                            ? 'text-slate-400 line-through'
                                                            : 'text-slate-900 dark:text-white'
                                                    }`}
                                                >
                                                    {app.date}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{app.time}</p>
                                            </td>

                                            {/* Doctor Avatar + Details */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 ${
                                                            app.doctor?.color || 'bg-blue-600'
                                                        }`}
                                                    >
                                                        {app.doctor?.initials || 'DR'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {app.doctor?.name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            {app.doctor?.specialty}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Department */}
                                            <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                                                {app.department}
                                            </td>

                                            {/* Status Pill */}
                                            <td className="py-4 px-6">
                                                {getStatusPill(app.status)}
                                            </td>

                                            {/* Action Links */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="inline-flex items-center gap-3 relative">
                                                    {app.status === 'Confirmed' && (
                                                        <button
                                                            onClick={() => handleReschedule(app)}
                                                            className="text-[#00478d] dark:text-blue-400 font-semibold hover:underline"
                                                        >
                                                            Reschedule
                                                        </button>
                                                    )}
                                                    {app.status === 'Completed' && (
                                                        <button
                                                            onClick={() => setSelectedSummaryModal(app)}
                                                            className="text-[#00478d] dark:text-blue-400 font-semibold hover:underline"
                                                        >
                                                            View Summary
                                                        </button>
                                                    )}
                                                    {app.status === 'Cancelled' && (
                                                        <button
                                                            onClick={() => navigate('/doctors')}
                                                            className="text-[#00478d] dark:text-blue-400 font-semibold hover:underline"
                                                        >
                                                            Rebook
                                                        </button>
                                                    )}

                                                    {/* 3-dots Menu Button */}
                                                    <button
                                                        onClick={() =>
                                                            setActiveDropdown(activeDropdown === app._id ? null : app._id)
                                                        }
                                                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeDropdown === app._id && (
                                                        <div className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1.5 z-20 text-left">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedSummaryModal(app);
                                                                    setActiveDropdown(null);
                                                                }}
                                                                className="w-full px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                                                            >
                                                                <FileText size={14} />
                                                                <span>View Details</span>
                                                            </button>
                                                            {app.status === 'Confirmed' && (
                                                                <button
                                                                    onClick={() => handleCancelAppointment(app._id)}
                                                                    className="w-full px-3.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                                                                >
                                                                    <XCircle size={14} />
                                                                    <span>Cancel Booking</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer with Pagination (Match Stitch Image 1) */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>Showing 1 to {filteredAppointments.length} of {filteredAppointments.length} entries</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(1)}
                                className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
                                    currentPage === 1
                                        ? 'bg-[#00478d] text-white shadow-sm'
                                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                1
                            </button>
                            <button
                                onClick={() => setCurrentPage(2)}
                                className={`w-8 h-8 rounded-lg font-medium flex items-center justify-center ${
                                    currentPage === 2
                                        ? 'bg-[#00478d] text-white shadow-sm'
                                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                2
                            </button>
                            <button
                                onClick={() => setCurrentPage(3)}
                                className={`w-8 h-8 rounded-lg font-medium flex items-center justify-center ${
                                    currentPage === 3
                                        ? 'bg-[#00478d] text-white shadow-sm'
                                        : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                3
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* APPOINTMENT SUMMARY MODAL */}
            {selectedSummaryModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setSelectedSummaryModal(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Consultation Summary & Receipt
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Appointment ID: {selectedSummaryModal._id}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-700 mb-5 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Consulting Doctor:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedSummaryModal.doctor?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Department:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSummaryModal.department}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Date & Slot:</span>
                                <span className="font-semibold text-[#00478d] dark:text-blue-400">{selectedSummaryModal.date} at {selectedSummaryModal.time}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">OPD Room:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSummaryModal.room || 'Main OPD Wing'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-slate-400">Consultation Fee:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{selectedSummaryModal.fee || 500} (Paid)</span>
                            </div>
                        </div>

                        {/* Medical Summary Notes */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Doctor's Clinical Notes
                            </h4>
                            <p className="text-xs text-slate-700 dark:text-slate-300 bg-blue-50/30 dark:bg-blue-950/20 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 leading-relaxed">
                                {selectedSummaryModal.summary || 'Routine consultation completed. Patient reported steady recovery.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    toast.success('Prescription PDF Downloaded', {
                                        description: `Receipt for ${selectedSummaryModal.doctor?.name} saved.`,
                                    });
                                    setSelectedSummaryModal(null);
                                }}
                                className="w-full py-2.5 rounded-xl bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={14} />
                                <span>Download OPD Slip (PDF)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
