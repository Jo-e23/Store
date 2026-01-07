const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const transporter = require('./nodemailer');


const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

router.post('/signup', async (req, res) => {
    try {
        const { firstname, email, phone, address, role } = req.body;
        let user = await Admin.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: "User already exists" });
        } 

        const otp = generateOTP();
        console.log("    DEBUG OTP (Signup - Use this if email fails):", otp);
        const otpExpires = Date.now() + 10 * 60 * 1000; 
        if (user && !user.isVerified) {
            user.name = firstname;
            user.phone = phone;
            user.address = address;
            user.role = role || 'customer';
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            user = new Admin({
                name: firstname,
                email,
                phone,
                address,
                role: role || 'customer',
                otp,
                otpExpires,
                isVerified: false
            });
            await user.save();
        }

        const mailOptions = {
            from: 'joeljobywork@gmail.com',
            to: email,
            subject: 'Verify your Account',
            text: `Your OTP for account verification is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email error:", error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({ message: "OTP sent to your email. Please verify." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/send-login-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account not verified. Please verify registration first." });
        }

        const otp = generateOTP();
        console.log("    DEBUG OTP (Login - Use this if email fails):", otp);
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const mailOptions = {
            from: 'joeljobywork@gmail.com',
            to: email,
            subject: 'Login OTP',
            text: `Your OTP for login is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email error:", error);
            } else {
                console.log('Login OTP sent: ' + info.response);
            }
        });

        res.json({ message: "OTP sent to your email." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            "secret_key_change_me",
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    message: "Login successful!",
                    token,
                    role: user.role
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
