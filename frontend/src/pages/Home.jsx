/**
 * Home Page Component.
 * Implements the MedTrust hospital landing page with Hero section,
 * Stats counter bento grid, and Premium Services showcase with full Light/Dark mode support.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle2,
    Users,
    Clock,
    Smile,
    Award,
    HeartPulse,
    Baby,
    Activity,
    ArrowRight,
    ShieldCheck,
    PhoneCall
} from 'lucide-react';

const stats = [
    {
        icon: Users,
        value: '50+',
        label: 'Senior Indian Doctors (AIIMS/PGI)',
    },
    {
        icon: Clock,
        value: '24/7',
        label: 'Emergency & ICU Seva',
    },
    {
        icon: Smile,
        value: '15k+',
        label: 'Happy Patients Treated',
    },
    {
        icon: Award,
        value: '20+',
        label: 'Years of Medical Trust',
    },
];

const services = [
    {
        title: 'Cardiology (Heart Care)',
        subtitle: 'Dil Ki Dekhbhal',
        description:
            'Advanced heart care with 24x7 Cath Lab, angioplasty, pacemaker implants, and preventive cardiac wellness led by senior cardiologists.',
        icon: HeartPulse,
        iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 group-hover:bg-[#00478d] dark:group-hover:bg-blue-600 group-hover:text-white',
        linkColor: 'text-[#00478d] dark:text-blue-400',
        path: '/doctors',
    },
    {
        title: 'Pediatrics (Shishu Rog)',
        subtitle: 'Bacchon Ki Dekhbhal',
        description:
            'Compassionate child care, newborn NICU, vaccination schedules, and growth consultations delivered by experienced pediatricians.',
        icon: Baby,
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#006a63] dark:text-emerald-400 group-hover:bg-[#006a63] dark:group-hover:bg-emerald-600 group-hover:text-white',
        linkColor: 'text-[#006a63] dark:text-emerald-400',
        path: '/doctors',
    },
    {
        title: 'Orthopedics & Joint Care',
        subtitle: 'Haddi Aur Jod Ka Ilaj',
        description:
            'Expert treatment for arthritis, fractures, and advanced robotic knee/hip replacement surgeries for pain-free mobility.',
        icon: Activity,
        iconBg: 'bg-slate-100 dark:bg-slate-800 text-[#244971] dark:text-indigo-400 group-hover:bg-[#244971] dark:group-hover:bg-indigo-600 group-hover:text-white',
        linkColor: 'text-[#244971] dark:text-indigo-400',
        path: '/doctors',
    },
];

const Home = () => {
    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            {/* Top Announcement / Emergency Ticker */}
            <div className="bg-[#002f60] dark:bg-slate-900 border-b border-blue-900 dark:border-slate-800 text-blue-100 dark:text-slate-300 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1 text-emerald-300 dark:text-emerald-400 font-semibold">
                    <ShieldCheck size={14} /> NABH & NABL Accredited Multi-Speciality Hospital
                </span>
                <span className="hidden sm:inline opacity-40">•</span>
                <span>Ayushman Bharat & All Major TPA Cashless Insurance Accepted</span>
                <span className="hidden sm:inline opacity-40">•</span>
                <a href="tel:108" className="inline-flex items-center gap-1 text-white dark:text-blue-300 font-bold hover:underline">
                    <PhoneCall size={12} className="text-red-400" /> 24x7 Helpline: 108 / +91 11 4567 8900
                </a>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#f7f9fb] dark:bg-slate-950 pt-8 pb-16 md:pt-14 md:pb-24">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 dark:bg-blue-900/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left Column: Hero Content */}
                    <div className="flex flex-col items-start gap-6">
                        {/* Excellence Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#006a63] dark:text-emerald-300 rounded-full text-xs md:text-sm font-medium border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                            <CheckCircle2 size={16} className="text-[#006a63] dark:text-emerald-400" />
                            <span>Excellence in Indian Healthcare • Seva & Trust</span>
                        </div>

                        {/* Hero Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                            Aapka Swasthya,<br />
                            <span className="text-[#00478d] dark:text-blue-400">Hamari Prathamikta.</span>
                        </h1>

                        {/* Hero Subtitle */}
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                            Providing world-class medical care with Indian warmth and clinical precision.
                            Consult top specialist doctors from AIIMS & top medical colleges with seamless online OPD booking.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mt-2 w-full sm:w-auto">
                            <Link
                                to="/doctors"
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                            >
                                Book OPD Appointment
                            </Link>
                            <Link
                                to="/about"
                                className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#00478d] dark:text-blue-400 border border-slate-300 dark:border-slate-700 font-medium px-8 py-3.5 rounded-lg shadow-sm transition-all duration-200"
                            >
                                About Our Hospital
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Hero Image with Indian Healthcare Visual */}
                    <div className="relative h-[360px] sm:h-[440px] md:h-[480px] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-800 group">
                        <img
                            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80"
                            alt="Indian Doctor team in hospital corridor"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80";
                            }}
                        />
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/60 dark:border-slate-700/60 shadow-md">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                👨‍⚕️ 500+ Bed Multi-Speciality Care Center • New Delhi & Mumbai
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                24x7 In-house Pharmacy, Pathology Labs & Cardiac ICU
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overlapping Stats Section */}
            <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-8 md:-mt-10 mb-16 md:mb-20 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="text-[#006a63] dark:text-emerald-400 mb-3">
                                    <IconComponent size={28} />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#00478d] dark:text-blue-400 tracking-tight">
                                    {item.value}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 font-medium">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Premium Services Section */}
            <section className="py-16 md:py-24 bg-[#f7f9fb] dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <span className="text-[#00478d] dark:text-blue-400 font-semibold text-xs md:text-sm uppercase tracking-wider block mb-2">
                            Mukhya Chikitsa Vibhag
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            Our Super-Speciality Services
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
                            Comprehensive healthcare services under one roof with advanced technology and caring specialists.
                        </p>
                    </div>

                    {/* Services Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const ServiceIcon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 hover:shadow-[0_10px_30px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col items-start"
                                >
                                    <div
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${service.iconBg}`}
                                    >
                                        <ServiceIcon size={26} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                                        {service.subtitle}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                                        {service.description}
                                    </p>
                                    <Link
                                        to={service.path}
                                        className={`font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all ${service.linkColor}`}
                                    >
                                        <span>Consult Specialist</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
