/**
 * About Us Page Component.
 * Showcases MedTrust Hospital's legacy of care, mission, vision,
 * Indian healthcare ethos (Swasthya & Seva), and milestones with full Light/Dark mode support.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
    Flag,
    Eye,
    Award,
    ShieldCheck,
    HeartPulse,
    Users,
    Building2,
    Calendar,
    Stethoscope,
    PhoneCall,
    CheckCircle2
} from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 md:pt-20 md:pb-28 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                {/* Background dot pattern */}
                <div
                    className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00478d 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 font-semibold text-xs md:text-sm mb-6 border border-blue-200/70 dark:border-blue-800 uppercase tracking-wider">
                                <Stethoscope size={15} />
                                <span>Swasthya Seva & Dedicated Care • About Us</span>
                            </span>
                            
                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.15] tracking-tight">
                                Advancing Care,<br />
                                <span className="text-[#00478d] dark:text-blue-400">Empowering Lives.</span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                At MedTrust Hospital, we blend Vedic warmth—<em>"Apno Jaisi Dekhbhal"</em>—with
                                world-class medical science. Led by senior physicians and surgeons from premier
                                medical institutions like AIIMS and PGIMER, we deliver trustworthy, affordable,
                                and compassionate healthcare for every family across India.
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    to="/doctors"
                                    className="bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white px-7 py-3.5 rounded-lg font-medium shadow-sm hover:shadow transition-all"
                                >
                                    Meet Our Senior Doctors
                                </Link>
                                <Link
                                    to="/contact"
                                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#00478d] dark:text-blue-400 border border-slate-300 dark:border-slate-700 px-7 py-3.5 rounded-lg font-medium shadow-sm transition-all"
                                >
                                    Visit Hospital Campus
                                </Link>
                            </div>
                        </div>

                        {/* Modern Hospital Atrium / Indian Medical Staff */}
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.09)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.4)] aspect-[4/3] group border border-slate-200/80 dark:border-slate-800">
                            <img
                                alt="Modern Hospital Atrium with Doctors in Indian Hospital"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                                <div className="text-white">
                                    <span className="bg-[#00478d]/90 dark:bg-blue-600/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-md mb-2 inline-block">
                                        NABH & NABL Accredited
                                    </span>
                                    <p className="text-sm font-medium opacity-90">
                                        Multi-Speciality 500-Bed Advanced Hospital Campus
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guiding Principles Bento Grid */}
            <section className="py-20 md:py-24 bg-[#f7f9fb] dark:bg-slate-950 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#006a63] dark:text-emerald-400 font-semibold text-xs md:text-sm uppercase tracking-wider block mb-2">
                            Hamare Siddhant & Values
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            Our Guiding Principles
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
                            The foundations upon which MedTrust is built, driving our 24/7 clinical excellence,
                            transparent pricing, and compassionate patient care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mission Card (Span 2 cols) */}
                        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 md:col-span-2 relative overflow-hidden group hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all">
                            <div className="absolute -right-8 -top-8 w-48 h-48 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-center mb-6 text-[#00478d] dark:text-blue-400">
                                    <Flag size={24} className="fill-[#00478d]/20 text-[#00478d] dark:text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                    Our Mission (Hamara Sankalp)
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-4">
                                    To deliver accessible, world-class healthcare to every citizen with absolute honesty,
                                    clinical precision, and deep-rooted empathy. We believe that top-quality medical treatment
                                    is every patient's right—ensuring transparent billing, zero hidden costs, and comprehensive
                                    support from OPD consultation to recovery.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 size={16} className="text-[#006a63] dark:text-emerald-400" />
                                        100% Cashless TPA & Ayushman Desk
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 size={16} className="text-[#006a63] dark:text-emerald-400" />
                                        Ethical & Evidence-Based Treatments
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vision Card (Tertiary Dark Theme) */}
                        <div className="bg-[#244971] dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-transparent dark:border-slate-800 text-white relative overflow-hidden group hover:shadow-[0_10px_30px_rgba(36,73,113,0.3)] transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-white/15 dark:bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                                        <Eye size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Our Vision (Drishtikon)
                                    </h3>
                                    <p className="text-blue-100 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                                        To be India’s most trusted healthcare ecosystem, celebrated for groundbreaking clinical outcomes,
                                        modern robotic surgeries, and a healing touch that treats every patient like family.
                                    </p>
                                </div>
                                <div className="p-3.5 bg-white/10 dark:bg-slate-800 rounded-xl backdrop-blur-sm border border-white/10 dark:border-slate-700">
                                    <span className="text-xs text-blue-200 dark:text-blue-400 font-semibold block uppercase tracking-wider">
                                        Core Motto
                                    </span>
                                    <p className="text-sm font-semibold text-white mt-0.5">
                                        "Sarve Santu Niramaya" (May all be free from illness)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-20 md:py-24 bg-white dark:bg-slate-900 px-6 border-t border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* Left Column */}
                        <div className="md:w-1/3">
                            <div className="sticky top-24">
                                <span className="text-[#00478d] dark:text-blue-400 font-semibold text-xs uppercase tracking-wider block mb-2">
                                    Our Journey • Hamari Parampara
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5">
                                    A Legacy of Care
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
                                    From a modest single-doctor clinic in 1998 to one of the country's most respected
                                    super-speciality hospital networks, our core promise of patient-first seva remains unchanged.
                                </p>
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 h-60 relative group">
                                    <img
                                        alt="Historical Clinic in India"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-85"
                                        src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <p className="text-white text-xs font-medium">
                                            MedTrust Foundation Clinic, Est. 1998
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Timeline Milestones */}
                        <div className="md:w-2/3 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 md:left-[23px]" />

                            <div className="space-y-10">
                                {/* Milestone 1 */}
                                <div className="relative pl-12 md:pl-16 group">
                                    <div className="absolute left-0 md:left-2 top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-[#00478d] dark:border-blue-400 flex items-center justify-center z-10 group-hover:bg-[#00478d] transition-colors shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#00478d] dark:bg-blue-400 group-hover:bg-white transition-colors" />
                                    </div>
                                    <div className="bg-[#f7f9fb] dark:bg-slate-800/70 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-500 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#00478d] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                                                Year 1998
                                            </span>
                                            <span className="text-xs text-slate-400">Foundation</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            The Humble Beginning in Old Delhi
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            Founded by Dr. Rajesh Sharma (MD, AIIMS) as a 10-bed clinic dedicated to providing
                                            low-cost medical care and affordable medicines to underserved families.
                                        </p>
                                    </div>
                                </div>

                                {/* Milestone 2 */}
                                <div className="relative pl-12 md:pl-16 group">
                                    <div className="absolute left-0 md:left-2 top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-[#006a63] dark:border-emerald-400 flex items-center justify-center z-10 group-hover:bg-[#006a63] transition-colors shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#006a63] dark:bg-emerald-400 group-hover:bg-white transition-colors" />
                                    </div>
                                    <div className="bg-[#f7f9fb] dark:bg-slate-800/70 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-emerald-500 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#006a63] dark:text-emerald-400 bg-teal-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-teal-100 dark:border-emerald-900">
                                                Year 2005
                                            </span>
                                            <span className="text-xs text-slate-400">Expansion</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            Multi-Speciality & Cardiac Care Unit
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            Added 24x7 Cath-Lab, Pediatric ICU, and Orthopedic surgery wings, becoming the city’s
                                            trusted emergency trauma and critical care hub.
                                        </p>
                                    </div>
                                </div>

                                {/* Milestone 3 */}
                                <div className="relative pl-12 md:pl-16 group">
                                    <div className="absolute left-0 md:left-2 top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-[#244971] dark:border-indigo-400 flex items-center justify-center z-10 group-hover:bg-[#244971] transition-colors shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#244971] dark:bg-indigo-400 group-hover:bg-white transition-colors" />
                                    </div>
                                    <div className="bg-[#f7f9fb] dark:bg-slate-800/70 p-6 md:p-7 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#244971] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                                                Year 2015 - Present
                                            </span>
                                            <span className="text-xs text-slate-400">Next-Gen Campus</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            500+ Bed Super-Speciality Campus
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                            Inauguration of the smart digital hospital campus with robotic surgery, organ transplant
                                            fellowships, telemedicine for tier-2/3 Indian cities, and full NABH accreditation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Indian Leadership Preview */}
            <section className="py-20 bg-[#f7f9fb] dark:bg-slate-950 px-6 border-t border-slate-200/70 dark:border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-[#00478d] dark:text-blue-400 font-semibold text-xs md:text-sm uppercase tracking-wider block mb-2">
                            Senior Medical Board
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                            Meet Our Chief Medical Directors
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
                            Eminent healthcare leaders with decades of dedicated service in India's top medical institutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Doctor 1 */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all text-center p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-50 dark:border-slate-800 shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
                                    alt="Dr. Rajesh Sharma"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-semibold text-[#00478d] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-2">
                                Founder & Chief Cardiologist
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dr. Rajesh Sharma</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">MBBS, MD, DM (Cardiology - AIIMS New Delhi)</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                Over 25+ years pioneering minimally invasive valve surgeries and community heart checkup camps.
                            </p>
                        </div>

                        {/* Doctor 2 */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all text-center p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-teal-50 dark:border-slate-800 shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1594824813582-71c77a3d36b2?auto=format&fit=crop&w=400&q=80"
                                    alt="Dr. Ananya Iyer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-semibold text-[#006a63] dark:text-emerald-400 bg-teal-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full mb-2">
                                Head of Pediatrics & Neonatology
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dr. Ananya Iyer</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">MBBS, DNB, MRCPCH (PGIMER Chandigarh)</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                Renowned pediatric specialist passionate about child wellness, newborn critical care, and adolescent health.
                            </p>
                        </div>

                        {/* Doctor 3 */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all text-center p-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-indigo-50 dark:border-slate-800 shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80"
                                    alt="Dr. Vikram Malhotra"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-semibold text-[#244971] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full mb-2">
                                Director, Orthopedics & Joint Replacement
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dr. Vikram Malhotra</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">MBBS, MS (Ortho - CMC Vellore), MCh</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                Expert in robotic knee replacements and sports injury rehabilitation with 5,000+ successful joint surgeries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
