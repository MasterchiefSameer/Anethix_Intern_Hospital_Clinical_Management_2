/**
 * Footer Component.
 * Displays brand info, copyright, and helpful site links with Light/Dark mode support.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#eaedf0] dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto w-full transition-colors duration-200">
            <div className="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-7xl mx-auto gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00478d] dark:bg-blue-600 flex items-center justify-center text-white">
                        <Stethoscope size={18} />
                    </div>
                    <span className="text-lg font-bold text-[#00478d] dark:text-blue-400">
                        MedTrust Healthcare
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    © {new Date().getFullYear()} MedTrust Healthcare. All rights reserved.
                </p>
                <nav className="flex flex-wrap justify-center gap-6">
                    <Link to="/about" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors">
                        About Us
                    </Link>
                    <Link to="/contact" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors">
                        Help & Contact
                    </Link>
                    <Link to="/doctors" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors">
                        Specialists
                    </Link>
                    <Link to="/staff/login" className="text-sm font-semibold text-[#00478d] dark:text-blue-400 hover:underline transition-colors">
                        Staff Portal
                    </Link>
                    <Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#00478d] dark:hover:text-blue-400 transition-colors">
                        Privacy Policy
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
