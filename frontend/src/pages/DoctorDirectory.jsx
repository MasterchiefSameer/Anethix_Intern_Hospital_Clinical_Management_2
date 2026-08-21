/**
 * Doctor Directory & Specialist Search Page.
 * Matches Stitch platform design with Left Filter Sidebar (Search, Multi-specialty checkboxes, Availability radio)
 * and Specialist Cards with "View Profile" modal for guest visitors and auth-guarded "Book" button.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Star,
    MapPin,
    Calendar,
    Stethoscope,
    Award,
    CheckCircle2,
    X,
    Clock,
    Phone,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const allDoctorsData = [
    {
        _id: 'doc_1',
        name: 'Dr. Sarah Jenkins',
        specialty: 'Cardiology',
        qualification: 'MBBS, MD, DM (Cardiology - AIIMS)',
        experience: 12,
        rating: 4.9,
        reviewsCount: 120,
        clinicLocation: 'Main Hospital, Wing B',
        nextAvailable: 'Tomorrow',
        availableToday: false,
        fees: 800,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior Interventional Cardiologist with over 12 years of experience in coronary angioplasty, heart failure management, and preventive cardiology.',
        languages: 'English, Hindi',
        opdTiming: 'Mon, Wed, Fri (10:00 AM - 02:00 PM)',
    },
    {
        _id: 'doc_2',
        name: 'Dr. Marcus Chen',
        specialty: 'Orthopedics',
        qualification: 'MBBS, MS (Ortho), MCh Joint Replacement',
        experience: 14,
        rating: 4.8,
        reviewsCount: 85,
        clinicLocation: 'East Wing Clinic, Floor 2',
        nextAvailable: 'Today',
        availableToday: true,
        fees: 750,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in robotic knee and hip joint replacements, complex fractures, arthroscopic ligament reconstructions, and sports trauma.',
        languages: 'English, Hindi, Bengali',
        opdTiming: 'Mon to Sat (09:00 AM - 01:00 PM)',
    },
    {
        _id: 'doc_3',
        name: 'Dr. Emily Thorne',
        specialty: 'Neurology',
        qualification: 'MBBS, MD, DM (Neurology - NIMHANS)',
        experience: 15,
        rating: 5.0,
        reviewsCount: 210,
        clinicLocation: 'Neuro Center, Floor 4',
        nextAvailable: 'Nov 15',
        availableToday: false,
        fees: 1000,
        image: 'https://images.unsplash.com/photo-1594824813582-71c77a3d36b2?auto=format&fit=crop&w=400&q=80',
        bio: 'Renowned Neurologist specializing in acute ischemic stroke intervention, migraine clinics, Parkinson’s disease management, and epilepsy monitoring.',
        languages: 'English, Hindi, Marathi',
        opdTiming: 'Tue, Thu, Sat (11:00 AM - 04:00 PM)',
    },
    {
        _id: 'doc_4',
        name: 'Dr. Alan Ramirez',
        specialty: 'Orthopedics',
        qualification: 'MBBS, DNB (Orthopedics - CMC Vellore)',
        experience: 8,
        rating: 4.7,
        reviewsCount: 64,
        clinicLocation: 'East Wing Clinic, Room 204',
        nextAvailable: 'Today',
        availableToday: true,
        fees: 600,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Focuses on spine disorders, disc herniation, back pain management, and pediatric orthopedics.',
        languages: 'English, Hindi',
        opdTiming: 'Mon, Tue, Fri (02:00 PM - 06:00 PM)',
    },
    {
        _id: 'doc_5',
        name: 'Dr. Marcus Thorne',
        specialty: 'Pediatrics',
        qualification: 'MBBS, MD (Pediatrics - PGIMER Chandigarh)',
        experience: 10,
        rating: 4.9,
        reviewsCount: 140,
        clinicLocation: 'Child Health Wing, Floor 1',
        nextAvailable: 'Tomorrow',
        availableToday: false,
        fees: 650,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced Pediatrician managing child immunizations, newborn developmental assessments, pediatric allergies, and asthma.',
        languages: 'English, Hindi, Punjabi',
        opdTiming: 'Mon to Fri (09:00 AM - 03:00 PM)',
    },
    {
        _id: 'doc_6',
        name: 'Dr. Sunita Kulkarni',
        specialty: 'Dermatology',
        qualification: 'MBBS, MD (Dermatology - Grant Medical)',
        experience: 11,
        rating: 4.85,
        reviewsCount: 96,
        clinicLocation: 'Skin & Aesthetics Center, Floor 3',
        nextAvailable: 'Today',
        availableToday: true,
        fees: 700,
        image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Dermatologist with expertise in clinical acne management, eczema, vitiligo, anti-aging therapies, and laser skin treatments.',
        languages: 'English, Hindi, Marathi',
        opdTiming: 'Mon, Wed, Sat (10:00 AM - 02:00 PM)',
    },
];

const availableSpecialties = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const DoctorDirectory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [availabilityFilter, setAvailabilityFilter] = useState('any'); // 'any', 'today', 'week'

    // Doctor Details Modal State
    const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

    // Specialty Checkbox Handler
    const handleSpecialtyToggle = (spec) => {
        setSelectedSpecialties((prev) =>
            prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedSpecialties([]);
        setAvailabilityFilter('any');
    };

    // Filter Logic
    const filteredDoctors = useMemo(() => {
        return allDoctorsData.filter((doc) => {
            // Search Query
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                doc.name.toLowerCase().includes(query) ||
                doc.specialty.toLowerCase().includes(query) ||
                doc.clinicLocation.toLowerCase().includes(query);

            // Specialty Checkbox Filter
            const matchesSpecialty =
                selectedSpecialties.length === 0 || selectedSpecialties.includes(doc.specialty);

            // Availability Filter
            let matchesAvailability = true;
            if (availabilityFilter === 'today') {
                matchesAvailability = doc.availableToday || doc.nextAvailable.toLowerCase() === 'today';
            } else if (availabilityFilter === 'week') {
                matchesAvailability = doc.nextAvailable.toLowerCase() !== 'nov 15';
            }

            return matchesSearch && matchesSpecialty && matchesAvailability;
        });
    }, [searchQuery, selectedSpecialties, availabilityFilter]);

    // Handle "Book" button click with Auth check
    const handleBookDoctor = (doctorId) => {
        if (!user) {
            toast.info('Sign in to Book Appointment', {
                description: 'Please sign in or create an account to schedule an OPD slot with this specialist.',
            });
            navigate('/login', {
                state: { from: { pathname: `/book/${doctorId}` } },
            });
        } else {
            navigate(`/book/${doctorId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: FILTERS (Match Stitch Image 3) */}
                    <aside className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 p-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            Filters
                        </h2>

                        {/* Search Doctor */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                Search Doctor
                            </label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Name or Specialty"
                                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Specialty Checkboxes */}
                        <div className="mb-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                                Specialty
                            </label>
                            <div className="space-y-2.5">
                                {availableSpecialties.map((spec) => (
                                    <label
                                        key={spec}
                                        className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialties.includes(spec)}
                                            onChange={() => handleSpecialtyToggle(spec)}
                                            className="w-4 h-4 rounded text-[#00478d] dark:text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-[#00478d]"
                                        />
                                        <span>{spec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability Radio Buttons */}
                        <div className="mb-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">
                                Availability
                            </label>
                            <div className="space-y-2.5">
                                <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="any"
                                        checked={availabilityFilter === 'any'}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-4 h-4 text-[#00478d] dark:text-blue-600 border-slate-300 dark:border-slate-700"
                                    />
                                    <span>Any Time</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="today"
                                        checked={availabilityFilter === 'today'}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-4 h-4 text-[#00478d] dark:text-blue-600 border-slate-300 dark:border-slate-700"
                                    />
                                    <span>Available Today</span>
                                </label>
                                <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="week"
                                        checked={availabilityFilter === 'week'}
                                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                                        className="w-4 h-4 text-[#00478d] dark:text-blue-600 border-slate-300 dark:border-slate-700"
                                    />
                                    <span>Available This Week</span>
                                </label>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors"
                        >
                            Clear Filters
                        </button>
                    </aside>

                    {/* RIGHT COLUMN: OUR SPECIALISTS (Match Stitch Image 3) */}
                    <main className="lg:col-span-9">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Our Specialists
                            </h1>
                            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Showing {filteredDoctors.length} results
                            </span>
                        </div>

                        {filteredDoctors.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
                                <Stethoscope size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                                    No Specialists Found
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    Try clearing filters or changing your search terms.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="bg-[#00478d] dark:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDoctors.map((doctor) => (
                                    <div
                                        key={doctor._id}
                                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all flex flex-col items-center text-center"
                                    >
                                        {/* Doctor Avatar Image */}
                                        <div className="relative mb-4">
                                            <img
                                                src={doctor.image}
                                                alt={doctor.name}
                                                className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm"
                                            />
                                        </div>

                                        {/* Name & Specialty */}
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-[#00478d] dark:text-blue-400 mt-0.5 mb-3">
                                            {doctor.specialty}
                                        </p>

                                        {/* Rating & Reviews */}
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-2">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{doctor.rating}</span>
                                            <span className="text-slate-400">({doctor.reviewsCount} reviews)</span>
                                        </div>

                                        {/* Clinic Location */}
                                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-2 truncate max-w-full">
                                            <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                                            <span className="truncate">{doctor.clinicLocation}</span>
                                        </div>

                                        {/* Next Available Badge */}
                                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-5">
                                            <Calendar size={13} className="flex-shrink-0" />
                                            <span>Next Available: {doctor.nextAvailable}</span>
                                        </div>

                                        {/* Action Buttons: View Profile (Open to all guests) & Book (Requires Auth) */}
                                        <div className="grid grid-cols-2 gap-2.5 w-full mt-auto">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDoctorModal(doctor)}
                                                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleBookDoctor(doctor._id)}
                                                className="py-2.5 px-3 rounded-xl bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* DOCTOR DETAILS MODAL (Accessible for any guest user without login) */}
            {selectedDoctorModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 relative overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedDoctorModal(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-start gap-4 mb-6">
                            <img
                                src={selectedDoctorModal.image}
                                alt={selectedDoctorModal.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {selectedDoctorModal.name}
                                </h3>
                                <p className="text-xs font-semibold text-[#00478d] dark:text-blue-400">
                                    {selectedDoctorModal.specialty}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                    {selectedDoctorModal.qualification}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mt-1.5">
                                    <Star size={13} className="fill-amber-400 text-amber-400" />
                                    <span>{selectedDoctorModal.rating}</span>
                                    <span className="text-slate-400 font-normal">({selectedDoctorModal.reviewsCount} verified patient reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                About Specialist
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {selectedDoctorModal.bio}
                            </p>
                        </div>

                        {/* OPD Schedule & Fees Info Card */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-700 mb-6 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex justify-between">
                                <span className="text-slate-400">OPD Timings:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDoctorModal.opdTiming}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Consultation Fee:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{selectedDoctorModal.fees} (Online OPD)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Languages:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{selectedDoctorModal.languages}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Clinic Room:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-200">{selectedDoctorModal.clinicLocation}</span>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedDoctorModal(null)}
                                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const id = selectedDoctorModal._id;
                                    setSelectedDoctorModal(null);
                                    handleBookDoctor(id);
                                }}
                                className="w-1/2 py-2.5 rounded-xl bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                            >
                                <span>Book Consultation</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDirectory;
