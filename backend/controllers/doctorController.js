/**
 * This file contains the logic for managing doctors.
 * It includes getting all doctors, getting a single doctor by ID,
 * and creating/updating/deleting doctors (for Super Admin only).
 */
import Doctor from '../models/Doctor.js';

// @desc    Fetch all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({});
        res.json(doctors);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404);
            throw new Error('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a doctor
// @route   POST /api/doctors
// @access  Private/Super Admin
const createDoctor = async (req, res, next) => {
    try {
        const doctor = new Doctor({
            name: 'Sample name',
            specialty: 'Sample specialty',
            experience: 0,
            fees: 0,
            about: 'Sample about',
            availableDays: ['Monday']
        });
        const createdDoctor = await doctor.save();
        res.status(201).json(createdDoctor);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private/Super Admin
const updateDoctor = async (req, res, next) => {
    try {
        const { name, specialty, experience, fees, about, availableDays, image, isActive } = req.body;
        const doctor = await Doctor.findById(req.params.id);

        if (doctor) {
            doctor.name = name || doctor.name;
            doctor.specialty = specialty || doctor.specialty;
            doctor.experience = experience || doctor.experience;
            doctor.fees = fees || doctor.fees;
            doctor.about = about || doctor.about;
            doctor.availableDays = availableDays || doctor.availableDays;
            doctor.image = image || doctor.image;
            doctor.isActive = isActive !== undefined ? isActive : doctor.isActive;

            const updatedDoctor = await doctor.save();
            res.json(updatedDoctor);
        } else {
            res.status(404);
            throw new Error('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Super Admin
const deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (doctor) {
            await Doctor.deleteOne({ _id: doctor._id });
            res.json({ message: 'Doctor removed' });
        } else {
            res.status(404);
            throw new Error('Doctor not found');
        }
    } catch (error) {
        next(error);
    }
};

export {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
