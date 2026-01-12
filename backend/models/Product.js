const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    mrp: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    countryOfOrigin: { type: String },
    manufacturer: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
