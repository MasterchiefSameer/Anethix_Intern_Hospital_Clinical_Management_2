/**
 * Contact Us Page Component.
 * Features 24/7 Emergency & WhatsApp bar, OPD Inquiry form with Subject dropdown,
 * Main Campus & Regional Centers, Google Maps campus view, and full Light/Dark mode support.
 */
import React, { useState } from 'react';
import {
    PhoneCall,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle2,
    ShieldAlert,
    MessageSquare,
    Building2,
    CalendarCheck,
    Map as MapIcon
} from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: 'Appointment Inquiry',
        department: 'General Medicine',
        city: 'New Delhi',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
            {/* Header / Banner */}
            <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-14 px-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#00478d 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200/60 dark:border-blue-800 shadow-sm">
                        <PhoneCall size={14} />
                        <span>24/7 Helpline & Sampark Kendra</span>
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Contact <span className="text-[#00478d] dark:text-blue-400">MedTrust Healthcare</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Need medical assistance or have a query? Hamari team 24/7 aapki seva mein uplabdh hai.
                        Reach out via phone, WhatsApp, or visit our multi-speciality campus.
                    </p>
                </div>
            </section>

            {/* Emergency & Quick Contact Bar */}
            <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-20 w-full mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Emergency 24x7 */}
                    <div className="bg-red-600 dark:bg-red-700 text-white p-5 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <ShieldAlert size={26} className="text-white" />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-red-100 block">
                                Emergency & Ambulance (24x7)
                            </span>
                            <a href="tel:108" className="text-xl font-bold tracking-tight hover:underline">
                                108 / +91-11-2345-6789
                            </a>
                        </div>
                    </div>

                    {/* OPD Appointment Desk */}
                    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#00478d] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                            <CalendarCheck size={24} />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                                OPD Booking Desk
                            </span>
                            <a href="tel:+919876543210" className="text-lg font-bold text-[#00478d] dark:text-blue-400 hover:underline">
                                +91 98765 43210
                            </a>
                        </div>
                    </div>

                    {/* WhatsApp Support */}
                    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006a63] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                                WhatsApp Assistance
                            </span>
                            <span className="text-lg font-bold text-[#006a63] dark:text-emerald-400">
                                +91 98111 22334
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content: Form & Campus Info */}
            <section className="max-w-7xl mx-auto px-6 mb-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Inquiry Form (7 cols) */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Send us a Message
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                            Fill in your details below and our patient care desk will call you within 15 minutes.
                        </p>

                        {submitted ? (
                            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                <CheckCircle2 size={48} className="text-[#006a63] dark:text-emerald-400 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    Dhanyawad! (Thank you!)
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 max-w-md mx-auto">
                                    Your request has been received. Our medical care desk will connect with you shortly on <strong>{formData.phone || formData.email || '+91-XXXXXXXXXX'}</strong>.
                                </p>
                                <button
                                    onClick={() => {
                                        setFormData({
                                            name: '',
                                            phone: '',
                                            email: '',
                                            subject: 'Appointment Inquiry',
                                            department: 'General Medicine',
                                            city: 'New Delhi',
                                            message: '',
                                        });
                                        setSubmitted(false);
                                    }}
                                    className="bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                            Patient / Caregiver Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Ramesh Kumar"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                            Mobile Number * (+91)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="e.g. 9876543210"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="e.g. ramesh@example.com"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                            Subject *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        >
                                            <option value="Appointment Inquiry">Appointment & OPD Booking Inquiry</option>
                                            <option value="Billing & Ayushman / TPA">Billing & Ayushman / TPA Insurance Help</option>
                                            <option value="Medical Records">Medical Records & Diagnostic Reports</option>
                                            <option value="Emergency Support">Emergency & Ambulance Seva</option>
                                            <option value="General Information">General Hospital Information & Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Preferred Department
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                    >
                                        <option>Cardiology (Heart Care - Dil Ka Ilaj)</option>
                                        <option>Pediatrics (Child & Newborn Care)</option>
                                        <option>Orthopedics (Bone & Joint Replacement)</option>
                                        <option>Neurology & Spine Care</option>
                                        <option>General Medicine & Health Checkup</option>
                                        <option>Ayushman Bharat / Cashless TPA Desk</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                                        Your Message / Symptoms / Query *
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Apni pareshani ya query likhein (e.g. need second opinion for cardiac bypass surgery, OPD slot timing)..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-[#00478d] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#00478d] dark:focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-lg shadow-sm hover:shadow transition-all text-sm"
                                >
                                    <Send size={16} />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Campus Locations, Map & Timings (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Main Campus Box */}
                        <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-[#00478d] dark:text-blue-400 font-bold text-lg mb-4">
                                <Building2 size={20} />
                                <h3>Main Super-Speciality Campus</h3>
                            </div>
                            <div className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-[#00478d] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <span>
                                        Plot No. 12, Institutional Area, Ring Road, Near AIIMS Metro, New Delhi, 110029, India
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <PhoneCall size={18} className="text-[#00478d] dark:text-blue-400 flex-shrink-0" />
                                    <span>+91 (011) 4567 8900 / +91 98765 43210</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-[#00478d] dark:text-blue-400 flex-shrink-0" />
                                    <span>care@medtrusthospital.in / contact@medtrust.org</span>
                                </div>
                                <div className="flex items-start gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <Clock size={18} className="text-[#006a63] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">OPD Timings:</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM</p>
                                        <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">Emergency & ICU: Open 24/7, 365 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Visual Box */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden h-56 relative group">
                            <img
                                alt="Hospital Medical District Map"
                                className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjuDSxy5_5ryZ_mTWi38FIqoOyOI3k2vXzxcKBmMd9AKOwKL1xQ0wr_UunDDy_tAe5mJlRFGCJr0HOzpgbPP5S8c1BkP8-mBmc1gntASmUTp1s1auoBleOdXSFRz73c-b70K0zT1BoJ44O11kqczxcdzqYH1TrgI1Boo9BIRsaISc8LTdgPRCtqeauOYzgR_FhzRTfDzs15qCV-FGGQ7oV5iRyHMsLIlWqEfkmisfruy8KUFlEMv0Vzw"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80";
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                    <MapIcon size={16} className="text-[#00478d] dark:text-blue-400" />
                                    <span className="text-xs font-bold text-[#00478d] dark:text-blue-400">
                                        View Campus on Google Maps
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Regional Hospital Centers */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Regional Care Centers
                            </h4>
                            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Mumbai West Campus</p>
                                    <p>Linking Road, Bandra West, Mumbai, MH - 400050</p>
                                    <p className="text-[#00478d] dark:text-blue-400 font-semibold mt-1">Tel: +91 22 2640 1122</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Bengaluru South Campus</p>
                                    <p>100ft Road, Indiranagar, Bengaluru, KA - 560038</p>
                                    <p className="text-[#00478d] dark:text-blue-400 font-semibold mt-1">Tel: +91 80 4112 3344</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
