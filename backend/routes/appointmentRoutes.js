/**
 * This file defines the routes for appointments.
 * Handles patient booking, fetching their own history, and admin management.
 */
import express from 'express';
import {
    createAppointment,
    getMyAppointments,
    getAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createAppointment)
    .get(protect, authorizeRoles('Super Admin', 'Receptionist'), getAppointments);

router.route('/myappointments').get(protect, getMyAppointments);

router.route('/:id/status').put(protect, authorizeRoles('Super Admin', 'Receptionist'), updateAppointmentStatus);

export default router;
