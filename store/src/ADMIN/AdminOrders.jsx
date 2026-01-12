import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('Pending');
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders');
            const data = await response.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const [productId, setProductId] = useState('');

    const fetchProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`);
            const data = await response.json();
            if (data.product) {
                setProductId(data.product);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch('http://localhost:5000/api/order/status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            const data = await response.json();
            if (response.ok) {
                // Refresh orders to reflect changes
                fetchOrders();
            } else {
                alert("Failed to update status: " + data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        }
    };

    const getFilteredOrders = () => {
        switch (activeTab) {
            case 'Pending':
                return orders.filter(order => order.status === 'Pending');
            case 'Processing':
                return orders.filter(order => order.status === 'Processing');
            case 'Packed':
                return orders.filter(order => order.status === 'Packed');
            case 'Completed':
                return orders.filter(order => order.status === 'Completed');
            // case 'Cancelled':
            //     return orders.filter(order => order.status === 'Cancelled');
            default:
                return orders;
        }
    };

    const tabs = ['Pending', 'Processing', 'Packed', 'Completed'];//,cancelled
    
    const getNextStatus = (currentStatus) => {
        if (currentStatus === 'Pending') return 'Processing';
        if (currentStatus === 'Processing') return 'Packed';
        if (currentStatus === 'Packed') return 'Completed';
        return null;
    };

    const StatusBadge = ({ status }) => {
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    return (
        <Sidebar>
            <div className="flex-1 min-h-screen bg-gray-50 p-6 md:p-12 md:ml-64 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
                        <p className="text-lg text-gray-500 mt-2">Manage and track all customer orders.</p>
                    </header>
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-6 text-sm font-medium transition-all duration-200 relative ${activeTab === tab
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                    }`}>
                                    {orders.filter(o => o.status === tab).length}
                                </span>
                            </button>
                        ))}
                    </div>


                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400 animate-pulse">Loading orders...</div>
                        ) : getFilteredOrders().length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="text-gray-300 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No Orders Here</h3>
                                <p className="text-gray-500">There are no orders in the {activeTab} status.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                                        <tr>
                                            <th className="p-5 border-b border-gray-100">Order ID</th>
                                            <th className="p-5 border-b border-gray-100">Customer Info</th>
                                            <th className="p-5 border-b border-gray-100">Items</th>
                                            <th className="p-5 border-b border-gray-100">Qty</th>
                                            <th className="p-5 border-b border-gray-100">Total</th>
                                            <th className="p-5 border-b border-gray-100">Items Id</th>
                                            <th className="p-5 border-b border-gray-100">Date</th>
                                            <th className="p-5 border-b border-gray-100">Status</th>
                                            <th className="p-5 border-b border-gray-100 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {getFilteredOrders().map((order) => (
                                            <tr key={order._id} className="hover:bg-blue-50/50 transition-colors group">
                                                <td className="p-5 font-medium text-gray-900 whitespace-nowrap">
                                                    #{order.orderId}
                                                </td>
                                                <td className="p-5">
                                                    <div className="font-semibold text-gray-900 text-base">{order.customerName}</div>
                                                    <div className="text-gray-500 mt-0.5">{order.customerPhone}</div>
                                                    <div className="text-gray-400 text-xs mt-1 truncate max-w-[200px]" title={order.customerAddress}>
                                                        {order.customerAddress}
                                                    </div>
                                                </td>
                                                <td className="p-5 max-w-xs">
                                                    <div className="text-gray-600 text-sm">
                                                        {Array.isArray(order.items) ? (
                                                            order.items.map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.name} <span className="text-xs text-gray-400">({item.size})</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            // Legacy support for string items
                                                            order.items
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5 max-w-xs">
                                                    <div className="text-gray-600 text-sm">
                                                        {Array.isArray(order.items) ? (
                                                            order.items.map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {item.quantity}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            // Legacy support for string items
                                                            order.items
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5 max-w-xs">
                                                    <div className="text-gray-600 text-sm">
                                                        {Array.isArray(order.items) ? (
                                                            order.items.map((item, i) => (
                                                                <div key={i} className="mb-1">
                                                                    {order.items.reduce((total, item) => total + item.quantity * item.mrp, 0)}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            // Legacy support for string items
                                                            order.items
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5 max-w-xs">
                                                    <div className="text-gray-500 text-xs font-mono">
                                                        {Array.isArray(order.items) ? (
                                                            order.items.map((item, i) => (
                                                                <div key={i} className="mb-1 truncate" title={item.productId}>
                                                                    {item.productId}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400 italic">Legacy Order</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-5 whitespace-nowrap text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                        // year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(order.createdAt).toLocaleTimeString(undefined, {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="p-5 text-right space-x-2 whitespace-nowrap">
                                                    {getNextStatus(order.status) && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                                                            className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                                        >
                                                            {getNextStatus(order.status) === 'Processing' ? 'Accept Order' :
                                                                getNextStatus(order.status) === 'Packed' ? 'Mark Packed' :
                                                                    'Complete'}
                                                        </button>
                                                    )}

                                                    {order.status !== 'Cancelled' && order.status !== 'Packed' && order.status !== 'Completed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default AdminOrders;
