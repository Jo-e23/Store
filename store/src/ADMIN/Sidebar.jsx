import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import bgImage from '../assets/Landing.jpeg';

const Sidebar = ({ children, shopImage: parentShopImage }) => {
    const navigate = useNavigate();
    const [shopImage, setShopImage] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(() => {
        const fetchShopImage = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/shop');
                if (response.ok) {
                    const data = await response.json();
                    if (data.image) {
                        setShopImage(data.image);
                    }
                }
            } catch (error) {
                console.error("Error fetching shop image:", error);
            }
        };
        fetchShopImage();
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            
            <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <span className="font-bold text-gray-800">Admin</span>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg ">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:flex flex-col
            `}>

                <div className="p-6 flex flex-col items-center border-b border-gray-100 relative">
                    
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 ring-4 ring-gray-50">
                        <img
                            src={parentShopImage || shopImage || bgImage}
                            alt="Shop Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-gray-900 text-center">Admin</h3>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { navigate("/admin-dashboard"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <span className="font-medium group-hover:translate-x-1 transition-transform">Dashboard</span>
                    </button>

                    <button
                        onClick={() => { navigate("/admin-orders"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <span className="font-medium group-hover:translate-x-1 transition-transform">Orders</span>
                    </button>

                    <button
                        onClick={() => { navigate("/admin-products"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <span className="font-medium group-hover:translate-x-1 transition-transform">My Products</span>
                    </button>

                    {/* Active State Example for Profile */}
                    <button
                        onClick={() => { navigate("/adminprofile"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <span className="font-medium group-hover:translate-x-1 transition-transform">Profile</span>
                    </button>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <main className="flex-1 w-full md:w-auto">
                {children}
            </main>
        </div>
    );
};

export default Sidebar;