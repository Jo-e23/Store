import AdminProfile from "./ADMIN/AdminProfile";
import Sidebar from "./ADMIN/Sidebar";
import Landing from "./Basic/Landing";
import Login from "./Basic/Login";
import Register from "./Basic/Register";
import Products from "./Products/Products";
import AdminDashboard from "./ADMIN/AdminDashboard";
import CustomerProfile from "./Customer/CustomerProfile";
import AdminOrders from "./ADMIN/AdminOrders";
import AdminProducts from "./ADMIN/AdminProducts";
import CustomerSidebar from "./Customer/CustomerSidebar";
import CustomerDashboard from "./Customer/CustomerDashboard";
// import ServiceManDashboard from "./Basic/ServiceManDashboard";
import CustomerOrders from "./Customer/CustomerOrders"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>


                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard Routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<Products />} />
                <Route path="/sidebar" element={<Sidebar />} />
                {/*Customer Routes */}
                <Route path="/customer-sidebar" element={<CustomerSidebar />} />
                <Route path="/customer-orders" element={<CustomerOrders />} />
                <Route path="/customer-profile" element={<CustomerProfile />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                {/*Admin Routes */}
                <Route path="/adminprofile" element={<AdminProfile />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-orders" element={<AdminOrders />} />
                <Route path="/admin-products" element={<AdminProducts />} />
            </Routes>
        </Router>
    );
}

export default App;
