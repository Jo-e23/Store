import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductCatalog = ({ products, addToOrder }) => {
    const [expandedCategories, setExpandedCategories] = useState({});
    const [quantities, setQuantities] = useState({});

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

    const handleQuantityChange = (productId, val, max) => {
        const value = Math.max(1, Math.min(Number(val), max));
        setQuantities(prev => ({ ...prev, [productId]: value }));
    };

    const handleAddClick = (product) => {
        const qty = quantities[product.productId] || 1;
        addToOrder(product, qty);
        setQuantities(prev => ({ ...prev, [product.productId]: 1 }));
    };

    const groupedProducts = groupProductsByCategory();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Products</h2>
            <div className="flex flex-col space-y-4">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                    <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className="font-semibold text-gray-800 text-lg">{category} ({categoryProducts.length})</span>
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
                                            {categoryProducts.map((product) => (
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
                                                            onClick={() => handleAddClick(product)}
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
    );
};

export default ProductCatalog;
