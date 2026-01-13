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
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (productId, val, max) => {
        const value = Math.max(1, Math.min(Number(val), max));
        setQuantities(prev => ({ ...prev, [productId]: value }));
    };

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
        const qty = quantities[product.productId] || 0;
        setForm(prev => {
            const existing = prev.items.find(i => i.productId === product.productId);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i => i.productId === product.productId ? { ...i, quantity: i.quantity + qty } : i)
                };
            }
            return {
                ...prev,
                items: [...prev.items, {
                    productId: product.productId,
                    name: product.name,
                    size: product.size,
                    mrp: product.mrp,
                    quantity: qty
                }]
            };
        });
        setQuantities(prev => ({ ...prev, [product.productId]: 1 }));
        alert(`${qty} x ${product.name} added to order!`);
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
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Place New Order</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* LEFT: Customer Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
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

                        {/* RIGHT: Cart / Selected Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Selected Items</h2>

                            {form.items.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-300 mb-6">
                                    <p className="text-gray-400 text-sm italic">Your cart is empty.</p>
                                    <p className="text-gray-400 text-xs mt-1">Add items from the section below.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {form.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <div>
                                                <div className="font-semibold text-gray-800">{item.name}</div>
                                                <div className="text-gray-500 text-sm mt-1">
                                                    Size: {item.size} <span className="mx-2">•</span> Qty: <span className="font-bold text-gray-700">{item.quantity} Total: ₹{item.quantity * item.mrp}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <span className="text-sm font-semibold">Remove</span>
                                            </button>
                                      </div>
                                    ))}
                                    <div className="text-gray-1800 text-xl md:p-2 md:mt-6">
                                        Grand Total: ₹{form.items.reduce((total, item) => total + item.quantity * item.mrp, 0)}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={form.items.length === 0}
                                className={`w-full font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all transform active:scale-[0.98]
                                    ${form.items.length === 0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30"}`}
                            >
                                Place Order
                            </button>
                        </div>
                        
                    </div>
                </form>

                {/* BOTTOM: Available Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Products</h2>
                    <div className="flex flex-col space-y-4">
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
                                                        <th className="px-6 py-3">Qty</th>
                                                        <th className="px-6 py-3">Total</th>
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
                                                                <input
                                                                    type="number"
                                                                    name={`qty-${product.productId}`}
                                                                    id={`qty-${product.productId}`}
                                                                    aria-label={`Quantity for ${product.name}`}
                                                                    min="1"
                                                                    max={product.quantity}
                                                                    value={quantities[product.productId] || 1}
                                                                    onChange={(e) => handleQuantityChange(product.productId, e.target.value, product.quantity)}
                                                                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                                />
                                                                {product.quantity < 1 && (
                                                                    <span className="block text-red-500 text-xs mt-1">Out of stock</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="text"
                                                                    name={`total-${product.productId}`}
                                                                    id={`total-${product.productId}`}
                                                                    aria-label={`Total price for ${product.name}`}
                                                                    readOnly
                                                                    value={(quantities[product.productId] || 1) * product.mrp}
                                                                    className="w-20 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-center text-gray-600 focus:outline-none cursor-default"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addToOrder(product)}
                                                                    disabled={product.quantity < 1}
                                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors
                                                                        ${product.quantity < 1
                                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                                            : "bg-green-600 text-white hover:bg-green-700"}`}
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
            </div>
        </CustomerSidebar>
    );
};

export default CustomerDashboard;
