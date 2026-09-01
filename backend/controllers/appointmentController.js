/**
 * Appointment Controller.
 * Handles online bookings, walk-in front desk registrations, live OPD queue management,
 * status transitions (Scheduled -> Checked-In -> Completed / No-Show), date validation,
 * slot capacity enforcement (max 3 per slot), and rescheduling.
 */
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

// @desc    Get Slot Availability & Capacity for Doctor on specific Date
// @route   GET /api/appointments/slots-availability
// @access  Public / Private
export const getSlotAvailability = async (req, res, next) => {
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) {
            return res.json({});
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' },
        });

        // Group by time slot
        const slotCounts = {};
        appointments.forEach((app) => {
            slotCounts[app.time] = (slotCounts[app.time] || 0) + 1;
        });

        res.json({ slotCounts, maxCapacityPerSlot: 3 });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new patient appointment (Online)
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res, next) => {
    try {
        const { doctor, date, time, reason } = req.body;

        if (!doctor || !date || !time) {
            res.status(400);
            throw new Error('Please provide doctor, date, and time');
        }

        // 1. Validate date (must be >= today)
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
            res.status(400);
            throw new Error('Cannot schedule an appointment for a past date.');
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // 2. Enforce slot capacity (Max 3 appointments per time slot)
        const existingInSlot = await Appointment.countDocuments({
            doctor,
            date: { $gte: startOfDay, $lte: endOfDay },
            time,
            status: { $ne: 'Cancelled' },
        });

        if (existingInSlot >= 3) {
            res.status(400);
            throw new Error(`This time slot (${time}) is fully booked (Max 3 appointments per slot). Please choose another time slot.`);
        }

        const countToday = await Appointment.countDocuments({
            doctor,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const appointment = new Appointment({
            patient: req.user._id,
            doctor,
            date: new Date(date),
            time,
            reason: reason || 'General Consultation',
            status: 'Scheduled',
            tokenNumber: countToday + 1,
            patientName: req.user.name,
            patientPhone: req.user.phone || '',
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        next(error);
    }
};

// @desc    Book Walk-in Patient (Front Desk Receptionist)
// @route   POST /api/appointments/walkin
// @access  Private (Receptionist, Super Admin)
export const bookWalkInAppointment = async (req, res, next) => {
    try {
        const { patientName, patientPhone, doctor, time, reason, date, autoCheckIn } = req.body;

        if (!patientName || !doctor || !time) {
            res.status(400);
            throw new Error('Patient Name, Doctor, and Time slot are required for Walk-in');
        }

        const appointmentDate = date ? new Date(date) : new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(appointmentDate);
        targetDate.setHours(0, 0, 0, 0);

        if (targetDate < today) {
            res.status(400);
            throw new Error('Cannot schedule an appointment for a past date.');
        }

        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Enforce slot capacity (Max 3 appointments per slot)
        const existingInSlot = await Appointment.countDocuments({
            doctor,
            date: { $gte: startOfDay, $lte: endOfDay },
            time,
            status: { $ne: 'Cancelled' },
        });

        if (existingInSlot >= 3) {
            res.status(400);
            throw new Error(`This time slot (${time}) is fully booked (Max 3 appointments). Please select another slot.`);
        }

        // Check if patient exists with this phone or link placeholder
        let patientUser = null;
        if (patientPhone) {
            patientUser = await User.findOne({ phone: patientPhone });
        }

        const countToday = await Appointment.countDocuments({
            doctor,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const appointment = new Appointment({
            patient: patientUser ? patientUser._id : req.user._id,
            doctor,
            date: appointmentDate,
            time,
            reason: reason || 'Walk-in OPD Consultation',
            status: autoCheckIn ? 'Checked-In' : 'Scheduled',
            isWalkIn: true,
            tokenNumber: countToday + 1,
            patientName,
            patientPhone: patientPhone || '',
        });

        const created = await appointment.save();
        const populated = await Appointment.findById(created._id)
            .populate('doctor', 'name specialty fees')
            .populate('patient', 'name phone email');

        res.status(201).json(populated);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Live Today OPD Queue and Statistics
// @route   GET /api/appointments/queue/today
// @access  Private (Receptionist, Super Admin, Doctor)
export const getTodayQueue = async (req, res, next) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const filter = {
            date: { $gte: todayStart, $lte: todayEnd },
        };

        // If logged in as Doctor, only show their own appointments
        if (req.user.role === 'Doctor') {
            const doc = await Doctor.findOne({
                $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }],
            });
            if (doc) {
                filter.doctor = doc._id;
            }
        }

        const queue = await Appointment.find(filter)
            .populate('patient', 'name email phone bloodGroup gender')
            .populate('doctor', 'name specialty fees')
            .sort({ tokenNumber: 1, createdAt: 1 });

        // Calculate queue metrics
        const totalToday = queue.length;
        const checkedIn = queue.filter((a) => a.status === 'Checked-In').length;
        const scheduled = queue.filter((a) => a.status === 'Scheduled').length;
        const completed = queue.filter((a) => a.status === 'Completed').length;
        const noShow = queue.filter((a) => a.status === 'No-Show').length;

        // Active doctors with appointments today
        const activeDoctorIds = [...new Set(queue.map((a) => a.doctor?._id?.toString()).filter(Boolean))];

        res.status(200).json({
            queue,
            stats: {
                totalToday,
                pendingQueue: scheduled + checkedIn,
                checkedIn,
                scheduled,
                completed,
                noShow,
                activeDoctorsCount: activeDoctorIds.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
export const getMyAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name specialty fees')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin/Receptionist
export const getAppointments = async (req, res, next) => {
    try {
        const filter = {};
        if (req.user.role === 'Doctor') {
            const doc = await Doctor.findOne({
                $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }],
            });
            if (doc) filter.doctor = doc._id;
        }

        const appointments = await Appointment.find(filter)
            .populate('patient', 'name email phone bloodGroup')
            .populate('doctor', 'name specialty')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status (Checked-In, Completed, No-Show, Cancelled)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin/Receptionist/Doctor
export const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Scheduled', 'Checked-In', 'Completed', 'No-Show', 'Cancelled', 'Confirmed'];

        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const appointment = await Appointment.findById(req.params.id)
            .populate('doctor', 'name specialty')
            .populate('patient', 'name phone email');

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        appointment.status = status;
        const updated = await appointment.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private/Admin/Receptionist
export const rescheduleAppointment = async (req, res, next) => {
    try {
        const { date, time } = req.body;
        if (!date || !time) {
            res.status(400);
            throw new Error('Please provide new date and time');
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        appointment.date = new Date(date);
        appointment.time = time;
        appointment.status = 'Scheduled'; // Reset status back to Scheduled
        const updated = await appointment.save();
        res.json(updated);
    } catch (error) {
        next(error);
    }
};
