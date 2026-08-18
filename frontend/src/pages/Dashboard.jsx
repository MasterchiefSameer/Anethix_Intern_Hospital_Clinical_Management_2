/**
 * Patient Dashboard Component.
 * Displays a patient's appointment history and upcoming appointments.
 */
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call to /api/appointments/myappointments
        const fetchAppointments = async () => {
            const mockAppointments = [
                {
                    _id: 'app_1',
                    doctor: { name: 'Dr. Sarah Jenkins', specialty: 'Cardiology' },
                    date: '2026-08-15',
                    time: '10:00 AM',
                    status: 'Confirmed',
                },
                {
                    _id: 'app_2',
                    doctor: { name: 'Dr. Mike Ross', specialty: 'Neurology' },
                    date: '2026-08-20',
                    time: '02:00 PM',
                    status: 'Pending',
                }
            ];
            setAppointments(mockAppointments);
            setLoading(false);
        };
        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-8">My Dashboard</h2>
                
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-foreground mb-6">Appointment History</h3>
                    
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="py-3 px-4 font-semibold text-muted-foreground">Doctor</th>
                                        <th className="py-3 px-4 font-semibold text-muted-foreground">Specialty</th>
                                        <th className="py-3 px-4 font-semibold text-muted-foreground">Date</th>
                                        <th className="py-3 px-4 font-semibold text-muted-foreground">Time</th>
                                        <th className="py-3 px-4 font-semibold text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((app) => (
                                        <tr key={app._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                                            <td className="py-4 px-4 text-foreground font-medium">{app.doctor.name}</td>
                                            <td className="py-4 px-4 text-muted-foreground">{app.doctor.specialty}</td>
                                            <td className="py-4 px-4 text-foreground">{app.date}</td>
                                            <td className="py-4 px-4 text-foreground">{app.time}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    app.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {appointments.length === 0 && (
                                <p className="text-center text-muted-foreground py-6">No appointments found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
