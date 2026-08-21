# Comprehensive Project Documentation: Hospital & Clinic Management System

This document serves as the master record for everything built and planned for this project, combining our initial MERN stack setup with our latest architectural implementations.

## 1. Technology Stack (MERN)
*   **Frontend:** React.js (Vite), Tailwind CSS, shadcn/ui, React Router DOM.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose ORM).
*   **Authentication:** JSON Web Tokens (JWT) stored securely in `localStorage` (`medtrust_user`), with `bcryptjs` for password hashing.
*   **Payments:** Razorpay integration (currently utilizing a mock/fake flow for testing, with real backend code commented out and ready for production keys).

## 2. Core Features Implemented

### Backend Infrastructure
*   **Database Models:** Robust schemas for `User` (with roles), `Doctor`, `Appointment`, and `Message`. `User` includes comprehensive profile fields (blood group, address, emergency contacts).
*   **Database Seeding (`backend/seed.js`):** Automated seed script to create the initial Super Admin account (`admin@clinic.com` / `adminpassword123`).
*   **RESTful APIs & Controllers:**
    *   `authController.js` & `authRoutes.js`: Login, register, logout, profile.
    *   `adminController.js` & `adminRoutes.js`: Admin-only endpoints for managing doctors and staff.
    *   `doctorController.js` & `doctorRoutes.js`: Public & admin endpoints for doctor profiles.
    *   `appointmentController.js` & `appointmentRoutes.js`: Patient booking & status management.
    *   `messageController.js` & `messageRoutes.js`: Contact inquiry handling.
    *   `UserController.js` & `userRoutes.js`: Profile fetching and updating.
*   **Security:** Role-Based Access Control (RBAC) middleware (`protect` and `authorizeRoles`) enforcing access permissions for Patient, Doctor, Receptionist, and Super Admin.

### Frontend Application
*   **Global State & Routing:** React Context for Auth (`AuthContext.jsx`) and Theme (`ThemeContext.jsx`). Protected Routes (`ProtectedRoute.jsx`) to enforce authentication and role requirements.
*   **UI/UX:** Fully responsive design with Dark Mode support and toast notifications (`sonner` via `CustomToaster.jsx`).
*   **Separate Auth Portals:**
    *   **Patient Auth (`Auth.jsx`):** Login and registration for patients (`/login`, `/register`).
    *   **Staff Login (`StaffLogin.jsx`):** Dedicated portal for Doctors, Receptionists, and Super Admins (`/staff/login`).
*   **Patient Portal:** 
    *   Doctor Directory to view specialists (`/doctors`).
    *   Appointment booking form triggering the mock Razorpay flow (`/book/:doctorId`).
    *   Patient Dashboard showing past/upcoming appointments (`/dashboard`).
    *   Comprehensive Profile Management (`/patient-profile`).
*   **Admin & Staff Panel (`/admin`):**
    *   `AdminLayout.jsx`: Sidebar and topbar navigation for admin functions.
    *   `AdminDashboard.jsx`: Metrics and recent activity overview.
    *   `ManageAppointments.jsx`: Approval, rejection, and cancellation of bookings.
    *   `ManageDoctors.jsx`: Adding, updating, and removing doctors (Super Admin).
    *   `Staff/Doctor_profile.jsx`: Staff profile view for doctor management.
    *   `Staff/Receptionist_profile.jsx`: Staff profile view for receptionist management.
*   **Public Pages:** Home (`/`), About (`/about`), Contact (`/contact`), and Departments (`/departments`).

## 3. System Architecture & Roles
*   **Super Admin:** Ultimate authority. Manages staff (creating/deactivating doctors & receptionists), views revenue, and oversees global settings. Initial account seeded via `seed.js`.
*   **Receptionist:** Front-desk operational management. Books walk-in appointments, manages queues, and responds to contact inquiries. Created by Super Admin.
*   **Doctor:** Medical staff. Manages individual appointments and medical profile. Created by Super Admin with temporary password.
*   **Patient:** Public user. Registers via `/register`, books appointments, pays online/offline, and views health records.

## 4. Phase 2 / Future Roadmap
*   **Time-Slot Blocking:** Prevent double-booking dynamically in the UI.
*   **Digital Prescriptions:** Allow doctors to attach PDF prescriptions to completed appointments.
*   **Email Notifications:** Integrate NodeMailer for booking confirmations.
*   **Reviews & Ratings:** 1-5 star patient ratings displayed on the Doctor Directory.
*   **Audit Logging & Soft Deletion:** Tracking staff actions and hiding (rather than deleting) fired doctors to preserve past patient records.

---
*Documented and updated to ensure no project context is lost.*
