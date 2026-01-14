import React from 'react';

const OrderCart = ({ items, removeItem }) => {
    const totalAmount = items.reduce((total, item) => total + item.quantity * item.mrp, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Selected Items</h2>

            {items.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-300 mb-6">
                    <p className="text-gray-400 text-sm italic">Your cart is empty.</p>
                    <p className="text-gray-400 text-xs mt-1">Add items from the section below.</p>
                </div>
            ) : (
                <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, index) => (
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
                    <div className="text-gray-800 text-xl md:p-2 md:mt-6 font-bold">
                        Grand Total: ₹{totalAmount}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={items.length === 0}
                className={`w-full font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all transform active:scale-[0.98]
                    ${items.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30"}`}
            >
                Place Order
            </button>
        </div>
    );
};

export default OrderCart;
