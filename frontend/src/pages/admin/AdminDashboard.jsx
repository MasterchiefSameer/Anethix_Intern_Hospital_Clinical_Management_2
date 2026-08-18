/**
 * Admin Dashboard Page.
 * Provides a high-level overview of hospital metrics (appointments, revenue, active doctors).
 */
const AdminDashboard = () => {
    // Simulated data
    const metrics = [
        { title: 'Total Appointments Today', value: '42', color: 'text-blue-500', bg: 'bg-blue-100' },
        { title: 'Active Doctors', value: '18', color: 'text-green-500', bg: 'bg-green-100' },
        { title: 'New Patients (This Week)', value: '124', color: 'text-purple-500', bg: 'bg-purple-100' },
        { title: 'Total Revenue (Today)', value: '₹21,000', color: 'text-emerald-500', bg: 'bg-emerald-100' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${metric.bg}`}>
                            <span className={`text-2xl font-bold ${metric.color}`}>~</span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{metric.title}</p>
                            <h3 className="text-2xl font-bold text-foreground mt-1">{metric.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                        <div>
                            <p className="font-semibold text-foreground">New Appointment Booked</p>
                            <p className="text-sm text-muted-foreground">Patient: John Doe | Doctor: Dr. Smith</p>
                        </div>
                        <span className="text-xs text-muted-foreground">5 mins ago</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                        <div>
                            <p className="font-semibold text-foreground">Payment Received</p>
                            <p className="text-sm text-muted-foreground">Amount: ₹500 | Via Razorpay</p>
                        </div>
                        <span className="text-xs text-muted-foreground">15 mins ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
