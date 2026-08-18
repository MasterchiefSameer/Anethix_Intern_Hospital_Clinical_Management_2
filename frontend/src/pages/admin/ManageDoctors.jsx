/**
 * Manage Doctors Component (Admin).
 * Allows Super Admin to view, add, edit, and remove doctors.
 */
import { useState, useEffect } from 'react';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call to /api/doctors
        const fetchDoctors = async () => {
            const mockDoctors = [
                { _id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', experience: 10, fees: 500, isActive: true },
                { _id: '2', name: 'Dr. Mike Ross', specialty: 'Neurology', experience: 8, fees: 600, isActive: true },
            ];
            setDoctors(mockDoctors);
            setLoading(false);
        };
        fetchDoctors();
    }, []);

    const handleDelete = async (id) => {
        // TODO: Call API /api/doctors/:id
        if(window.confirm('Are you sure you want to remove this doctor?')) {
            setDoctors(doctors.filter(doc => doc._id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-foreground">Manage Doctors</h1>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90">
                    + Add New Doctor
                </button>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 overflow-x-auto">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Name</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Specialty</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Experience</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Fees</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground">Status</th>
                                <th className="py-3 px-4 font-semibold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc) => (
                                <tr key={doc._id} className="border-b border-border hover:bg-secondary/50">
                                    <td className="py-4 px-4 font-medium text-foreground">{doc.name}</td>
                                    <td className="py-4 px-4 text-muted-foreground">{doc.specialty}</td>
                                    <td className="py-4 px-4 text-foreground">{doc.experience} Years</td>
                                    <td className="py-4 px-4 text-foreground">₹{doc.fees}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${doc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {doc.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-3">
                                        <button className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                                        <button onClick={() => handleDelete(doc._id)} className="text-destructive hover:underline text-sm font-medium">Remove</button>
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

export default ManageDoctors;
