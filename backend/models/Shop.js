const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;
const shopSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: "Admin", required: true },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    gst: { type: String },
    orderid: { type: String },
    items: { type: String }
});
module.exports = mongoose.model("Shop", shopSchema);