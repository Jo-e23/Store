import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
const Phone = () => {
    const [phone,setPhone] = useState("");
    const navigate = useNavigate();
    return (
          <div
            className="flex items-center justify-center bg-cover bg-center bg-no-repeat h-screen w-full relative"
            style={{ backgroundImage: `url("src/assets/Landing.jpeg")` }}
        >

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white backdrop-blur-sm rounded-lg shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-8 flex flex-col items-center gap-6 w-full">

                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Enter Phone Number</h1>
                        </div>
                        <input type="number" placeholder="Enter Phone Number" 
                        className="w-full p-2 border border-gray-300 rounded"
                        value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phone;