/**
 * Manage Appointments Component (Admin).
 * Matches Stitch platform design (Image 4) with patient avatars,
 * doctor departments, status pills, approve action buttons, and pagination.
 */
import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';

const initialAppointments = [
    {
        _id: '1',
        patient: {
            name: 'John Doe',
            id: 'P-40291',
            gender: 'Male',
            age: 45,
            initials: 'JD',
            color: 'bg-blue-600',
        },
        dateTime: 'Oct 24, 2024',
        timeSlot: '09:00 AM - 09:30 AM',
        doctor: 'Dr. Sarah Smith',
        department: 'Cardiology',
        status: 'Confirmed',
    },
    {
        _id: '2',
        patient: {
            name: 'Emily Johnson',
            id: 'P-81723',
            gender: 'Female',
            age: 28,
            initials: 'EJ',
            color: 'bg-teal-400',
        },
        dateTime: 'Oct 24, 2024',
        timeSlot: '10:15 AM - 11:00 AM',
        doctor: 'Dr. Michael Chen',
        department: 'Neurology',
        status: 'Pending',
    },
    {
        _id: '3',
        patient: {
            name: 'Robert Brown',
            id: 'P-10924',
            gender: 'Male',
            age: 62,
            initials: 'RB',
            color: 'bg-slate-700',
        },
        dateTime: 'Oct 25, 2024',
        timeSlot: '02:00 PM - 02:45 PM',
        doctor: 'Dr. Alice Williams',
        department: 'Orthopedics',
        status: 'Cancelled',
    },
    {
        _id: '4',
        patient: {
            name: 'Priya Verma',
            id: 'P-30211',
            gender: 'Female',
            age: 34,
            initials: 'PV',
            color: 'bg-purple-600',
        },
        dateTime: 'Oct 26, 2024',
        timeSlot: '11:30 AM - 12:00 PM',
        doctor: 'Dr. Marcus Thorne',
        department: 'Pediatrics',
        status: 'Pending',
    },
];

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const handleApprove = (id) => {
        setAppointments((prev) =>
            prev.map((app) => (app._id === id ? { ...app, status: 'Confirmed' } : app))
        );
        toast.success('Appointment Approved', {
            description: 'Patient and Doctor have been notified via SMS & Email.',
        });
    };

    const filteredAppointments = appointments.filter((app) => {
        if (selectedDepartment === 'All') return true;
        return app.department.toLowerCase() === selectedDepartment.toLowerCase();
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        Confirmed
                    </span>
                );
            case 'Pending':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                        Pending
                    </span>
                );
            case 'Cancelled':
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                        Cancelled
                    </span>
                );
            default:
                return <span>{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section (Match Stitch Image 4) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Manage Appointments
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        View, filter, and manage patient bookings.
                    </p>
                </div>

                {/* Filters Controls */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 pl-4 pr-9 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00478d] shadow-sm cursor-pointer"
                        >
                            <option value="All">All Departments</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Pediatrics">Pediatrics</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                        type="button"
                        onClick={() => toast.info('More Filters', { description: 'Filter by Doctor, Date Range or OPD Room.' })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors bg-white dark:bg-slate-900 shadow-sm"
                    >
                        <Filter size={14} />
                        <span>More Filters</span>
                    </button>
                </div>
            </div>

            {/* Table Card (Match Stitch Image 4) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="py-4 px-6">Patient Details</th>
                                <th className="py-4 px-6">Date & Time</th>
                                <th className="py-4 px-6">Doctor & Dept</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {filteredAppointments.map((app) => (
                                <tr
                                    key={app._id}
                                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    {/* Patient Avatar & ID */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 ${app.patient.color}`}
                                            >
                                                {app.patient.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {app.patient.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    ID: {app.patient.id} • {app.patient.gender}, {app.patient.age}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date & Time */}
                                    <td className="py-4 px-6 font-medium">
                                        <p className="font-bold text-slate-900 dark:text-white">{app.dateTime}</p>
                                        <p className="text-[11px] text-slate-400">{app.timeSlot}</p>
                                    </td>

                                    {/* Doctor & Dept */}
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-slate-900 dark:text-white">{app.doctor}</p>
                                        <p className="text-[11px] text-slate-400">{app.department}</p>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                                    {/* Action */}
                                    <td className="py-4 px-6 text-right">
                                        {app.status === 'Pending' ? (
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(app._id)}
                                                className="bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                                            >
                                                Approve
                                            </button>
                                        ) : (
                                            <span className="text-slate-400 text-xs">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Match Stitch Image 4) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Showing 1 to {filteredAppointments.length} of 45 entries</span>
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
    );
};

export default ManageAppointments;
