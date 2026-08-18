/**
 * Main App component containing the router configuration.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDirectory from './pages/DoctorDirectory';
import BookAppointment from './pages/BookAppointment';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageDoctors from './pages/admin/ManageDoctors';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorDirectory />} />
              <Route path="/book/:doctorId" element={<BookAppointment />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
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
  );
}

export default App;
