/**
 * Appointment Routes.
 * Mounts endpoints for booking, walk-in registration, live queue, and status changes.
 */
import express from 'express';
import {
    createAppointment,
    bookWalkInAppointment,
    getTodayQueue,
    getMyAppointments,
    getAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    getSlotAvailability,
} from '../controllers/appointmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Patient Slot Capacity Availability
router.route('/slots-availability').get(getSlotAvailability);

// 1. Patient & Online Booking
router.route('/')
    .post(protect, createAppointment)
    .get(protect, authorizeRoles('Super Admin', 'Receptionist', 'Doctor'), getAppointments);

// 2. Front Desk Walk-In Booking
router.route('/walkin')
    .post(protect, authorizeRoles('Super Admin', 'Receptionist'), bookWalkInAppointment);

// 3. Live Today OPD Queue
router.route('/queue/today')
    .get(protect, authorizeRoles('Super Admin', 'Receptionist', 'Doctor'), getTodayQueue);

// 4. Logged in Patient History
router.route('/myappointments')
    .get(protect, getMyAppointments);

// 5. Status Lifecycle Transition (Scheduled -> Checked-In -> Completed / No-Show)
router.route('/:id/status')
    .put(protect, authorizeRoles('Super Admin', 'Receptionist', 'Doctor'), updateAppointmentStatus);

// 6. Reschedule Appointment
router.route('/:id/reschedule')
    .put(protect, authorizeRoles('Super Admin', 'Receptionist', 'Doctor'), rescheduleAppointment);

export default router;
