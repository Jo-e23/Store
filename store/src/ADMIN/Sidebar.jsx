import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import bgImage from '../assets/Landing.jpeg';
const Sidebar = ({ children, shopImage: parentShopImage }) => {
    const navigate = useNavigate();
    const [shopImage, setShopImage] = useState(null);

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
        <>
            <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">

                <div className="p-6 flex flex-col items-center border-b border-gray-100">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mb-3">
                        <img
                            src={parentShopImage || shopImage || bgImage}
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

                        <span className="font-medium">Dashboard</span>
                    </button>

                    <button
                        onClick={() => navigate("/admin-orders")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">

                        <span className="font-medium">Orders</span>
                    </button>

                    <button
                        onClick={() => navigate("/admin-products")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="font-medium">My Products</span>
                    </button>

                    {/* Active State Example for Profile */}
                    <button
                        onClick={() => navigate("/adminprofile")}
                        className="flex items-center gap-3 w-full px-4 py-3  text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="font-medium">Profile</span>
                    </button>
                </nav>
            </aside>
            {children}
        </>
    );
};

export default Sidebar;