/**
 * Book Appointment Component.
 * Form for patients to schedule an appointment with a specific doctor.
 * Includes the Fake Razorpay payment flow integration logic.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async (appointmentId, amount) => {
        // --- Fake Razorpay Flow ---
        // In a real application, you would load the Razorpay SDK script, 
        // call the /api/payment/create-order endpoint, and open the Razorpay checkout.
        
        try {
            console.log(`Processing fake payment for appointment: ${appointmentId}`);
            
            // Simulating API call to verify payment
            // const { data } = await axios.post('/api/payment/verify', { appointmentId, razorpayPaymentId: 'fake_pay_123' })
            
            alert('Payment Successful! Appointment Confirmed.');
            navigate('/dashboard'); // Redirect to patient dashboard
        } catch (error) {
            console.error('Payment failed', error);
            alert('Payment failed. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // TODO: API call to create appointment
            // const { data } = await axios.post('/api/appointments', { doctor: doctorId, date, time, reason });
            
            console.log('Appointment details:', { doctorId, date, time, reason });
            const mockAppointmentId = 'app_12345';
            const mockFee = 500; // This should come from the doctor's details
            
            // Trigger payment flow after booking
            await handlePayment(mockAppointmentId, mockFee);
            
        } catch (error) {
            console.error('Failed to book appointment', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary py-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-lg bg-card p-8 rounded-2xl shadow-lg border border-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Book Appointment</h2>
                    <p className="text-muted-foreground mt-2">Fill in the details to schedule your visit</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                        <input 
                            type="date" 
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Time Slot</label>
                        <select 
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                        >
                            <option value="">Select a time</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="04:30 PM">04:30 PM</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Reason for Visit</label>
                        <textarea 
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none h-24"
                            placeholder="Briefly describe your symptoms..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Book & Pay ₹500'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
