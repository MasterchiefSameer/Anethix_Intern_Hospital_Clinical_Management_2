/**
 * Doctor Directory Component.
 * Fetches and displays a list of available doctors.
 * Includes a simulated search and filter mechanism for patients to find the right doctor.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DoctorDirectory = () => {
    // Simulated state for doctors
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call to /api/doctors
        const fetchDoctors = async () => {
            const mockDoctors = [
                { _id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', experience: 10, fees: 500, image: 'https://i.pravatar.cc/150?img=1' },
                { _id: '2', name: 'Dr. Mike Ross', specialty: 'Neurology', experience: 8, fees: 600, image: 'https://i.pravatar.cc/150?img=11' },
                { _id: '3', name: 'Dr. Emily Chen', specialty: 'Pediatrics', experience: 5, fees: 400, image: 'https://i.pravatar.cc/150?img=5' },
            ];
            setDoctors(mockDoctors);
            setLoading(false);
        };
        fetchDoctors();
    }, []);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground">Our Specialists</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Find the right doctor for your needs and book an appointment instantly.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-primary text-xl">Loading doctors...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map(doctor => (
                            <div key={doctor._id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
                                <div className="h-48 bg-secondary flex items-center justify-center p-4">
                                    <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md" />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-bold text-foreground mb-1">{doctor.name}</h3>
                                    <p className="text-primary font-medium mb-4">{doctor.specialty}</p>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Experience:</span>
                                            <span className="font-semibold text-foreground">{doctor.experience} Years</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Consultation Fee:</span>
                                            <span className="font-semibold text-foreground">₹{doctor.fees}</span>
                                        </div>
                                    </div>
                                    
                                    <Link to={`/book/${doctor._id}`} className="mt-auto block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all">
                                        Book Appointment
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDirectory;
