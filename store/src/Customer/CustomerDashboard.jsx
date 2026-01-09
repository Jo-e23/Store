import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import CustomerSidebar from './CustomerSidebar';

const CustomerDashboard = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        items: []
    });

    const [products, setProducts] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) return;

                const userRes = await fetch(`http://localhost:5000/api/user/${email}`);
                if (!userRes.ok) throw new Error("Failed to fetch user data");

                const userData = await userRes.json();
                setForm(prev => ({
                    ...prev,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address || ""
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    const groupProductsByCategory = () => {
        const groupedProducts = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});
        return groupedProducts;
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const addToOrder = (product) => {
        setForm(prev => ({
            ...prev,
            items: [...prev.items, {
                productId: product.productId,
                name: product.name,
                size: product.size,
                mrp: product.mrp,
                quantity: 1
            }]
        }));
        alert(`${product.name} added to order!`);
    };

    const removeItem = (index) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || form.items.length === 0) {
            alert("Email and at least one item are required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully! Order ID: ' + data.orderId);
                setForm(prev => ({ ...prev, items: [] }));
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
                    <div className="mt-8">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Selected Items</label>
                        {form.items.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No items selected yet. Add items from below.</p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {form.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                            <span className="text-gray-500 text-sm ml-2">({item.size})</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Available Products</h3>
                        <div className="space-y-4">
                            {Object.entries(groupProductsByCategory()).map(([category, products]) => (
                                <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <span className="font-semibold text-gray-800 text-lg">{category} ({products.length})</span>
                                        {expandedCategories[category] ? (
                                            <ChevronUp className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>

                                    {expandedCategories[category] && (
                                        <div className="border-t border-gray-100 bg-gray-50">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-sm text-gray-600">
                                                    <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-500">
                                                        <tr>
                                                            <th className="px-6 py-3">Product Name</th>
                                                            <th className="px-6 py-3">MRP</th>
                                                            <th className="px-6 py-3">Size</th>
                                                            <th className="px-6 py-3">Stock</th>
                                                            <th className="px-6 py-3">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {products.map((product) => (
                                                            <tr key={product._id} className="hover:bg-white transition-colors">
                                                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                                <td className="px-6 py-4">₹{product.mrp}</td>
                                                                <td className="px-6 py-4">{product.size}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity < 10
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-green-100 text-green-700"
                                                                        }`}>
                                                                        {product.quantity} units
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addToOrder(product)}
                                                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-700 transition-colors"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
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
