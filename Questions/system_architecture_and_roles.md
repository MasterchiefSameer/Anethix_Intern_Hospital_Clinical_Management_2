# Hospital Management System: Roles & Architecture Strategy

This document outlines the professional system architecture, user roles, and security flows for the hospital management application.

## 1. System Hierarchy & Roles

*   **Super Admin (The Owner)**
    *   **Focus:** Business & Staff Management.
    *   **Permissions:** Absolute control. Can manage doctors, receptionists, view financial metrics, and alter global settings.
*   **Receptionist (Front Desk Manager)**
    *   **Focus:** Daily Operations & Patient Traffic.
    *   **Permissions:** Manages the daily queues, books walk-in appointments, updates appointment statuses (e.g., "Checked In"), and responds to public contact inquiries.
*   **Doctor (Medical Staff)**
    *   **Focus:** Medical Operations & Personal Schedule.
    *   **Permissions:** Can only view and manage their own appointments, update their own medical profile, and check patient histories for those assigned to them.
*   **Patient (End User)**
    *   **Focus:** Personal Health Records & Bookings.
    *   **Permissions:** Can view doctors, book appointments, and view their own past/upcoming appointment history.

---

## 2. Authentication & Onboarding Workflows

### The "No Public Staff Registration" Rule
To maintain strict enterprise security, hospital staff (Doctors, Receptionists, Admins) **cannot** register themselves through a public portal.

*   **Patients:** Register themselves via the standard `/register` page.
*   **Doctors & Receptionists:** 
    1. The Super Admin clicks "Add Staff" in the Admin Panel.
    2. Admin enters Name, Email, Role, and a Temporary Password (e.g., `Welcome@123`).
    3. The staff member logs in at a dedicated portal (e.g., `/doctor/login`).
    4. Upon first login, they are prompted to update their profile and change their password.
*   **Super Admin:** Created directly in the database (via a Database Seed Script or manual entry).

---

## 3. Dashboard Breakdowns

### Doctor Dashboard
*   **Key Metrics:** Today's Appointments, Pending Inquiries, Total Patients Seen, "Cases Solved" (Appointments marked as Completed).
*   **Features:** 
    *   Real-time notifications for new bookings.
    *   Profile Editor (update specialty, fees, bio, availability).
    *   Security panel to change password.

### Super Admin Dashboard
*   **Key Metrics:** Total Hospital Revenue, Total Registered Patients, Active Doctors.
*   **Features:** 
    *   HR Panel: Add/Edit/Deactivate Doctors and Receptionists.
    *   Financial Overview.

### Receptionist Dashboard
*   **Key Metrics:** Today's Walk-ins, Checked-in Patients, Queue Status.
*   **Features:**
    *   Book appointments on behalf of patients (walk-ins or phone calls).
    *   Reschedule or cancel appointments.
    *   Reply to messages sent from the public "Contact Us" form.
    *   *Bonus:* Collect offline payments (Cash/Card at desk).

---

## 4. Advanced Architectural Ideas (Bonus Recommendations)

1.  **Soft Deletion for Doctors:** 
    If a doctor leaves the hospital, the Super Admin should **not** permanently delete them from the database. If they are deleted, all their past appointment records will break! Instead, add an `isActive: Boolean` field. When a doctor is fired, set `isActive: false`. They will disappear from the public website, but past records will remain intact.
2.  **Audit Logging (Activity Tracker):**
    For a hospital, it's highly recommended to track actions. Create an `Audit` database collection that logs things like: *"Receptionist Jane cancelled Appointment #1234 at 2:00 PM"*. This prevents staff from blaming each other for mistakes.
3.  **Role-Based API Protection (Backend):**
    Ensure that the protection isn't just on the React frontend. Even if someone finds the backend API URL, the `authorizeRoles('Super Admin')` middleware must block a Receptionist from trying to delete a doctor.

---

## 5. Phase 2 / Future Roadmap
These features elevate the application to a production-ready standard and can be implemented after the core features are stable.

1. **Time-Slot Blocking:** Prevent double-booking by checking the database for existing appointments on a selected date, dynamically disabling booked time slots in the UI.
2. **Digital Prescriptions & Medical Notes:** Allow doctors to attach a digital note or PDF prescription to appointments marked as `Completed`, which patients can then view/download from their dashboard.
3. **Email Notifications (NodeMailer):** Automatically send professional HTML emails for booking confirmations, cancellations, and reschedules.
4. **Patient Reviews & Ratings:** Allow patients to rate (1-5 stars) and review a doctor only after a `Completed` appointment. Aggregate these to display average ratings in the Doctor Directory.
