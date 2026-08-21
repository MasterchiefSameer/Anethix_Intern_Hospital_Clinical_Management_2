/**
 * Book an Appointment Multi-step Wizard Component.
 * Matches Stitch platform design (Image 2) with Stepper Navigation:
 * Step 1: Department Selection
 * Step 2: Date & Time Picker (Interactive Calendar + Time Slot Grid)
 * Step 3: Patient Details & Symptoms
 * Step 4: Confirmation & Payment (₹500 / Free Ayushman / UPI)
 */
import React, { useState } from 'react';
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
    X
} from 'lucide-react';
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

    // Find preselected doctor if any
    const initialDoctor = allDoctorsData.find((d) => d._id === doctorId) || allDoctorsData[0];

    // Multi-Step Form State
    const [currentStep, setCurrentStep] = useState(2); // Start at Date & Time or 1 if no doctor selected
    const [selectedDepartment, setSelectedDepartment] = useState(initialDoctor.specialty || 'Cardiology');
    const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor);

    // Date & Time Picker State
    const [selectedDate, setSelectedDate] = useState(9); // Default day 9 to match Stitch mockup
    const [selectedMonth] = useState('October 2024');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:30 AM');

    // Patient Details State
    const [patientDetails, setPatientDetails] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        reason: 'Regular consultation and health review',
        notes: '',
    });

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Month calendar mock generation
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const handleNextStep = () => {
        if (currentStep === 1 && !selectedDepartment) {
            toast.error('Select Department', { description: 'Please choose a department.' });
            return;
        }
        if (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) {
            toast.error('Select Date & Time', { description: 'Please select a date and preferred time slot.' });
            return;
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

    // Final Booking and Payment Submit
    const handleFinalBooking = () => {
        setIsProcessingPayment(true);

        setTimeout(() => {
            const newAppointment = {
                _id: 'app_' + Date.now(),
                doctor: {
                    name: selectedDoctor.name,
                    specialty: selectedDoctor.specialty,
                    image: selectedDoctor.image,
                },
                department: selectedDepartment,
                date: `Oct ${selectedDate}, 2024`,
                time: selectedTimeSlot,
                patient: {
                    name: patientDetails.name,
                    email: patientDetails.email,
                    phone: patientDetails.phone,
                },
                status: 'Confirmed',
                isPaid: true,
                fee: selectedDoctor.fees || 500,
                createdAt: new Date().toISOString(),
            };

            // Save to localStorage appointment history
            try {
                const existing = JSON.parse(localStorage.getItem('medtrust_appointments') || '[]');
                existing.unshift(newAppointment);
                localStorage.setItem('medtrust_appointments', JSON.stringify(existing));
            } catch (err) {
                console.error('Error saving appointment:', err);
            }

            setIsProcessingPayment(false);
            toast.success('Appointment Confirmed!', {
                description: `Scheduled with ${selectedDoctor.name} on Oct ${selectedDate}, 2024 at ${selectedTimeSlot}.`,
            });

            navigate('/dashboard');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
            {/* Top Minimal Bar */}
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

                {/* 4-Step Stepper Navigation (Match Stitch Image 2) */}
                <div className="flex items-center justify-center max-w-xl mx-auto mb-10">
                    {[
                        { step: 1, label: 'Department' },
                        { step: 2, label: 'Date & Time' },
                        { step: 3, label: 'Details' },
                        { step: 4, label: 'Confirm' },
                    ].map((item, idx) => {
                        const isCompleted = currentStep > item.step;
                        const isActive = currentStep === item.step;
                        return (
                            <React.Fragment key={item.step}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            isCompleted
                                                ? 'bg-[#00478d] dark:bg-blue-600 text-white shadow-sm'
                                                : isActive
                                                ? 'border-2 border-[#00478d] dark:border-blue-400 text-[#00478d] dark:text-blue-400 bg-white dark:bg-slate-900 font-extrabold ring-4 ring-blue-50 dark:ring-blue-950/50'
                                                : 'border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900'
                                        }`}
                                    >
                                        {isCompleted ? <Check size={16} /> : item.step}
                                    </div>
                                    <span
                                        className={`text-[11px] font-semibold mt-1.5 ${
                                            isActive
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
                                        className={`w-14 sm:w-20 h-0.5 mx-2 -mt-5 transition-colors ${
                                            currentStep > idx + 1
                                                ? 'bg-[#00478d] dark:bg-blue-600'
                                                : 'bg-slate-200 dark:bg-slate-800'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* STEP 1: Department & Specialist Selection */}
                {currentStep === 1 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
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
                                    className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        selectedDepartment === dept.id
                                            ? 'border-[#00478d] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-[#00478d] dark:text-blue-300 font-semibold shadow-sm'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
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
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all"
                            >
                                <span>Continue to Date & Time</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Date & Time Picker (Exact Stitch Image 2) */}
                {currentStep === 2 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Select Date & Time
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
                            {/* Left Side: Interactive Month Calendar (Oct 2024) */}
                            <div className="md:col-span-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        type="button"
                                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {selectedMonth}
                                    </span>
                                    <button
                                        type="button"
                                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {dayNames.map((d) => (
                                        <span key={d} className="text-xs font-semibold text-slate-400">
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                {/* Calendar Days Grid */}
                                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                    {/* Offset for Oct 2024 (starts on Tuesday = 2 empty slots) */}
                                    <div />
                                    <div />

                                    {daysInMonth.map((day) => {
                                        const isSelected = selectedDate === day;
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => setSelectedDate(day)}
                                                className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-medium transition-all ${
                                                    isSelected
                                                        ? 'bg-[#00478d] dark:bg-blue-600 text-white font-bold shadow-md'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Side: Available Times Grid */}
                            <div className="md:col-span-6">
                                <div className="bg-slate-50/75 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
                                        <Clock size={15} className="text-[#00478d] dark:text-blue-400" />
                                        <span>Available Times on Wed, Oct {selectedDate}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        {availableTimeSlots.slice(0, 8).map((slot) => {
                                            const isSelected = selectedTimeSlot === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all relative flex items-center justify-center ${
                                                        isSelected
                                                            ? 'bg-[#00478d] dark:bg-blue-600 border-[#00478d] dark:border-blue-600 text-white shadow-sm'
                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                                    }`}
                                                >
                                                    <span>{slot}</span>
                                                    {isSelected && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white absolute top-2 right-2" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions (Match Stitch Image 2) */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                <span>Continue to Details</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Patient Details & Symptoms */}
                {currentStep === 3 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={patientDetails.email}
                                    onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                                    placeholder="patient@example.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                            >
                                <span>Proceed to Confirmation</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Confirmation & Instant OPD Booking */}
                {currentStep === 4 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
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
                                <span className="font-bold text-slate-900 dark:text-white">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Department:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDepartment}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Date & Slot:</span>
                                <span className="font-bold text-[#00478d] dark:text-blue-400">Oct {selectedDate}, 2024 at {selectedTimeSlot}</span>
                            </div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Patient:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{patientDetails.name} ({patientDetails.phone})</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Consultation Fee:</span>
                                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">₹{selectedDoctor.fees || 500}</span>
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
                                className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                disabled={isProcessingPayment}
                                onClick={handleFinalBooking}
                                className="inline-flex items-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
                            >
                                <CreditCard size={15} />
                                <span>{isProcessingPayment ? 'Confirming Appointment...' : `Pay ₹${selectedDoctor.fees || 500} & Confirm`}</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookAppointment;
