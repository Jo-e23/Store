import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import AdminProfile from './AdminProfile';
import AdminDashboard from './AdminDashboard';
import { LayoutDashboard, Truck, ShoppingCart, User } from 'lucide-react';
import bgImage from '../assets/Landing.jpeg';
const Sidebar = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">

                <div className="p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mb-3">
                        <img
                            src={bgImage}
                            alt="Shop Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center">Admin</h3>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => navigate("/admin-dashboard")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => navigate("/admin-orders")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Truck size={20} />
                        <span className="font-medium">Orders</span>
                    </button>

                    <button
                        onClick={() => navigate("/admin-products")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <ShoppingCart size={20} />
                        <span className="font-medium">My Products</span>
                    </button>

                    {/* Active State Example for Profile */}
                    <button
                        onClick={() => navigate("/adminprofile")}
                        className="flex items-center gap-3 w-full px-4 py-3 bg-green-50 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </button>
                </nav>
            </aside>
            {children}
        </>
    );
};

export default Sidebar;