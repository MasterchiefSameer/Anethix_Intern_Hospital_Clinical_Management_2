/**
 * Admin Layout Component.
 * Provides a persistent sidebar and top navigation for the admin dashboard area.
 * It uses React Router's Outlet to render the nested admin pages.
 */
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Appointments', path: '/admin/appointments' },
        { name: 'Doctors', path: '/admin/doctors' },
        { name: 'Patients', path: '/admin/patients' },
        { name: 'Enquiries', path: '/admin/messages' },
    ];

    return (
        <div className="flex min-h-screen bg-secondary">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border shadow-sm hidden md:block">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-primary tracking-tight">Admin Portal</h2>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Admin Topbar */}
                <header className="bg-card border-b border-border p-4 flex justify-between items-center shadow-sm">
                    <h3 className="text-xl font-semibold text-foreground md:hidden">Admin Portal</h3>
                    <div className="hidden md:block"></div> {/* Spacer */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-foreground bg-accent px-3 py-1 rounded-full">
                            Role: Super Admin
                        </span>
                        <button className="text-destructive hover:underline font-medium text-sm">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
