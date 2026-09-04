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
import ManagePatients from './pages/admin/ManagePatients';
import ManageInquiries from './pages/admin/ManageInquiries';
import PatientProfile from './pages/Patient_Profile';
import About from './components/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomToaster from './components/CustomToaster';
import Departments from './pages/Departments';
import StaffLogin from './pages/admin/StaffLogin';
import DoctorProfile from './pages/admin/Staff/Doctor_profile';
import ReceptionistProfile from './pages/admin/Staff/Receptionist_profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <ThemeProvider>
        {/* Auth Provider */}
        <AuthProvider>
          <CustomToaster />
          <Router>
            <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col transition-colors duration-200">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes (Accessible by all users / guests) */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/doctors" element={<DoctorDirectory />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Auth initialMode="login" />} />
                  <Route path="/register" element={<Auth initialMode="register" />} />
                  <Route path="/staff/login" element={<StaffLogin />} />
                  <Route path="/staff-login" element={<StaffLogin />} />

                  {/* Protected Routes (Requires User Authentication) */}
                  <Route
                    path="/book"
                    element={
                      <ProtectedRoute>
                        <BookAppointment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book/:doctorId"
                    element={
                      <ProtectedRoute>
                        <BookAppointment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <PatientProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient-profile"
                    element={
                      <ProtectedRoute>
                        <PatientProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin & Staff Portal Routes (Strict RBAC Protected) */}
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['Super Admin', 'Receptionist', 'Doctor']}><AdminLayout /></ProtectedRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="appointments" element={<ManageAppointments />} />
                      <Route path="doctors" element={<ManageDoctors />} />
                      <Route path="patients" element={<ManagePatients />} />
                      <Route path="inquiries" element={<ManageInquiries />} />
                      <Route path="doctor-profile" element={<DoctorProfile />} />
                      <Route path="receptionist-profile" element={<ReceptionistProfile />} />
                    </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
