
const { AdminModel } = require("../models/Admin");
const bcrypt = require("bcrypt");
const verifyotp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await AdminModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({ message: "OTP verified successfully" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" })
    }
};

module.exports = verifyotp;
