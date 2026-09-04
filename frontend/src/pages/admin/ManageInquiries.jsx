/**
 * Manage Inquiries Component (Admin / Staff Portal)
 * Displays contact form submissions with role-based filtering (Receptionist/Admin sees all, Doctor sees assigned).
 */
import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Mail,
    Phone,
    CheckCircle,
    Clock,
    UserCheck,
    Calendar,
    Eye
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const ManageInquiries = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMsg, setSelectedMsg] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = user?.token || user?.rest?.token;
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`, config);
            let fetchedMessages = [];
            if (Array.isArray(res.data)) {
                fetchedMessages = res.data;
            } else if (res.data && Array.isArray(res.data.messages)) {
                fetchedMessages = res.data.messages;
            }
            setMessages(fetchedMessages);
        } catch (error) {
            toast.error('Failed to load inquiries', {
                description: error.response?.data?.message || 'Server error',
            });
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter((m) => {
        const query = searchTerm.toLowerCase();
        const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
        return (
            fullName.includes(query) ||
            (m.email && m.email.toLowerCase().includes(query)) ||
            (m.message && m.message.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="text-[#00478d] dark:text-blue-400" />
                        <span>Public Inquiries & Messages</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {user?.role === 'Doctor'
                            ? 'Contact form submissions directed to you'
                            : 'All public website messages and OPD inquiries'}
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
                    placeholder="Search inquiry by sender name, email, or content..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500"
                />
            </div>

            {/* Messages Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        Loading public inquiries...
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No inquiries found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Sender Name</th>
                                    <th className="p-4 font-semibold">Contact Info</th>
                                    <th className="p-4 font-semibold">Assigned Doctor</th>
                                    <th className="p-4 font-semibold">Date</th>
                                    <th className="p-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredMessages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                            {msg.firstName} {msg.lastName}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                <Mail size={13} className="text-slate-400" />
                                                {msg.email}
                                            </p>
                                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-xs mt-1">
                                                <Phone size={13} className="text-slate-400" />
                                                {msg.phone}
                                            </p>
                                        </td>
                                        <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                                            {msg.relatedDoctor ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 font-semibold rounded-lg">
                                                    <UserCheck size={13} />
                                                    Dr. {msg.relatedDoctor.firstName || msg.relatedDoctor.name || 'Specialist'}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">General Desk</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedMsg(msg)}
                                                className="px-3 py-1.5 bg-[#00478d] text-white text-xs font-semibold rounded-lg hover:bg-[#003870] transition-colors inline-flex items-center gap-1.5"
                                            >
                                                <Eye size={14} />
                                                <span>Read Message</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Read Message Detail Modal */}
            {selectedMsg && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                Inquiry from {selectedMsg.firstName} {selectedMsg.lastName}
                            </h3>
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            <p><strong>Email:</strong> {selectedMsg.email}</p>
                            <p><strong>Phone:</strong> {selectedMsg.phone}</p>
                            <p>
                                <strong>Assigned To:</strong>{' '}
                                {selectedMsg.relatedDoctor
                                    ? `Dr. ${selectedMsg.relatedDoctor.firstName || selectedMsg.relatedDoctor.name}`
                                    : 'General Desk'}
                            </p>
                            <p><strong>Submitted On:</strong> {new Date(selectedMsg.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {selectedMsg.message}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelectedMsg(null)}
                                className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageInquiries;
