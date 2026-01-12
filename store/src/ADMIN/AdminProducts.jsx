import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { Plus, Search, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCategories, setExpandedCategories] = useState({});
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const groupedProducts = useMemo(() => {
        const groups = {};


        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Then group
        filtered.forEach(product => {
            const category = product.category || "Uncategorized";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(product);
        });

        return groups;
    }, [products, searchTerm]);

    const handleEdit = (productId) => {
        navigate(`/products/${productId}`);
    };

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    const updatedProduct = { ...products, quantity: products.quantity - 1 }


    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleAddProduct = () => {
        navigate('/products'); // Navigate to the add product page
    };

    return (
        <Sidebar>
            <div className="flex-1 min-h-screen bg-gray-50 p-6 md:p-12 md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">My Product Listing</h1>

                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    name="search"
                                    id="search-products-input"
                                    placeholder="Search for products or categories"
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-80"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddProduct}
                        className="mb-8 flex items-center bg-gray-400 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <div className="h-5 w-5" />
                        Add a Product
                    </button>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                            Error: {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-2 text-gray-500">Loading products...</p>
                        </div>
                    )}

                    {/* Categories List (Accordion Style) */}
                    {!loading && !error && (
                        <div className="space-y-4">
                            {Object.keys(groupedProducts).length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">No products found matching your search.</p>
                                </div>
                            ) : (
                                Object.entries(groupedProducts).map(([category, items]) => (
                                    <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <span className="font-semibold text-gray-800 text-lg">{category} ({items.length})</span>
                                            {expandedCategories[category] ? (
                                                <ChevronUp className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>

                                        {/* Expanded Content */}
                                        {expandedCategories[category] && (
                                            <div className="border-t border-gray-100 bg-gray-50">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm text-gray-600">
                                                        <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-500">
                                                            <tr>
                                                                <th className="px-6 py-3">Product ID</th>
                                                                <th className="px-6 py-3">Product Name</th>
                                                                <th className="px-6 py-3">MRP</th>
                                                                <th className="px-6 py-3">Size</th>
                                                                <th className="px-6 py-3">Stock</th>

                                                                <th className="px-6 py-3">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {items.map((product) => (
                                                                <tr key={product._id} className="hover:bg-white transition-colors">
                                                                    <td className="p-5 font-medium text-gray-900 whitespace-nowrap">
                                                                        #{product.productId}</td>
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
                                                                    <td className=" px-6 py-4 ">
                                                                        <button className="rounded-lg bg-blue-500 text-white px-6 py-4" onClick={() =>
                                                                            handleEdit(product._id)
                                                                        }
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <span className="px-6 py-4"></span>
                                                                        <button className="px-6 py-4 rounded-lg bg-red-500 text-white" onClick={() =>
                                                                            handleDelete(product._id)
                                                                        }
                                                                        >
                                                                            Delete
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
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};

export default AdminProducts;