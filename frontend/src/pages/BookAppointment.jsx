/**
 * Book an Appointment Multi-step Wizard Component.
 * Features live doctor data from MongoDB API, date constraints (no past dates),
 * real-time slot capacity check (Max 3 per slot), and live API booking persistence.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar as CalendarIcon,
    User,
    Phone,
    Mail,
    FileText,
    CreditCard,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    X,
    Building,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { allDoctorsData } from './DoctorDirectory';

const departmentsList = [
    { id: 'Cardiology', name: 'Cardiology (Heart Care)' },
    { id: 'Orthopedics', name: 'Orthopedics & Joint Replacement' },
    { id: 'Neurology', name: 'Neurology & Brain Spine' },
    { id: 'Pediatrics', name: 'Pediatrics & Child Care' },
    { id: 'Dermatology', name: 'Dermatology & Skin' },
    { id: 'General Medicine', name: 'General Medicine & Health' },
];

const availableTimeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '04:30 PM'
];

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Doctors state from backend
    const [doctorsList, setDoctorsList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('Cardiology');

    // Multi-Step Form State
    const [currentStep, setCurrentStep] = useState(2);

    // Date & Time Picker State (Constrained to today and future)
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM');
    const [slotAvailability, setSlotAvailability] = useState({});

    // Patient Details State
    const [patientDetails, setPatientDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        reason: 'Regular consultation and health review',
    });

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Fetch doctors from backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors`);
                const list = Array.isArray(data) ? data : data.doctors || [];
                if (list.length > 0) {
                    setDoctorsList(list);
                    const matched = list.find((d) => d._id === doctorId) || list[0];
                    setSelectedDoctor(matched);
                    setSelectedDepartment(matched.specialty || 'Cardiology');
                } else {
                    setDoctorsList(allDoctorsData);
                    setSelectedDoctor(allDoctorsData[0]);
                }
            } catch (err) {
                console.warn('Using fallback doctors for booking wizard:', err);
                setDoctorsList(allDoctorsData);
                const matched = allDoctorsData.find((d) => d._id === doctorId) || allDoctorsData[0];
                setSelectedDoctor(matched);
            }
        };
        fetchDoctors();
    }, [doctorId]);

    // Fetch Slot Availability for selected doctor and date
    const fetchSlotAvailability = useCallback(async () => {
        if (!selectedDoctor?._id || !selectedDate) return;
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/slots-availability?doctorId=${selectedDoctor._id}&date=${selectedDate}`);
            if (data?.slotCounts) {
                setSlotAvailability(data.slotCounts);
            }
        } catch (err) {
            console.warn('Could not fetch slot availability:', err);
        }
    }, [selectedDoctor, selectedDate]);

    useEffect(() => {
        fetchSlotAvailability();

        // 🚀 Real-time WebSocket listener for live slot capacity updates
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        socket.on('slotUpdated', (data) => {
            if (!selectedDoctor?._id || !selectedDate) return;
            const targetDocId = data.doctorId?._id || data.doctorId;
            if (targetDocId === selectedDoctor._id && data.date === selectedDate) {
                fetchSlotAvailability();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchSlotAvailability, selectedDoctor, selectedDate]);

    const handleNextStep = () => {
        if (currentStep === 1 && !selectedDepartment) {
            toast.error('Select Department', { description: 'Please choose a department.' });
            return;
        }
        if (currentStep === 2) {
            if (!selectedDate || !selectedTimeSlot) {
                toast.error('Select Date & Time', { description: 'Please select a date and preferred time slot.' });
                return;
            }
            if (new Date(selectedDate) < new Date(todayStr)) {
                toast.error('Invalid Date', { description: 'Cannot book appointment for a past date.' });
                return;
            }
            if ((slotAvailability[selectedTimeSlot] || 0) >= 3) {
                toast.error('Slot Full', { description: 'This slot is full (3/3). Please pick another slot.' });
                return;
            }
        }
        if (currentStep === 3 && (!patientDetails.name || !patientDetails.phone)) {
            toast.error('Incomplete Details', { description: 'Please provide patient name and contact phone number.' });
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    // Final Booking and Real Backend API Submit
    const handleFinalBooking = async () => {
        setIsProcessingPayment(true);

        try {
            const token = user?.token || user?.rest?.token;
            const config = {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            };

            const payload = {
                doctor: selectedDoctor?._id,
                date: selectedDate,
                time: selectedTimeSlot,
                reason: patientDetails.reason,
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments`, payload, config);

            toast.success('Appointment Confirmed & Scheduled!', {
                description: `Confirmed with ${selectedDoctor?.name} on ${selectedDate} at ${selectedTimeSlot}.`,
            });

            navigate('/dashboard');
        } catch (err) {
            console.error('Appointment booking error:', err);
            toast.error('Booking Failed', {
                description: err.response?.data?.message || 'Server error while scheduling appointment.',
            });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const stepsConfig = [
        { step: 1, label: 'Department' },
        { step: 2, label: 'Date & Time' },
        { step: 3, label: 'Patient Info' },
        { step: 4, label: 'Confirmation' },
    ];

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#00478d] dark:text-blue-400">
                    <span>MedTrust Portal</span>
                </Link>
                <button
                    onClick={() => navigate('/doctors')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={16} />
                    <span>Cancel Booking</span>
                </button>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
                {/* Header Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Book an Appointment
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Follow the steps below to schedule your visit with MedTrust Healthcare.
                    </p>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center justify-center max-w-xl mx-auto mb-10">
                    {stepsConfig.map((item, idx) => {
                        const isActive = currentStep === item.step;
                        const isCompleted = currentStep > item.step;
                        return (
                            <React.Fragment key={item.step}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${isActive
                                            ? 'bg-[#00478d] dark:bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                                            : isCompleted
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                                            }`}
                                    >
                                        {isCompleted ? <Check size={16} /> : item.step}
                                    </div>
                                    <span
                                        className={`text-[11px] font-semibold mt-1.5 ${isActive
                                            ? 'text-[#00478d] dark:text-blue-400 font-bold'
                                            : isCompleted
                                                ? 'text-slate-700 dark:text-slate-300'
                                                : 'text-slate-400 dark:text-slate-500'
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                                {idx < 3 && (
                                    <div
                                        className={`w-14 sm:w-20 h-0.5 mx-2 -mt-5 transition-colors ${currentStep > idx + 1
                                            ? 'bg-[#00478d] dark:bg-blue-600'
                                            : 'bg-slate-200 dark:bg-slate-800'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* STEP 1: Department Selection */}
                {currentStep === 1 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Select Medical Department
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Choose the department or specialty you need consultation for:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                            {departmentsList.map((dept) => (
                                <button
                                    key={dept.id}
                                    type="button"
                                    onClick={() => setSelectedDepartment(dept.id)}
                                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${selectedDepartment === dept.id
                                        ? 'border-[#00478d] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-[#00478d] dark:text-blue-300 font-semibold shadow-sm'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span className="text-sm">{dept.name}</span>
                                    {selectedDepartment === dept.id && (
                                        <CheckCircle2 size={18} className="text-[#00478d] dark:text-blue-400" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all"
                            >
                                <span>Continue to Date & Time</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Date & Time Picker (Past Dates Disabled + Real Capacity) */}
                {currentStep === 2 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Select Consultation Date & Time Slot
                            </h2>
                            {selectedDoctor && (
                                <div className="text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950 text-[#00478d] dark:text-blue-300 rounded-lg">
                                    Doctor: {selectedDoctor.name}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
                            {/* Left Side: Date Picker Input with min constraint */}
                            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                                    Appointment Date * (No past dates)
                                </label>
                                <input
                                    type="date"
                                    min={todayStr}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#00478d]"
                                />
                                <p className="text-[11px] text-slate-400 mt-2">
                                    Selected: <strong>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                                </p>
                            </div>

                            {/* Right Side: Available Times Grid with Capacity Indicator */}
                            <div className="md:col-span-7">
                                <div className="bg-slate-50/75 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={15} className="text-[#00478d] dark:text-blue-400" />
                                            <span>OPD Time Slots</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400">Max 3 Patients / Slot</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        {availableTimeSlots.map((slot) => {
                                            const isSelected = selectedTimeSlot === slot;
                                            const bookedCount = slotAvailability[slot] || 0;
                                            const isFull = bookedCount >= 3;

                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    disabled={isFull}
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all relative flex flex-col items-center justify-center gap-0.5 ${isFull
                                                        ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                                                        : isSelected
                                                            ? 'bg-[#00478d] dark:bg-blue-600 border-[#00478d] dark:border-blue-600 text-white shadow-sm'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <span>{slot}</span>
                                                    <span className="text-[9px] font-normal opacity-80">
                                                        {isFull ? 'Slot Full (3/3)' : `${3 - bookedCount} Slots Left`}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                <span>Continue to Details</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Patient Details */}
                {currentStep === 3 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Patient Information & Symptoms
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Confirm your contact details so our clinic desk can send SMS token and OPD receipts.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Patient Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={patientDetails.name}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                                        placeholder="e.g. Ramesh Sharma"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Phone Number * (+91)
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={patientDetails.phone}
                                        onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                                        placeholder="9876543210"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                    Reason for Visit / Symptoms *
                                </label>
                                <textarea
                                    rows={3}
                                    value={patientDetails.reason}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
                                    placeholder="Describe your symptoms or reason for consulting the doctor..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                <span>Proceed to Confirmation</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Confirmation & Instant OPD Booking */}
                {currentStep === 4 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Review & Confirm Appointment
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Please verify your appointment slot and patient summary before confirming:
                        </p>

                        {/* Summary Card */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Doctor / Specialist:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{selectedDoctor?.name} ({selectedDoctor?.specialty})</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Department:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDepartment}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Date & Slot:</span>
                                <span className="font-bold text-[#00478d] dark:text-blue-400">{selectedDate} at {selectedTimeSlot}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Patient:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{patientDetails.name} ({patientDetails.phone})</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Consultation Fee:</span>
                                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">₹{selectedDoctor?.fees || 500}</span>
                            </div>
                        </div>

                        {/* Trust badge */}
                        <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl text-xs text-[#00478d] dark:text-blue-300 mb-6">
                            <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
                            <span>100% Free cancellation up to 2 hours before the appointment.</span>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                disabled={isProcessingPayment}
                                onClick={handleFinalBooking}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] text-white px-8 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
                            >
                                <CreditCard size={15} />
                                <span>{isProcessingPayment ? 'Confirming Appointment...' : `Pay ₹${selectedDoctor?.fees || 500} & Confirm`}</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookAppointment;
