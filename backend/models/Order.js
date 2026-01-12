const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'Admin',
        required: true
    },
    items: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    customerName: { type: String },
    customerPhone: { type: String },
    customerAddress: { type: String },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Processing', 'Packed', 'Completed', 'Cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
