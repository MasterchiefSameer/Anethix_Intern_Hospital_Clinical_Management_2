/**
 * Manage Appointments Component (Admin).
 * Allows Super Admin and Receptionists to view all appointments and update their status.
 */
import { useState, useEffect } from 'react';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call to /api/appointments
        const fetchAppointments = async () => {
            const mockAppointments = [
                {
                    _id: 'app_1',
                    patient: { name: 'John Doe', email: 'john@example.com' },
                    doctor: { name: 'Dr. Sarah Jenkins' },
                    date: '2026-08-15',
                    time: '10:00 AM',
                    status: 'Confirmed',
                    isPaid: true
                },
                {
                    _id: 'app_2',
                    patient: { name: 'Jane Smith', email: 'jane@example.com' },
                    doctor: { name: 'Dr. Mike Ross' },
                    date: '2026-08-20',
                    time: '02:00 PM',
                    status: 'Pending',
                    isPaid: false
                }
            ];
            setAppointments(mockAppointments);
            setLoading(false);
        };
        fetchAppointments();
    }, []);

    const updateStatus = async (id, newStatus) => {
        // TODO: Call API /api/appointments/:id/status
        setAppointments(appointments.map(app => app._id === id ? { ...app, status: newStatus } : app));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Manage Appointments</h1>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 overflow-x-auto">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Patient</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Doctor</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Date & Time</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Payment</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Status</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((app) => (
                                <tr key={app._id} className="border-b border-border hover:bg-secondary/50">
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-foreground">{app.patient.name}</p>
                                        <p className="text-sm text-muted-foreground">{app.patient.email}</p>
                                    </td>
                                    <td className="py-4 px-4 text-foreground">{app.doctor.name}</td>
                                    <td className="py-4 px-4 text-foreground">{app.date} at {app.time}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${app.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {app.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="font-semibold text-sm">{app.status}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-2">
                                        {app.status === 'Pending' && (
                                            <button onClick={() => updateStatus(app._id, 'Confirmed')} className="text-green-600 hover:underline text-sm font-medium">Approve</button>
                                        )}
                                        {app.status !== 'Cancelled' && (
                                            <button onClick={() => updateStatus(app._id, 'Cancelled')} className="text-red-600 hover:underline text-sm font-medium">Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
