import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomerSidebar from './CustomerSidebar';

const CustomerProfile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userDetails, setUserDetails] = useState({
        name: '',
        phone: '',
        email: ''
    });
   

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) return;
                const userRes = await fetch(`http://localhost:5000/api/user/${email}`);

                const userData = await userRes.json();
                setUserDetails({
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email
                });



            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
        alert('Logout successful');
        message.success('Logout successful');
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setIsEditing(true);
    };


    const handleShopChange = (e) => {
        const { name, value } = e.target;
        setShopDetails(prev => ({
            ...prev,
            [name]: value
        }));
        setIsEditing(true);
    };
    // const handleShopSave = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch('http://localhost:5000/api/shop', {
    //             method: 'POST',
    //             body: JSON.stringify({
    //                 name: shopDetails.storename,
    //                 phone: shopDetails.phone,
    //                 gst: shopDetails.gst
    //             }),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         if (response.ok) {
    //             console.log('Saving changes:', shopDetails);
    //             setIsEditing(false);
    //             alert('Changes saved successfully');
    //         } else {
    //             alert('Failed to save changes');
    //         }
    //     } catch (error) {
    //         console.error('Error saving shop details:', error);
    //         alert('Error saving changes');
    //     }
    // }
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem("userEmail");
            const response = await fetch(`http://localhost:5000/api/user/${email}`, {
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
        { id: 'profile', label: 'Profile Details' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
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

            default:
                return null;
        }
    };

    return (
        <CustomerSidebar>
            <div className="bg-gray-100 grid grid-cols-2 rounded-xl shadow-sm border border-gray-100  max-w-full animate-fade-in">
                <aside className="w-full  md:w-64 bg-transparent p-6 flex flex-col gap-6">
                    <nav className="flex flex-col space-y-2 ">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-green-50 text-green-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >

                                {item.label}
                            </button>
                        ))}

                        <div className="pt-4 mt-auto">
                            <button
                                onClick={() => handleLogout()}
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors w-full text-left"
                            >

                                Logout
                            </button>
                        </div>
                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-10">
                    {renderContent()}
                </main>
            </div>
        </CustomerSidebar>
    );
};
export default CustomerProfile;