/**
 * Departments & Clinical Services Page.
 * Displays specialized departments, treatments, diagnostic facilities,
 * and quick links to book an OPD consultation or view specialists.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HeartPulse,
    Brain,
    Baby,
    Bone,
    Sparkles,
    Stethoscope,
    Activity,
    ShieldPlus,
    ArrowRight,
    CheckCircle2,
    Calendar,
    Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const departments = [
    {
        id: 'cardiology',
        name: 'Cardiology (Heart Care)',
        tagline: 'Comprehensive Cardiac Care & Intervention',
        icon: HeartPulse,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
        doctorsCount: '8 Senior Specialists',
        description: 'Advanced catheterization lab, 24/7 emergency primary angioplasty, heart failure clinic, and non-invasive cardiac diagnostics (ECHO, TMT, Holter).',
        services: ['Angiography & Angioplasty', 'Pacemaker Implantation', 'Echocardiography (2D/4D)', 'Preventive Cardiac Health'],
        leadDoctor: 'Dr. Rajesh Sharma (AIIMS New Delhi)',
        badge: '24/7 Heart Attack Seva',
    },
    {
        id: 'orthopedics',
        name: 'Orthopedics & Joint Replacement',
        tagline: 'Robotic Joint Surgeries & Trauma Care',
        icon: Bone,
        color: 'text-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        doctorsCount: '6 Orthopedic Surgeons',
        description: 'Pioneering robotic knee and hip replacements, arthroscopic sports injury treatments, complex spine surgeries, and fracture clinics.',
        services: ['Robotic Knee Replacement', 'Spine & Disc Surgery', 'Arthroscopy & Sports Med', 'Fracture & Trauma Rehab'],
        leadDoctor: 'Dr. Vikram Malhotra (CMC Vellore)',
        badge: 'Robotic Center of Excellence',
    },
    {
        id: 'neurology',
        name: 'Neurology & Neuro Surgery',
        tagline: 'Brain, Spine & Nerve Specialities',
        icon: Brain,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
        doctorsCount: '5 Neuro Specialists',
        description: 'Comprehensive care for stroke management with thrombolysis, epilepsy clinic, Parkinson’s management, brain tumor and micro-neurosurgery.',
        services: ['Acute Stroke ICU', 'Epilepsy & EEG Monitoring', 'Brain & Spine Tumors', 'Neuro-Rehabilitation'],
        leadDoctor: 'Dr. Arjun Sengupta (NIMHANS)',
        badge: 'NABH Certified Stroke Unit',
    },
    {
        id: 'pediatrics',
        name: 'Pediatrics & Neonatal Care (NICU)',
        tagline: 'Compassionate Care for Newborns & Children',
        icon: Baby,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        doctorsCount: '7 Pediatricians',
        description: 'Level-3 NICU & PICU, pediatric immunization, newborn intensive care, child nutrition counselling, and adolescent medicine.',
        services: ['Level-3 NICU Care', 'Vaccination & Wellness', 'Pediatric Pulmonology', 'Child Growth Milestones'],
        leadDoctor: 'Dr. Ananya Iyer (PGIMER)',
        badge: 'Level-3 NICU Available',
    },
    {
        id: 'dermatology',
        name: 'Dermatology & Skin Aesthetics',
        tagline: 'Clinical Dermatology & Laser Care',
        icon: Sparkles,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
        doctorsCount: '4 Dermatologists',
        description: 'Specialized diagnosis and treatment of chronic psoriasis, vitiligo, eczema, acne scar treatments, hair restoration, and medical lasers.',
        services: ['Laser Skin Rejuvenation', 'Acne & Scar Therapy', 'Hair Loss & PRP', 'Allergy & Patch Testing'],
        leadDoctor: 'Dr. Sunita Kulkarni (Grant Medical)',
        badge: 'Advanced Laser Tech',
    },
    {
        id: 'general-medicine',
        name: 'General Medicine & Diabetology',
        tagline: 'Primary Care, Lifestyle & Chronic Disease',
        icon: Stethoscope,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        doctorsCount: '10 Physicians',
        description: 'Comprehensive management of diabetes, hypertension, infectious diseases (Dengue, Typhoid), thyroid disorders, and preventive full body checkups.',
        services: ['Diabetes Management', 'Hypertension & Lipid Care', 'Infectious Disease Control', 'Annual Health Packages'],
        leadDoctor: 'Dr. Priya Deshmukh (KEM Mumbai)',
        badge: 'Preventive Health Desk',
    },
];

const Departments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleBookClick = (departmentName) => {
        if (!user) {
            toast.info('Sign in Required', {
                description: 'Please sign in or create an account to book your OPD consultation.',
            });
            navigate('/login', { state: { from: { pathname: '/doctors' } } });
        } else {
            navigate('/doctors');
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* Hero Header */}
            <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-16 px-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00478d 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200/60 dark:border-blue-800 shadow-sm">
                        <ShieldPlus size={14} />
                        <span>Clinical Centres of Excellence</span>
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Specialized Clinical <span className="text-[#00478d] dark:text-blue-400">Departments & Services</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Explore our super-speciality departments equipped with state-of-the-art medical technology,
                        renowned AIIMS and NIMHANS specialists, and 24/7 dedicated critical care.
                    </p>
                </div>
            </section>

            {/* Departments Grid */}
            <section className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departments.map((dept) => {
                        const Icon = dept.icon;
                        return (
                            <div
                                key={dept.id}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,71,141,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col p-6 sm:p-7 group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-13 h-13 rounded-2xl p-3 flex items-center justify-center border shadow-sm ${dept.bgColor}`}>
                                        <Icon size={26} className={dept.color} />
                                    </div>
                                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {dept.badge}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#00478d] dark:group-hover:text-blue-400 transition-colors">
                                    {dept.name}
                                </h2>
                                <p className="text-xs font-semibold text-[#00478d] dark:text-blue-400 mt-1 mb-3">
                                    {dept.tagline}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-5">
                                    {dept.description}
                                </p>

                                {/* Key Treatments List */}
                                <div className="space-y-2 mb-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                                        Key Services & Procedures:
                                    </span>
                                    {dept.services.map((srv, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                                            <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                                            <span>{srv}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Department Footer */}
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{dept.leadDoctor}</p>
                                        <p className="text-[11px]">{dept.doctorsCount}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleBookClick(dept.name)}
                                        className="inline-flex items-center gap-1.5 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex-shrink-0"
                                    >
                                        <span>Consult</span>
                                        <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Departments;
