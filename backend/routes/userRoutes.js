import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    registerPatientByAdmin,
    getPatientsDirectory,
} from '../controllers/UserController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Support both /api/user/profile and /api/user/profile/:id
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile/:id')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

//@route   POST /api/user/register-patient
router.route('/register-patient')
    .post(protect, authorizeRoles('Super Admin', 'Receptionist'), registerPatientByAdmin);

//@route   GET /api/user/patients
router.route('/patients')
    .get(protect, authorizeRoles('Super Admin', 'Receptionist', 'Doctor'), getPatientsDirectory);

export default router;