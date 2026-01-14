import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store, Wallet, Info, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userDetails, setUserDetails] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [shopDetails, setShopDetails] = useState({
        storename: '',
        phone: '',
        gst: '',
        otp: '',
        otpExpiry: ''
    })
    const [walletBalance, setWalletBalance] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [adminRes, shopRes] = await Promise.all([
                    fetch('http://localhost:5000/api/admin'),
                    fetch('http://localhost:5000/api/shop')
                ]);

                const adminData = await adminRes.json();
                setUserDetails({
                    name: adminData.name,
                    phone: adminData.phone,
                    email: adminData.email
                });
                setWalletBalance(adminData.walletBalance);

                if (shopRes.ok) {
                    const shopData = await shopRes.json();
                    setShopDetails({
                        storename: shopData.name,
                        phone: shopData.phone,
                        gst: shopData.gst,
                        image: shopData.image
                        // otp: shopData.otp,
                        // otpExpiry: shopData.otpExpiry
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAdminData();
    }, []);

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
        alert('Logout successful');

    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setIsEditing(true);
    };


    const handleShopChange = async (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setShopDetails(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setShopDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setIsEditing(true);
    };

    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/orders');
            if (!response.ok)
                throw new Error('Failed to fetch orders');
            const data = await response.json();
            const ordersData = data.orders || [];

            setOrders(ordersData);


            const revenue = ordersData.reduce((grandTotal, order) => {
                if (order.status === 'Cancelled') return grandTotal;

                const orderTotal = Array.isArray(order.items)
                    ? order.items.reduce((sum, item) => sum + ((item.quantity || 1) * (item.mrp || 0)), 0)
                    : 0;
                return grandTotal + orderTotal;
            }, 0);

            setTotalRevenue(revenue);


        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrder();
    }, []);

    const handleShopSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/shop', {
                method: 'POST',
                body: JSON.stringify({
                    name: shopDetails.storename,
                    phone: shopDetails.phone,
                    gst: shopDetails.gst,
                    image: shopDetails.image
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                console.log('Saving changes:', shopDetails);
                setIsEditing(false);
                alert('Changes saved successfully');
            } else {
                const errorData = await response.json();
                alert('Failed to save changes: ' + (errorData.message || response.statusText));
            }
        } catch (error) {
            console.error('Error saving shop details:', error);
            alert('Error saving changes');
        }
    }
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails),
            });

            if (response.ok) {
                console.log('Saving changes:', userDetails);
                setIsEditing(false);
                alert('Changes saved successfully');
            } else {
                alert('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving admin details:', error);
            alert('Error saving changes');
        }
    };

    const navItems = [
        { id: 'profile', label: 'Profile Details', icon: User },
        { id: 'shop', label: 'Shop Details', icon: Store },
        { id: 'wallet', label: 'My Wallet', icon: Wallet },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-xl shadow-sm  border border-gray-100 p-8 max-w-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold hover:bg-green-50 text-gray-900">Profile Details</h2>
                        </div>

                        <form className="space-y-6" onSubmit={handleSave}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 block">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userDetails.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 block">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={userDetails.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900 block">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={userDetails.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900 pr-20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isEditing}
                                className={`w-full font-semibold py-3 rounded-lg mt-8 transition-colors ${isEditing
                                    ? 'bg-green-600 text-white hover:bg-green-200 cursor-pointer'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                );
            case 'shop':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Shop Details</h2>
                        </div>
                        <form className="space-y-6" onSubmit={handleShopSave}>
                            <div className="space-y-2">
                                <label className="text sm font-semibold text-gray-900 block">Shop Name</label>
                            </div>
                            <div className=" relative">
                                <input
                                    type="text"
                                    name="storename"
                                    value={shopDetails.storename || ''}
                                    onChange={handleShopChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900" />
                            </div>
                            <div className="relative">
                                <label className="text sm font-semibold text-gray-900 block">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={shopDetails.phone || ''}
                                    onChange={handleShopChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900" />
                            </div>
                            <div className="relative">
                                <label className="text sm font-semibold text-gray-900 block">GSTIN</label>
                                <input
                                    type="text"
                                    name="gst"
                                    value={shopDetails.gst || ''}
                                    onChange={handleShopChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900" />
                            </div>
                            <div className="relative" id="img">
                                <label className="text sm font-semibold text-gray-900 block">Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    placeholder='Upload Image'
                                    onChange={handleShopChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-900" />
                                {shopDetails.image && <img src={shopDetails.image} alt="Preview" className="h-20 w-20 object-cover mt-2 rounded-md" />}
                            </div>

                            <button
                                type="submit"
                                disabled={!isEditing}
                                className={`w-full font-semibold py-3 rounded-lg mt-8 transition-colors ${isEditing
                                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Save Changes
                            </button>
                        </form >
                    </div >
                );
            case 'wallet':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">My Wallet</h2>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                            <p className="text-sm text-green-600 font-medium mb-1">Current Balance</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue)}
                            </h3>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Sidebar >
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
                <aside className="w-full md:w-64 bg-transparent p-6 flex flex-col gap-6">
                    <nav className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-green-50 text-green-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}

                        <div className="pt-4 mt-auto">
                            <button
                                onClick={() => handleLogout()}
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors w-full text-left"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-10">
                    {renderContent()}
                </main>
            </div>
        </Sidebar>
    );
};
export default AdminProfile;