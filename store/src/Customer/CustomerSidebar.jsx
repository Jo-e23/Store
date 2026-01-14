import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Truck, ShoppingCart, User, Menu, X } from 'lucide-react';
import bgImage from '../assets/Landing.jpeg';

const CustomerSidebar = ({ children }) => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
            {/* Mobile Header */}
            <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-40">
                <span className="font-bold text-gray-800">Customers</span>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:flex flex-col
            `}>

                <div className="p-6 flex flex-col items-center border-b border-gray-100 relative">
                    {/* Close button for mobile inside sidebar */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>                   

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
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { navigate("/customer-dashboard"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Make Order</span>
                    </button>
                    <button
                        onClick={() => { navigate("/customer-orders"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Truck size={20} />
                        <span className="font-medium">Order History</span>
                    </button>
                    <button
                        onClick={() => { navigate("/customer-profile"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                    </button>
                    {/* Add more customer links here as needed */}
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="flex-1 p-4 md:p-8 w-full md:w-auto overflow-x-hidden md:ml-0">
                {children}
            </main>
        </div>
    );
};

export default CustomerSidebar;