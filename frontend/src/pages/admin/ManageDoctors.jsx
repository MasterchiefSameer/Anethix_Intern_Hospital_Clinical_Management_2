/**
 * Manage Staff & Doctors Component (Super Admin).
 * Allows Super Admin to:
 * - View all hospital staff (Doctors, Receptionists, Admins)
 * - Add new Doctor / Receptionist with Temporary Password & first-login enforcement
 * - Soft Activate / Deactivate staff (prevents data loss)
 * - Reset temporary password
 */
import React, { useState, useEffect } from 'react';
import {
    Search,
    Stethoscope,
    Filter,
    Plus,
    Edit2,
    Trash2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle2,
    Shield,
    Users,
    KeyRound,
    AlertCircle,
    Copy,
    Power,
    Check
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const ManageDoctors = () => {
    const { user } = useAuth();

    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [createdCredentialModal, setCreatedCredentialModal] = useState(null);
    const [copied, setCopied] = useState(false);

    // Add Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Doctor',
        temporaryPassword: 'Welcome@123',
        phone: '',
        gender: 'Male',
        licenseNumber: '',
        specialty: 'General Medicine',
        experience: 5,
        fees: 500,
        about: '',
    });
    console.log(formData);
    const [submitting, setSubmitting] = useState(false);

    // Fetch Staff List from Backend
    const fetchStaff = async () => {
        try {
            setLoading(true);
            const token = user?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const { data } = await axios.get('http://localhost:5000/api/admin/staff', config);
            if (data && Array.isArray(data)) {
                setStaffList(data);
            }
        } catch (err) {
            console.warn('Could not fetch staff from API, loading mock data:', err);
            // Fallback default list
            setStaffList([
                {
                    _id: '1',
                    name: 'Dr. Sarah Jenkins',
                    email: 'sarah.jenkins@medtrust.org',
                    role: 'Doctor',
                    phone: '+91 98765 43210',
                    isActive: true,
                    isFirstLogin: false,
                    doctorProfile: { specialty: 'Cardiology', experience: 12, fees: 800 }
                },
                {
                    _id: '2',
                    name: 'Dr. Marcus Thorne',
                    email: 'marcus.thorne@medtrust.org',
                    role: 'Doctor',
                    phone: '+91 98765 43211',
                    isActive: true,
                    isFirstLogin: false,
                    doctorProfile: { specialty: 'Pediatrics', experience: 8, fees: 600 }
                },
                {
                    _id: '3',
                    name: 'Rohan Sharma (Front Desk)',
                    email: 'rohan.reception@medtrust.org',
                    role: 'Receptionist',
                    phone: '+91 98765 43212',
                    isActive: true,
                    isFirstLogin: false,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [user]);

    // 1. Handle Soft Deactivation / Activation
    const handleToggleStatus = async (staffId, currentStatus, staffName) => {
        try {
            const token = user?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            await axios.patch(
                `http://localhost:5000/api/admin/staff/${staffId}/toggle-status`,
                {},
                config
            );

            setStaffList((prev) =>
                prev.map((s) => (s._id === staffId ? { ...s, isActive: !currentStatus } : s))
            );

            toast.success(`Staff Status Updated`, {
                description: `${staffName} has been ${!currentStatus ? 'Activated' : 'Deactivated'}.`,
            });
        } catch (err) {
            toast.error('Failed to update status', {
                description: err.response?.data?.message || 'Server error',
            });
        }
    };

    // 2. Handle Temporary Password Reset
    const handleResetPassword = async (staffId, staffName) => {
        const tempPass = 'Welcome@' + Math.floor(100 + Math.random() * 900);
        try {
            const token = user?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            await axios.post(
                `http://localhost:5000/api/admin/staff/${staffId}/reset-password`,
                { temporaryPassword: tempPass },
                config
            );

            setCreatedCredentialModal({
                name: staffName,
                temporaryPassword: tempPass,
                message: 'Temporary password generated. User will be forced to change password on next login.'
            });

            toast.success('Temporary Password Issued', {
                description: `New password generated for ${staffName}.`,
            });
        } catch (err) {
            toast.error('Reset Failed', {
                description: err.response?.data?.message || 'Server error',
            });
        }
    };

    // 3. Handle Add Staff Submission
    const handleAddStaffSubmit = async (e) => {
        e.preventDefault();

        // Strict Client-side Validation to prevent accidental premature submissions
        if (!formData.name?.trim() || !formData.email?.trim() || !formData.temporaryPassword?.trim()) {
            toast.error('Missing Information', {
                description: 'Please fill in Full Name, Official Email, and Temporary Password.',
            });
            return;
        }

        if (formData.role === 'Doctor' && !formData.licenseNumber?.trim()) {
            toast.error('License Number Required', {
                description: 'Please provide the Medical Registration / License Number for the Doctor.',
            });
            return;
        }

        setSubmitting(true);

        try {
            const token = user?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/admin/staff',
                formData,
                config
            );

            setIsAddModalOpen(false);
            setCreatedCredentialModal({
                name: formData.name,
                email: formData.email,
                role: formData.role,
                temporaryPassword: formData.temporaryPassword,
                message: 'Staff enrolled! Provide these temporary credentials to the staff member.'
            });

            toast.success('Staff Account Created', {
                description: `${formData.name} added as ${formData.role}.`,
            });

            fetchStaff();
            setFormData({
                name: '',
                email: '',
                role: 'Doctor',
                temporaryPassword: 'Welcome@123',
                phone: '',
                gender: 'Male',
                specialty: 'General Medicine',
                licenseNumber: '',
                qualifications: 'MBBS, MD',
                experience: 5,
                fees: 500,
                deskNumber: 'Front Desk #1',
                shiftTimings: 'Morning Shift (08:00 AM - 04:00 PM)',
                about: '',
            });
        } catch (err) {
            toast.error('Failed to create staff', {
                description: err.response?.data?.message || 'Server error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Copy to clipboard helper
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.info('Copied to clipboard');
    };

    // Filter logic
    const filteredStaff = staffList.filter((staff) => {
        const matchesSearch =
            !searchQuery ||
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            selectedRole === 'All' || staff.role.toLowerCase() === selectedRole.toLowerCase();
        const matchesStatus =
            selectedStatus === 'All' ||
            (selectedStatus === 'Active' && staff.isActive !== false) ||
            (selectedStatus === 'Inactive' && staff.isActive === false);
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Top Title & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Staff & Medical Roster
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                        Enroll doctors & receptionists, issue temporary passwords, and manage active status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
                >
                    <Plus size={16} />
                    <span>Add New Staff / Doctor</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by staff name or email..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] text-slate-900 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                    {/* Role Filter */}
                    <div className="relative">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 pl-4 pr-8 py-2 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                            <option value="All">All Roles</option>
                            <option value="Doctor">Doctors</option>
                            <option value="Receptionist">Receptionists</option>
                            <option value="Super Admin">Super Admins</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 pl-4 pr-8 py-2 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                            <option value="All">Status: All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Deactivated</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="py-4 px-6">Staff Member</th>
                                <th className="py-4 px-6">Role</th>
                                <th className="py-4 px-6">Specialty / Department</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">First Login</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {filteredStaff.map((staff) => (
                                <tr key={staff._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                    {/* Name & Email */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                                {staff.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{staff.name}</p>
                                                <p className="text-[11px] text-slate-400">{staff.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role Badge */}
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                            staff.role === 'Super Admin'
                                                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                                                : staff.role === 'Doctor'
                                                ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                                                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                        }`}>
                                            {staff.role}
                                        </span>
                                    </td>

                                    {/* Specialty */}
                                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                                        {staff.doctorProfile?.specialty || (staff.role === 'Receptionist' ? 'Front Desk & Queue' : 'Hospital Executive')}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-4 px-6">
                                        {staff.isActive !== false ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span>Active</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                <span>Deactivated</span>
                                            </span>
                                        )}
                                    </td>

                                    {/* First Login Security Indicator */}
                                    <td className="py-4 px-6">
                                        {staff.isFirstLogin ? (
                                            <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                                                Pending Password Change
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-[11px]">
                                                Secured
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6 text-right">
                                        <div className="inline-flex items-center gap-1.5">
                                            {/* Reset Temporary Password */}
                                            <button
                                                type="button"
                                                onClick={() => handleResetPassword(staff._id, staff.name)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                                                title="Reset Temporary Password"
                                            >
                                                <KeyRound size={15} />
                                            </button>

                                            {/* Soft Activate/Deactivate Toggle */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(staff._id, staff.isActive !== false, staff.name)}
                                                className={`p-1.5 rounded-lg transition-colors ${
                                                    staff.isActive !== false
                                                        ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                                                        : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                                }`}
                                                title={staff.isActive !== false ? 'Deactivate Staff' : 'Activate Staff'}
                                            >
                                                <Power size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD NEW STAFF / DOCTOR MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            Enroll Hospital Staff
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Create Doctor or Receptionist accounts with temporary passwords.
                        </p>

                        <form onSubmit={handleAddStaffSubmit} className="space-y-4">
                            {/* Role Select */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                    Staff Role *
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                                >
                                    <option value="Doctor">Doctor (Medical Specialist)</option>
                                    <option value="Receptionist">Receptionist (Front Desk Operations)</option>
                                </select>
                            </div>

                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Dr. Alok Verma"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                        Official Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="alok@medtrust.org"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Contact & Gender */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                        Phone Number (+91)
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Temporary Password */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                    Temporary Password (Staff will change on first login) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.temporaryPassword}
                                    onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                />
                            </div>

                            {/* Doctor Specific Fields */}
                            {formData.role === 'Doctor' && (
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Medical License / Reg No. *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="MCI-REG-84920"
                                                value={formData.licenseNumber}
                                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Qualifications
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="MBBS, MD (AIIMS)"
                                                value={formData.qualifications}
                                                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Specialty Department *
                                            </label>
                                            <select
                                                value={formData.specialty}
                                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                            >
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Orthopedics">Orthopedics</option>
                                                <option value="Dermatology">Dermatology</option>
                                                <option value="General Medicine">General Medicine</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Consultation Fee (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.fees}
                                                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Receptionist Specific Fields */}
                            {formData.role === 'Receptionist' && (
                                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Desk / Counter Assignment
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Front Desk #1"
                                                value={formData.deskNumber}
                                                onChange={(e) => setFormData({ ...formData, deskNumber: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                                                Shift Timings
                                            </label>
                                            <select
                                                value={formData.shiftTimings}
                                                onChange={(e) => setFormData({ ...formData, shiftTimings: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                                            >
                                                <option value="Morning Shift (08:00 AM - 04:00 PM)">Morning Shift (08:00 AM - 04:00 PM)</option>
                                                <option value="Evening Shift (02:00 PM - 10:00 PM)">Evening Shift (02:00 PM - 10:00 PM)</option>
                                                <option value="Night Shift (10:00 PM - 06:00 AM)">Night Shift (10:00 PM - 06:00 AM)</option>
                                                <option value="Full Day General (09:00 AM - 05:00 PM)">Full Day General (09:00 AM - 05:00 PM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-1/2 py-2.5 rounded-xl bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                                >
                                    {submitting ? 'Enrolling...' : 'Create Staff Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREDENTIAL NOTICE MODAL */}
            {createdCredentialModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 relative">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-3">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            Staff Account Credentials Issued
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                            {createdCredentialModal.message}
                        </p>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 mb-6">
                            {createdCredentialModal.email && (
                                <div className="text-xs">
                                    <span className="text-slate-400">Staff Email: </span>
                                    <strong className="text-slate-900 dark:text-white">{createdCredentialModal.email}</strong>
                                </div>
                            )}
                            <div className="text-xs flex items-center justify-between">
                                <div>
                                    <span className="text-slate-400">Temporary Password: </span>
                                    <code className="text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                        {createdCredentialModal.temporaryPassword}
                                    </code>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(createdCredentialModal.temporaryPassword)}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCreatedCredentialModal(null)}
                            className="w-full py-2.5 rounded-xl bg-[#00478d] dark:bg-blue-600 text-white text-xs font-semibold hover:bg-[#003870]"
                        >
                            Done & Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDoctors;
