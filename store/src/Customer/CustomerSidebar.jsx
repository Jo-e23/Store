import React from 'react';
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Truck, ShoppingCart, User } from 'lucide-react';
import bgImage from '../assets/Landing.jpeg';

const CustomerSidebar = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <aside className="hidden md:flex flex-col w-63 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">

                <div className="p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mb-3">
                        <img
                            src={bgImage}
                            alt="Shop Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center">Customer</h3>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => navigate("/customer-dashboard")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Make Order</span>
                    </button>
                    <button
                        onClick={() => navigate("/customer-orders")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Truck size={20} />
                        <span className="font-medium">Order History</span>
                    </button>
                    <button
                        onClick={() => navigate("/customer-profile")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </button>
                    {/* Add more customer links here as needed */}
                </nav>
            </aside>
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
};

export default CustomerSidebar;