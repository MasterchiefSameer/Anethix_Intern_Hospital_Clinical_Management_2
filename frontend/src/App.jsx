import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './Auth/Auth';
import DoctorDirectory from './pages/DoctorDirectory';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageDoctors from './pages/admin/ManageDoctors';
import PatientProfile from './pages/Patient_Profile';
import About from './components/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Auth initialMode="login" />} />
              <Route path="/register" element={<Auth initialMode="register" />} />
              <Route path="/doctors" element={<DoctorDirectory />} />
              <Route path="/book/:doctorId" element={<BookAppointment />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<PatientProfile />} />
              <Route path="/patient-profile" element={<PatientProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Admin Routes (Uses separate layout without standard Navbar) */}
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="appointments" element={<ManageAppointments />} />
            <Route path="doctors" element={<ManageDoctors />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
