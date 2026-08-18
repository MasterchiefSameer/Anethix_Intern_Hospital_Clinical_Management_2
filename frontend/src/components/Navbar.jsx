/**
 * Navbar Component.
 * Displays the main navigation for the application. It includes links for Home, About, 
 * Departments, Doctors, and login/logout based on the user's authentication state.
 */
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    CareClinic
                </Link>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <Link to="/about" className="hover:text-accent transition-colors">About</Link>
                    <Link to="/departments" className="hover:text-accent transition-colors">Departments</Link>
                    <Link to="/doctors" className="hover:text-accent transition-colors">Doctors</Link>
                    <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
                </div>
                <div className="flex space-x-4">
                    <Link to="/login" className="bg-background text-foreground px-4 py-2 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
