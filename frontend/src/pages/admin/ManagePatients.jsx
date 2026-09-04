/**
 * Manage Patients Component (Admin / Staff Portal)
 * Allows Admins & Receptionists to view all registered patients and their history.
 * Doctors view patients linked to their appointments.
 */
import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Eye,
    Calendar,
    Phone,
    Mail,
    X,
    UserCheck,
    Clock,
    FileText
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const ManagePatients = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const token = user?.token || user?.rest?.token;
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/patients`, config);
            let fetchedPatients = [];
            if (Array.isArray(res.data)) {
                fetchedPatients = res.data;
            } else if (res.data && Array.isArray(res.data.patients)) {
                fetchedPatients = res.data.patients;
            }
            setPatients(fetchedPatients);
        } catch (error) {
            toast.error('Failed to load patient directory', {
                description: error.response?.data?.message || 'Server error',
            });
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPatient = async (patient) => {
        setSelectedPatient(patient);
        try {
            setLoadingHistory(true);
            const token = user?.token || user?.rest?.token;
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment`, config);
            const allAppointments = res.data || [];
            // Filter history for this patient
            const patientAppts = allAppointments.filter(
                (a) => (a.patient?._id || a.patient) === patient._id
            );
            setPatientHistory(patientAppts);
        } catch (error) {
            console.error('Error fetching patient appointment history:', error);
            setPatientHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const filteredPatients = patients.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.email && p.email.toLowerCase().includes(query)) ||
            (p.phone && p.phone.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="text-[#00478d] dark:text-blue-400" />
                        <span>Patients Directory</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {user?.role === 'Doctor'
                            ? 'Patients registered in your appointments'
                            : 'All registered hospital patients'}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patient by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500"
                />
            </div>

            {/* Patient Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Loading patients directory...
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No patients found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Patient Name</th>
                                    <th className="p-4 font-semibold">Contact Info</th>
                                    <th className="p-4 font-semibold">Gender / Blood Group</th>
                                    <th className="p-4 font-semibold">Registered Date</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                                                    {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                                                    <p className="text-xs text-slate-400">ID: {patient._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Mail size={13} className="text-slate-400" />
                                                {patient.email}
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs mt-1">
                                                <Phone size={13} className="text-slate-400" />
                                                {patient.phone || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                                            <span>{patient.gender || 'Unspecified'}</span>
                                            {patient.bloodGroup && (
                                                <span className="ml-2 px-2 py-0.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-md font-semibold">
                                                    {patient.bloodGroup}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(patient.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleViewPatient(patient)}
                                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#00478d] dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <Eye size={14} />
                                                <span>View History</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Patient Detail & History Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00478d] text-white font-bold flex items-center justify-center">
                                    {selectedPatient.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                        {selectedPatient.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {selectedPatient.email} | {selectedPatient.phone || 'No phone'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Patient Profile Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs">
                            <div>
                                <span className="text-slate-400 block">Gender:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.gender || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Blood Group:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.bloodGroup || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block">City:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPatient.city || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Appointment History Section */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Calendar size={16} className="text-[#00478d] dark:text-blue-400" />
                                <span>Appointment History</span>
                            </h4>

                            {loadingHistory ? (
                                <p className="text-xs text-slate-400">Loading appointments history...</p>
                            ) : patientHistory.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No past appointments found for this patient.</p>
                            ) : (
                                <div className="space-y-2">
                                    {patientHistory.map((appt) => (
                                        <div
                                            key={appt._id}
                                            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                    Dr. {appt.doctor?.name || 'Assigned Specialist'}
                                                </p>
                                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {appt.appointmentDate} at {appt.appointmentTime}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full font-semibold ${
                                                appt.status === 'Completed'
                                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                    : appt.status === 'Cancelled'
                                                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                            }`}>
                                                {appt.status || 'Scheduled'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatients;
