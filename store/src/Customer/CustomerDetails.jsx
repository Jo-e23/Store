import React from "react";
const CustomerDetails = ({ form, handleChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 ">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Customer Details</h2>
            <div className="flex flex-col gap-5">
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
            </div>
        </div>
    );
};

export default CustomerDetails;
