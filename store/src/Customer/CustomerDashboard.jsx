import React, { useState, useEffect } from 'react';
import CustomerSidebar from './CustomerSidebar';
import CustomerDetails from './CustomerDetails';
import OrderCart from './OrderCart';
import ProductCatalog from './ProductCatalog';

const CustomerDashboard = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        items: []
    });

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) return;

                const userRes = await fetch(`http://localhost:5000/api/user/${email}`);
                if (!userRes.ok) throw new Error("Failed to fetch user data");

                const userData = await userRes.json();
                setForm(prev => ({
                    ...prev,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address || ""
                }));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, []);

    const addToOrder = (product, qty) => {
        setForm(prev => {
            const existing = prev.items.find(i => i.productId === product.productId);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map(i => i.productId === product.productId ? { ...i, quantity: i.quantity + qty } : i)
                };
            }
            return {
                ...prev,
                items: [...prev.items, {
                    productId: product.productId,
                    name: product.name,
                    size: product.size,
                    mrp: product.mrp,
                    quantity: qty
                }]
            };
        });
        alert(`${qty} x ${product.name} added to order!`);
    };

    const removeItem = (index) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || form.items.length === 0) {
            alert("Email and at least one item are required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully! Order ID: ' + data.orderId);
                setForm(prev => ({ ...prev, items: [] }));
            } else {
                alert('Failed to place order: ' + data.message);
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("An error occurred while placing the order.");
        }
    };

    return (
        <CustomerSidebar>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Place New Order</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* LEFT: Customer Details */}
                        <CustomerDetails form={form} handleChange={handleChange} />

                        {/* RIGHT: Cart / Selected Items */}
                        <OrderCart items={form.items} removeItem={removeItem} />

                    </div>
                </form>

                {/* BOTTOM: Available Products */}
                <ProductCatalog products={products} addToOrder={addToOrder} />
            </div>
        </CustomerSidebar>
    );
};

export default CustomerDashboard;
