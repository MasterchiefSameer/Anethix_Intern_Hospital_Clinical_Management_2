/**
 * Admin & Staff Layout Component.
 * Dynamic role-aware sidebar for Super Admins, Receptionists, and Doctors.
 */
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Stethoscope,
    Calendar,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Plus,
    Bell,
    Mail,
    Search,
    Shield,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const role = user?.role || 'Super Admin';

    // Role-based Navigation Configuration
    let navItems = [];
    if (role === 'Super Admin') {
        navItems = [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'Staff & Doctors', path: '/admin/doctors', icon: Stethoscope },
            { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
            { name: 'Patients', path: '/admin/patients', icon: Users },
            { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
            { name: 'Super Admin Settings', path: '/admin/admin-profile', icon: Settings },
        ];
    } else if (role === 'Receptionist') {
        navItems = [
            { name: 'Front Desk Queue', path: '/admin', icon: LayoutDashboard },
            { name: 'All Appointments', path: '/admin/appointments', icon: Calendar },
            { name: 'Patients Directory', path: '/admin/patients', icon: Users },
            { name: 'My Desk Profile', path: '/admin/receptionist-profile', icon: Users },
            { name: 'Public Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        ];
    } else if (role === 'Doctor') {
        navItems = [
            { name: 'My Schedule', path: '/admin/appointments', icon: Calendar },
            { name: 'My Doctor Profile', path: '/admin/doctor-profile', icon: Stethoscope },
            { name: 'My Patients', path: '/admin/patients', icon: Users },
            { name: 'Patient Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        ];
    } else {
        navItems = [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        ];
    }

    const handleLogout = () => {
        logout();
        toast.info('Staff Signed Out', {
            description: 'You have been safely logged out of the staff console.',
        });
        navigate('/staff/login');
    };

    return (
        <div className="flex min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between flex-shrink-0">
                <div>
                    {/* Staff Profile Header */}
                    <div className="p-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#00478d] to-blue-500 text-white font-bold flex items-center justify-center shadow-sm text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                                {user?.name || 'Staff User'}
                            </h2>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={`inline-block w-2 h-2 rounded-full ${
                                    role === 'Super Admin' ? 'bg-purple-500' : role === 'Doctor' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`} />
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                    {role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    {role === 'Super Admin' && (
                        <div className="px-4 py-3">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/doctors')}
                                className="w-full bg-[#00478d] dark:bg-blue-600 hover:bg-[#003870] dark:hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all"
                            >
                                <Plus size={15} />
                                <span>Add New Staff / Doctor</span>
                            </button>
                        </div>
                    )}

                    {/* Nav Links */}
                    <nav className="px-3 py-2 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-[#00478d] dark:bg-blue-600 text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Staff Info & Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <Shield size={16} />
                        <span>Public Hospital Home</span>
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Sign Out Portal</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Page Content */}
                <main className="p-6 md:p-8 flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
