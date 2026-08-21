/**
 * Admin & Staff Management Express Routes.
 * Protected with JWT authentication and Super Admin / Receptionist role authorization.
 */
import express from 'express';
import {
    getAdminStats,
    getStaffList,
    createStaffMember,
    updateStaffMember,
    toggleStaffStatus,
    resetStaffPassword,
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// General Analytics (Super Admin & Receptionist)
router.get('/stats', protect, authorizeRoles('Super Admin', 'Receptionist'), getAdminStats);

// Super Admin Staff Management
router.route('/staff')
    .get(protect, authorizeRoles('Super Admin'), getStaffList)
    .post(protect, authorizeRoles('Super Admin'), createStaffMember);

router.route('/staff/:id')
    .put(protect, authorizeRoles('Super Admin'), updateStaffMember);

router.patch('/staff/:id/toggle-status', protect, authorizeRoles('Super Admin'), toggleStaffStatus);
router.post('/staff/:id/reset-password', protect, authorizeRoles('Super Admin'), resetStaffPassword);

export default router;
