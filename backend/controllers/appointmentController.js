/**
 * This file contains the logic for creating and managing appointments.
 * It handles scheduling an appointment, fetching patient-specific appointments,
 * and fetching all appointments for admin/receptionist views.
 */
import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
    try {
        const { doctor, date, time, reason } = req.body;

        if (!doctor || !date || !time) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        const appointment = new Appointment({
            patient: req.user._id,
            doctor,
            date,
            time,
            reason,
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
const getMyAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialty');
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin/Receptionist
const getAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({}).populate('patient', 'name email').populate('doctor', 'name');
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin/Receptionist
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            appointment.status = req.body.status || appointment.status;
            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404);
            throw new Error('Appointment not found');
        }
    } catch (error) {
        next(error);
    }
};

export {
    createAppointment,
    getMyAppointments,
    getAppointments,
    updateAppointmentStatus
};
