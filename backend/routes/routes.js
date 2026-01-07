const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Shop = require("../models/Shop");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new product
router.post("/product", async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Admin Profile
router.get("/admin", async (req, res) => {
    try {
        let admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ message: "Admin profile not found" });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Admin Profile
router.put("/admin", async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const admin = await Admin.findOne();

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        admin.name = name;
        admin.phone = phone;
        admin.email = email;

        const updatedAdmin = await admin.save();
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/shop", async (req, res) => {
    try {
        const { name, phone, gst } = req.body;
        let shop = await Shop.findOne();

        if (!shop) {
            shop = new Shop({
                name: name || "My Shop",
                phone: phone,
                gst: gst
            });
        } else {
            shop.name = name;
            shop.phone = phone;
            shop.gst = gst;
        }

        const updatedShop = await shop.save();
        res.json(updatedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" })
    }
});

router.get("/shop", async (req, res) => {
    try {
        let shop = await Shop.findOne();
        if (!shop) {
            shop = new Shop({
                name: "My Shop",
                phone: "",
                gst: ""
            });
            await shop.save();
        }
        res.json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" })
    }
}
)
router.post("/order", async (req, res) => {
    try {
        const { email, items, address, phone, name } = req.body;

        // Find user by email
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please ensure the email is registered." });
        }

        const orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

        const newOrder = new Order({
            userId: user._id,
            items: items,
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            orderId: orderId,
            status: 'Pending',
            createdAt: Date.now()
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!", orderId: orderId });

    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ message: "Failed to place order. " + error.message });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Update Order Status
router.put("/order/status", async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();
        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
});

module.exports = router;