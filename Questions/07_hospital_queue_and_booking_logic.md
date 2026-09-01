# Hospital Queue Management & Booking Logic

This document details the refined operational workflows for the Front Desk, the updated appointment state machine, and critical booking constraints required for a fail-safe hospital management system.

## 1. Front Desk & Walk-In Workflows

The Receptionist serves as the core operational manager for hospital traffic. Their dashboard is stripped of unnecessary patient-centric options (like "Book Appointment" for themselves) and admin-centric options (like "Enterprise Console"), focusing purely on daily hospital flow.

### Clean Sidebar Navigation
*   **Live OPD Queue:** The master view merging both website-booked patients and walk-in patients for the current day.
*   **Walk-in Registration:** A dedicated interface to handle on-the-spot registrations.
*   **Doctor Roster:** A live view of today's available doctors and their respective queue counts.

### The Walk-In Logic
When a patient walks into the hospital without an appointment:
1.  **Phone Verification:** The receptionist enters the patient's phone number. The system queries the database.
2.  **Auto-Fill vs. Register:** If the patient exists, their details auto-fill. If not, a new patient record is created.
3.  **Real Doctor Selection:** The "Select Doctor" dropdown dynamically fetches active doctors (`/api/users?role=Doctor`) directly from the backend, avoiding any hardcoded dummy data.

---

## 2. The Appointment State Machine

Real-world hospital appointments are not simply "Approved" or "Pending". They follow a physical journey. The system updates the Mongoose `status` enum to support this physical flow:

*   `Scheduled`: The initial state when a booking is made (either online or via walk-in).
*   `Checked-In`: The receptionist marks the patient as physically present in the waiting room.
*   `Completed` / `Case Solved`: The doctor finishes the consultation.
*   `No-Show`: If a patient fails to arrive, the receptionist clears them from the queue using this status.
    *   *Action:* From a `No-Show` state, the appointment can be 1-click **Rescheduled** to a new date, reverting its status to `Scheduled`.

---

## 3. Booking Security & Capacity Constraints

To prevent chaotic and invalid bookings, two strict rules are enforced on both the frontend calendar and the backend API:

### A. Date Restriction (No Past Bookings)
*   The system completely blocks booking appointments on past dates. 
*   In the frontend React UI, the date picker sets `min={new Date().toISOString().split('T')[0]}`.
*   The backend validates that `appointmentDate >= today`.

### B. Time Slot Capacity Limit (Max 3 Patients)
*   **The Rule:** A specific time slot (e.g., 11:30 AM) for a specific doctor can only hold a maximum of 3 patients.
*   **Frontend Check:** The UI dynamically queries slot availability. If a slot hits 3/3 bookings, it is marked as `FULL` and disabled (greyed out).
*   **Backend Enforcer:** Before saving an appointment, the backend queries: `Count(appointments) WHERE doctorId = X AND date = Y AND timeSlot = Z`. If the count is >= 3, the API returns a `400 Bad Request` ("Slot is full").

---

## 4. Protected Routes & Browser Behaviors

### JWT Route Guards
All sensitive routes (like `/admin/front-desk` or `/doctor/dashboard`) must be wrapped in a `<ProtectedRoute>` component.
*   If a user shares an admin link or pastes it into an incognito window, the frontend immediately checks `localStorage` for a valid JWT token.
*   If missing, it automatically redirects the user to the `/login` or `/staff/login` page.
*   The backend simultaneously enforces this by requiring a JWT in the `Authorization` header for any API data fetch.

### Incognito Shared Sessions
*   **Behavior Note:** If multiple Incognito windows are opened simultaneously from the same session (e.g., Ctrl+Shift+N once, then multiple tabs/windows), they **share** the same `localStorage`.
*   Logging into multiple roles (Doctor, Admin, Receptionist) in these shared windows will result in the last login overwriting the token for all tabs. 
*   *Best Practice for Testing:* Test distinct roles using entirely separate browsers (Chrome, Firefox, Edge) or separate Chrome Profiles to maintain isolated `localStorage` environments.
