import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import LandingBg from "../assets/Landing.jpeg";

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        email: "",
        address: "",
        phone: "",
        role: "customer",
    });

    const [error, setError] = useState(null);
    const [isOtpStage, setIsOtpStage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Validations
        const validatePhone = (phone) => /^\d{10}$/.test(phone);
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!validateEmail(formData.email)) {
            setError("Invalid email format");
            return;
        }
        if (!validatePhone(formData.phone)) {
            setError("Phone number must contain exactly 10 digits");
            return;
        }

        setIsLoading(true);

        fetch("http://localhost:5000/admin/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "OTP sent to your email. Please verify.") {
                    setIsOtpStage(true);
                    setError(null);
                } else {
                    setError(data.message || "Signup failed");
                }
            })
            .catch((err) => {
                console.error("Signup error:", err);
                setError("Network error. Please try again.");
            })
            .finally(() => setIsLoading(false));
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) {
            setError("Please enter a valid OTP");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/admin/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });

            const data = await res.json();

            if (data.message.includes("verified successfully")) {
                navigate("/login");
            } else {
                setError(data.message || "Invalid OTP. Try again.");
            }
        } catch (err) {
            console.error("OTP Verification Error:", err);
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 relative font-sans overflow-y-auto py-10">
            {/* Background */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 blur-sm"
                style={{ backgroundImage: `url(${LandingBg})` }}
            >
                <div className="absolute inset-0 bg-gray-900/60"></div>
            </div>

            <div className="relative z-10 w-full max-w-xl p-4">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/20">
                    <div className="p-8">

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                                {isOtpStage ? "Verify Your Email" : "Create Account"}
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                {isOtpStage ? "We've sent a code to your email." : "Join us to shop the best products."}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        {!isOtpStage ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50/50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full mt-6 py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                                      ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
                                >
                                    {isLoading ? "Processing..." : "Sign Up"}
                                </button>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center space-y-8 animate-fade-in">
                                <div className="w-full flex justify-center">
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={4}
                                        renderSeparator={<span className="mx-2 text-gray-400">-</span>}
                                        renderInput={(props) => (
                                            <input
                                                {...props}
                                                style={{ width: "3.5rem", height: "3.5rem" }}
                                                className="text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 text-gray-800 transition-all"
                                            />
                                        )}
                                    />
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                                      ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"}`}
                                >
                                    {isLoading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button
                                    onClick={() => setIsOtpStage(false)}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Back to Signup
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center border-t border-gray-100 pt-6">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                    Log In
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
