/**
 * This file handles Razorpay payment integration logic.
 * It contains both the fake payment flow (active) and the real Razorpay API calls (commented out),
 * as requested in the PRD, allowing easy switching when credentials are ready.
 */
import Appointment from '../models/Appointment.js';
// Uncomment the line below to use real Razorpay
// import Razorpay from 'razorpay';
// import crypto from 'crypto';

// @desc    Create Razorpay Order (Fake and Real implementations)
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { amount, appointmentId } = req.body; // Amount in INR

        /* 
        // --- REAL RAZORPAY CODE (COMMENTED OUT) ---
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${appointmentId}`
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        res.json(order);
        // ------------------------------------------
        */

        // --- FAKE RAZORPAY CODE (ACTIVE) ---
        // Simulating a successful order creation
        const fakeOrder = {
            id: `order_fake_${Math.floor(Math.random() * 1000000)}`,
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${appointmentId}`,
            status: "created"
        };
        res.json(fakeOrder);
        // -----------------------------------

    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay Payment (Fake and Real implementations)
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, appointmentId } = req.body;

        /*
        // --- REAL RAZORPAY CODE (COMMENTED OUT) ---
        const sign = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpaySignature === expectedSign) {
            // Payment is successful
            const appointment = await Appointment.findById(appointmentId);
            if (appointment) {
                appointment.isPaid = true;
                appointment.razorpayPaymentId = razorpayPaymentId;
                await appointment.save();
            }
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
        // ------------------------------------------
        */

        // --- FAKE RAZORPAY CODE (ACTIVE) ---
        // Automatically assume payment is successful in fake mode
        const appointment = await Appointment.findById(appointmentId);
        if (appointment) {
            appointment.isPaid = true;
            appointment.razorpayPaymentId = razorpayPaymentId || `pay_fake_${Math.floor(Math.random() * 1000000)}`;
            appointment.status = 'Confirmed';
            await appointment.save();
        }
        res.status(200).json({ message: "Fake Payment verified successfully" });
        // -----------------------------------

    } catch (error) {
        next(error);
    }
};

export {
    createOrder,
    verifyPayment
};
