/**
 * Home Page Component.
 * Acts as the landing page for patients, displaying a hero section, key features,
 * and quick links to booking appointments.
 */
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-secondary py-20 px-4 text-center rounded-b-[4rem] shadow-sm">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6">
                        Advanced Healthcare Made <span className="text-primary">Accessible</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10">
                        Book appointments with top doctors, manage your medical records, and access world-class facilities in one place.
                    </p>
                    <Link to="/doctors" className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                        Book an Appointment
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose Us?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-primary">👨‍⚕️</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Expert Doctors</h3>
                        <p className="text-muted-foreground">Access a network of highly qualified and experienced medical professionals.</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-primary">🏥</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Modern Facilities</h3>
                        <p className="text-muted-foreground">State-of-the-art infrastructure designed for your comfort and swift recovery.</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-primary">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Easy Scheduling</h3>
                        <p className="text-muted-foreground">Book and manage your appointments seamlessly online 24/7.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
