import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
    const navigate = useNavigate();
    return( 
        <Sidebar>
            <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans md:ml-64">
                <aside className="w-full md:w-64 bg-transparent p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome Admin</h2>
                </aside>
            </div>
        </Sidebar>
    );
}
export default AdminDashboard;