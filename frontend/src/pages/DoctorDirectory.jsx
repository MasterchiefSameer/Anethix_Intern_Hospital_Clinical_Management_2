/**
 * Doctor Directory Component.
 * Fetches and displays a list of senior Indian doctors and specialists.
 * Includes search & department filter for OPD appointment booking with full Light/Dark mode support.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Stethoscope, Star, Award, CheckCircle2 } from 'lucide-react';

const mockDoctors = [
    {
        _id: '1',
        name: 'Dr. Rajesh Sharma',
        qualification: 'MBBS, MD, DM (AIIMS New Delhi)',
        specialty: 'Cardiology',
        experience: 25,
        fees: 800,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Mon, Wed, Fri',
    },
    {
        _id: '2',
        name: 'Dr. Ananya Iyer',
        qualification: 'MBBS, DNB, MRCPCH (PGIMER)',
        specialty: 'Pediatrics',
        experience: 16,
        fees: 600,
        rating: 4.95,
        image: 'https://images.unsplash.com/photo-1594824813582-71c77a3d36b2?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Mon to Sat',
    },
    {
        _id: '3',
        name: 'Dr. Vikram Malhotra',
        qualification: 'MBBS, MS (CMC Vellore), MCh',
        specialty: 'Orthopedics',
        experience: 20,
        fees: 900,
        rating: 4.85,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Tue, Thu, Sat',
    },
    {
        _id: '4',
        name: 'Dr. Priya Deshmukh',
        qualification: 'MBBS, MD (Obstetrics & Gynae, KEM Mumbai)',
        specialty: 'Gynecology & Obstetrics',
        experience: 14,
        fees: 700,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Mon to Fri',
    },
    {
        _id: '5',
        name: 'Dr. Arjun Sengupta',
        qualification: 'MBBS, MD, DM (Neurology - NIMHANS)',
        specialty: 'Neurology',
        experience: 18,
        fees: 1000,
        rating: 4.92,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Mon, Wed, Sat',
    },
    {
        _id: '6',
        name: 'Dr. Sunita Kulkarni',
        qualification: 'MBBS, MD (Dermatology, Grant Medical College)',
        specialty: 'Dermatology',
        experience: 12,
        fees: 500,
        rating: 4.88,
        image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
        availableDays: 'Tue, Thu, Fri',
    },
];

const DoctorDirectory = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setDoctors(mockDoctors);
        setLoading(false);
    }, []);

    const specialties = ['All', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Gynecology & Obstetrics', 'Neurology', 'Dermatology'];

    const filteredDoctors = doctors.filter((doc) => {
        const matchesSearch =
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty =
            selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200/60 dark:border-blue-800">
                        <Stethoscope size={14} />
                        <span>Visheshagya Chikitsak • Verified Specialists</span>
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Our Senior Doctors & Specialists
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto text-base">
                        Book an online consultation or hospital OPD appointment with leading doctors from AIIMS, NIMHANS, and top medical institutes across India.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                            type="text"
                            placeholder="Doctor ka naam ya bimari search karein..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>

                    {/* Specialty Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {specialties.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialty(spec)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedSpecialty === spec
                                        ? 'bg-[#00478d] dark:bg-blue-600 text-white shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Doctors Grid */}
                {loading ? (
                    <div className="text-center text-[#00478d] dark:text-blue-400 text-lg py-12">Doctors loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm flex-shrink-0"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                                            <Star size={14} className="fill-amber-400 text-amber-400" />
                                            <span>{doctor.rating}</span>
                                            <span className="text-slate-400 dark:text-slate-500 font-normal">({doctor.experience} yrs exp)</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                            {doctor.name}
                                        </h3>
                                        <p className="text-xs font-semibold text-[#00478d] dark:text-blue-400 mt-0.5">
                                            {doctor.specialty}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                            {doctor.qualification}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 mt-auto">
                                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl mb-4 text-xs space-y-1.5 border border-slate-100 dark:border-slate-700/60">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">OPD Days:</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-200">{doctor.availableDays}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500 dark:text-slate-400">Consultation Fee:</span>
                                            <span className="font-bold text-[#006a63] dark:text-emerald-400">₹{doctor.fees}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/book/${doctor._id}`}
                                        className="block w-full text-center bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition-all"
                                    >
                                        Book OPD Appointment
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
