/**
 * This file defines the routes for doctor-related operations.
 * Public routes: getting list of doctors and individual profiles.
 * Protected routes: creating, updating, and deleting doctors (Super Admin only).
 */
import express from 'express';
import {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
} from '../controllers/doctorController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getDoctors)
    .post(protect, authorizeRoles('Super Admin'), createDoctor);

router.route('/:id')
    .get(getDoctorById)
    .put(protect, authorizeRoles('Super Admin'), updateDoctor)
    .delete(protect, authorizeRoles('Super Admin'), deleteDoctor);

export default router;
