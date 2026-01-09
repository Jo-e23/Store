import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import LandingBg from "../assets/Landing.jpeg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpStage, setIsOtpStage] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        setError(null);
        if (!email) {
            setError("Please enter your email");
            return;
        }
        setIsLoading(true);

        fetch("http://localhost:5000/admin/send-login-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "OTP sent to your email.") {
                    setIsOtpStage(true);
                } else {
                    setError(data.message || "Failed to send OTP");
                }
            })
            .catch((err) => {
                console.error("Login error:", err);
                setError("Network error. Please try again.");
            })
            .finally(() => setIsLoading(false));
    };

    const handleLogin = (e) => {
        if (e) e.preventDefault();
        setError(null);
        if (otp.length < 4) {
            setError("Please enter a valid OTP");
            return;
        }

        setIsLoading(true);

        fetch("http://localhost:5000/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Login successful!") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("userEmail", email);

                    // Role based navigation
                    if (data.role === "admin") navigate("/adminprofile");
                    else if (data.role === "customer") navigate("/customer-dashboard");
                    else if (data.role === "service-man") navigate("/serviceman-dashboard");
                    else navigate("/");
                } else {
                    setError(data.message || "Login failed");
                }
            })
            .catch((err) => {
                console.error("Login error:", err);
                setError("Network error. Please try again.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 relative font-sans">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 blur-sm"
                style={{ backgroundImage: `url(${LandingBg})` }}
            >
                {/* <div className="absolute inset-0 bg-gray-900/60"></div> */}
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/20">
                    <div className="p-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                                {isOtpStage ? "Enter OTP" : "Welcome Back"}
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                {isOtpStage ? `Sent to ${email}` : "Sign in to your account to continue"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100 text-center flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {!isOtpStage ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50/50"
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                        ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
                                >
                                    {isLoading ? "Sending..." : "Get OTP"}
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
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]
                                      ${isLoading ? "bg-green-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"}`}
                                >
                                    {isLoading ? "Verifying..." : "Login"}
                                </button>

                                <button
                                    onClick={() => {
                                        setIsOtpStage(false);
                                        setOtp("");
                                        setError(null);
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                >
                                    Change Email
                                </button>
                            </div>
                        )}

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
