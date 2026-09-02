# Patient Dashboard & Future Hospital Roadmap

*This document captures the brainstorming and exploration phase regarding the `Dashboard.jsx` file and the future roadmap for the MedTrust Hospital Portal.*

## 1. Current State of `Dashboard.jsx`
The patient appointment history dashboard has a premium, enterprise-level UI with the following features:
- **Clean Data Table:** Displays Doctor details (with initials avatar), Department, Date/Time, and Status.
- **Status Pills:** Visual cues for appointment states (Blue = Confirmed, Green = Completed, Red = Cancelled).
- **Action Menu:** 3-dots dropdown for Reschedule, Cancel, and View Summary.
- **Summary Modal:** A "Consultation Summary & Receipt" modal that displays the doctor's clinical notes, fee, and an option to "Download OPD Slip (PDF)".

### 🚨 The Data Connection Issue (Immediate Fix Needed)
Despite the excellent UI, the dashboard currently relies on **dummy data**.
- **The Problem:** Around line 100, the code attempts to read from `localStorage` (`medtrust_appointments`) and falls back to a hardcoded array `defaultAppointments` (e.g., Dr. Jane Smith, Dr. Alan Davis).
- **The Solution:** To make the portal fully functional, the IDE agent needs to replace this logic with a real API call.
- **IDE Command Prompt to use:** *"In Dashboard.jsx, remove the hardcoded `defaultAppointments` and `localStorage` logic. Replace it with a `useEffect` that fetches the patient's real appointments from the backend (e.g., `GET /api/appointments/my-appointments`)."*

---

## 2. The Next Big Things (Future Roadmap)

With the Receptionist Queue and Role-Based Access Control (RBAC) securely in place, the following features represent the next logical steps for the hospital ERP:

### Idea A: The Doctor's "Digital Prescription" (Clinical Side)
Currently, a doctor or receptionist can mark an appointment as `Completed`. But what did the doctor actually diagnose or prescribe?
- **Workflow:** When a doctor clicks "Mark as Completed", a modal should open allowing them to type Clinical Notes, Diagnosis, and prescribed Medicines.
- **Integration:** This perfectly aligns with the *already existing* Summary Modal in `Dashboard.jsx`, which expects a `summary` field to display to the patient.

### Idea B: The Billing / Payment Flow (Financial Side)
The system currently assumes a flat fee without tracking actual payments.
- **Walk-in Workflow:** When a Receptionist registers a walk-in, there should be a `[x] Payment Received (Cash)` checkbox.
- **Online Workflow:** Integration with Razorpay/Stripe during the patient's self-booking process.
- **Outcome:** Every appointment generates a valid, paid invoice.

### Idea C: Notification System (Communication Side)
Patients need to be informed of state changes in real-time.
- **Workflow:** If a receptionist clicks "Reschedule" or marks a patient as "No-Show", the backend should trigger an email.
- **Implementation:** Use `NodeMailer` (or SMS gateways like Twilio/Fast2SMS) on the backend to automatically dispatch notifications like: *"Your appointment with Dr. XYZ has been rescheduled to 4:00 PM."*
