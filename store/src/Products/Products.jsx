import React, { useState, useEffect } from "react";
import Sidebar from "../ADMIN/Sidebar";
import { useParams, useNavigate } from "react-router-dom";

const Products = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "",
        name: "",
        mrp: "",
        size: "",
        quantity: "",
        description: "",
        countryOfOrigin: "",
        manufacturer: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Fetch product details if in edit mode
    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(`http://localhost:5000/api/products/${id}`);
                    if (!response.ok) throw new Error("Failed to fetch product");
                    const data = await response.json();
                    setFormData({
                        category: data.category || "",
                        name: data.name || "",
                        mrp: data.mrp || "",
                        size: data.size || "",
                        quantity: data.quantity || "",
                        description: data.description || "",
                        countryOfOrigin: data.countryOfOrigin || "",
                        manufacturer: data.manufacturer || ""
                    });
                } catch (error) {
                    console.error("Error fetching product:", error);
                    setMessage({ type: "error", text: "Failed to load product details" });
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const url = id
            ? `http://localhost:5000/api/products/${id}`
            : 'http://localhost:5000/api/product';

        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({
                    type: "success",
                    text: id ? "Product updated successfully!" : "Product added successfully!"
                });
                if (!id) {
                    setFormData({
                        category: "",
                        name: "",
                        mrp: "",
                        size: "",
                        quantity: "",
                        description: "",
                        countryOfOrigin: "",
                        manufacturer: ""
                    });
                } else {
                    // Optionally navigate back or stay on page
                    // navigate('/admin-products'); 
                }
            } else {
                const errorData = await response.json();
                setMessage({ type: "error", text: errorData.message || "Operation failed" });
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sidebar>
            <div className="flex-1 min-h-screen bg-gray-50 p-6 md:p-12 md:ml-64 transition-all duration-300">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {id ? "Edit Product" : "Add Product"}
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">
                            {id ? "Update the details of the existing product." : "Enter the details to add a new product to the inventory."}
                        </p>
                    </header>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Product Details Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-blue-500 pl-3">Product Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                                        <option value="Grains">Grains</option>
                                        <option value="Meat & Seafood">Meat & Seafood</option>
                                        <option value="Packed Foods">Packed Foods</option>
                                        <option value="Soft Drinks">Soft Drinks</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Wireless Headphones"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                                    <input
                                        type="number"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size / Variant</label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={formData.size}
                                        onChange={handleChange}
                                        placeholder="e.g. M, L, XL or 128GB"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Information Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-3">Additional Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block  text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Detailed product description..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 hover:bg-white h-32 resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country of Origin</label>
                                        <input
                                            type="text"
                                            name="countryOfOrigin"
                                            value={formData.countryOfOrigin}
                                            onChange={handleChange}
                                            placeholder="e.g. India"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                                        <input
                                            type="text"
                                            name="manufacturer"
                                            value={formData.manufacturer}
                                            onChange={handleChange}
                                            placeholder="Manufacturer Name"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-gray-50 hover:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving Product...' : (id ? 'Update Product' : 'Add Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
};

export default Products;