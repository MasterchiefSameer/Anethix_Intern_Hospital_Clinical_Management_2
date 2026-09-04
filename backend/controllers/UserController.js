import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const targetId =
            req.params.id && req.params.id !== 'undefined' && req.params.id !== 'null'
                ? req.params.id
                : req.user._id;

        // Security check: User can only view their own profile unless Super Admin
        if (
            req.params.id &&
            req.params.id !== 'undefined' &&
            req.params.id !== 'null' &&
            req.user._id.toString() !== req.params.id &&
            req.user.role !== 'Super Admin'
        ) {
            res.status(401);
            throw new Error('You can only access your own profile');
        }

        const user = await User.findById(targetId).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        let responseData = { ...user._doc };

        // If user is a Doctor, enrich with doctor collection profile
        if (user.role === 'Doctor') {
            const docProfile = await Doctor.findOne({
                $or: [{ user: user._id }, { email: user.email.toLowerCase() }],
            });
            if (docProfile) {
                responseData.doctorProfile = docProfile;
            }
        }

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile/:id (or /api/user/profile)
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        const targetId =
            req.params.id && req.params.id !== 'undefined' && req.params.id !== 'null'
                ? req.params.id
                : req.user._id;

        // Security check: User can only update their own profile unless Super Admin
        if (
            req.params.id &&
            req.params.id !== 'undefined' &&
            req.params.id !== 'null' &&
            req.user._id.toString() !== req.params.id &&
            req.user.role !== 'Super Admin'
        ) {
            res.status(401);
            throw new Error('You can only update your own profile');
        }

        const updateData = {};

        // Base allowed editable fields for regular users (Patients, Receptionists, Doctors)
        const regularAllowedFields = [
            'name',
            'phone',
            'gender',
            'dob',
            'bloodGroup',
            'address',
            'city',
            'state',
            'pincode',
            'languages',
            'emergencyContact',
            'personalEmail',
        ];

        // Super Admin exclusive administrative fields
        const adminOnlyFields = [
            'email',
            'hospitalEmail',
            'employeeId',
            'deskNumber',
            'shiftTimings',
            'dateOfJoining',
            'role',
            'isActive',
        ];

        // Determine permitted fields based on requester role
        const allowedFields = req.user.role === 'Super Admin'
            ? [...regularAllowedFields, ...adminOnlyFields]
            : regularAllowedFields;

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Hash password if user is changing their password
        if (req.body.password) {
            updateData.password = bcrypt.hashSync(req.body.password, 10);
            updateData.isFirstLogin = false;
        }

        const updatedUser = await User.findByIdAndUpdate(
            targetId,
            {
                $set: updateData,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // If Doctor, update linked Doctor collection document
        let docProfile = null;
        if (updatedUser.role === 'Doctor') {
            docProfile = await Doctor.findOne({
                $or: [{ user: updatedUser._id }, { email: updatedUser.email.toLowerCase() }],
            });

            if (docProfile) {
                if (req.body.name) docProfile.name = req.body.name.startsWith('Dr.') ? req.body.name : `Dr. ${req.body.name}`;
                if (req.body.phone) docProfile.phone = req.body.phone;
                if (req.body.specialty) docProfile.specialty = req.body.specialty;
                if (req.body.licenseNumber !== undefined) docProfile.licenseNumber = req.body.licenseNumber;
                if (req.body.qualifications !== undefined) docProfile.qualifications = req.body.qualifications;
                if (req.body.experience !== undefined) docProfile.experience = Number(req.body.experience);
                if (req.body.fees !== undefined) docProfile.fees = Number(req.body.fees);
                if (req.body.timeSlots !== undefined) docProfile.timeSlots = req.body.timeSlots;
                if (req.body.about !== undefined) docProfile.about = req.body.about;
                if (req.body.availableDays) docProfile.availableDays = req.body.availableDays;
                if (req.body.image) docProfile.image = req.body.image;
                await docProfile.save();
            }
        }

        // Destructure to omit password from response
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            ...rest,
            doctorProfile: docProfile || undefined,
        });
    } catch (error) {
        next(error);
    }
};


//@desc   Register a new Patient (By Receptionist/Admin)
//@route   POST /api/user/register-patient
//@access   Private (Receptionist, Super Admin)
export const registerPatientByAdmin = async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Please provide name, email and password');
        }

        // Check first the first exist or not
        const userExist = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('Patient with this email already exists');
        }

        const user = await User.create({
            name,
            email,
            password, //Password automatically hash ho jayega (Duw to User model hook)
            phone: phone || '',
            role: 'Patient',
        });

        if (user) {
            //We don't create Token/Cookie Here, because it will lose the receptionist session
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                message: "Patient Registered Successfully",
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get patients directory (RBAC: Super Admin/Receptionist gets all, Doctor gets patients from appointments)
// @route   GET /api/user/patients
// @access  Private (Super Admin, Receptionist, Doctor)
export const getPatientsDirectory = async (req, res, next) => {
    try {
        if (req.user.role === 'Super Admin' || req.user.role === 'Receptionist') {
            const patients = await User.find({ role: 'Patient' }).select('-password').sort({ createdAt: -1 });
            return res.status(200).json(patients);
        } else if (req.user.role === 'Doctor') {
            // Find doctor document
            const doctorDoc = await Doctor.findOne({
                $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
            });

            const doctorIdFilter = doctorDoc ? [req.user._id, doctorDoc._id] : [req.user._id];

            // Import Appointment dynamically or query via mongoose
            const Appointment = (await import('../models/Appointment.js')).default;
            const appointments = await Appointment.find({ doctor: { $in: doctorIdFilter } }).select('patient');
            const patientIds = [...new Set(appointments.map(a => a.patient.toString()))];

            const patients = await User.find({ _id: { $in: patientIds }, role: 'Patient' }).select('-password').sort({ name: 1 });
            return res.status(200).json(patients);
        } else {
            res.status(403);
            throw new Error('Not authorized to access patient directory');
        }
    } catch (error) {
        next(error);
    }
};