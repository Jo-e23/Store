import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);

    const fetchCustomers = async () => {
        try {

            const response = await fetch('http://localhost:5000/api/users');
            if (response.ok) {
                const customers = await response.json();
                if (customers.users) {
                    setTotalCustomers(customers.users.length);
                }
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);

        }
    };

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/orders');
            if (!response.ok) 
                throw new Error('Failed to fetch orders');
            const data = await response.json();
            const ordersData = data.orders || [];

            setOrders(ordersData);
            setTotalOrders(ordersData.length);


            const revenue = ordersData.reduce((grandTotal, order) => {
                if (order.status === 'Cancelled') return grandTotal;

                const orderTotal = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.mrp || 0)), 0)
                    : 0;
                return grandTotal + orderTotal;
            }, 0);
 
            const itemCount = ordersData.reduce((grandTotal, order) => {
                if (order.status === 'Cancelled') return grandTotal;

                const itemsInOrder = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
                    : 0;
                return grandTotal + itemsInOrder;
            }, 0);

            setTotalRevenue(revenue);
            setTotalItems(itemCount);


        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchCustomers();
    }, []);

    const navigate = useNavigate();

    return (
        <Sidebar>
            <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans md:ml-64">
              


                <div className="w-full lg:w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto lg:h-screen lg:sticky lg:top-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                            <div key={order._id || order.orderId} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">ID: {order.orderId}</h3>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium mb-1">Items:</p>
                                    <ul className="list-disc list-inside text-xs text-gray-500">
                                        {Array.isArray(order.items) ? order.items.map((item, idx) => (
                                            <li key={idx} className="truncate">
                                                {item.name} (x{item.quantity || 1})
                                            </li>
                                        )) : <li>Legacy Items Data</li>}
                                    </ul>
                                </div>
                                <div className="mt-3 text-right">
                                    <p className="text-sm font-bold text-gray-900">
                                        ₹{Array.isArray(order.items)
                                            ? order.items.reduce((sum, i) => sum + ((i.quantity || 1) * (i.mrp || 0)), 0).toFixed(2)
                                            : '0.00'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No orders found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
export default AdminDashboard;