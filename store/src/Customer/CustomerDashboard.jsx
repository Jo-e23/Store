import React, { useState, useEffect } from 'react';
import CustomerSidebar from './CustomerSidebar';

const CustomerDashboard = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        items: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.items) {
            alert("Email and Items are required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully! Order ID: ' + data.orderId);
                // Optional: Clear items after order
                setForm(prev => ({ ...prev, items: "" }));
            } else {
                alert('Failed to place order: ' + data.message);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("An error occurred while placing the order.");
        }
    };

    return (

        <CustomerSidebar>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl animate-fade-in mx-auto mt-10">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Place New Order</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email (Required for ID)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="+1 234 567 890"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700">Shipping Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="123 Main St, City"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="items" className="text-sm font-medium text-gray-700">Items to Order</label>
                        <textarea
                            id="items"
                            name="items"
                            value={form.items}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                            placeholder="List your items here (e.g., 2x Apple, 1x Milk)"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-2"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </CustomerSidebar>
    );
};

export default CustomerDashboard;
