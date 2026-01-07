const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },

    role: {
        type: String,
        enum: ['admin', 'customer', 'service-man'],
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    walletBalance: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Admin', adminSchema);
