import { useNavigate } from "react-router-dom";
import LandingBg from "../assets/Landing.jpeg";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen w-full overflow-hidden font-sans">
            
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform scale-105 animate-slow-zoom"
                style={{ backgroundImage: `url(${LandingBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90"></div>
            </div>

            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white text-2xl font-bold tracking-tighter">Store<span className="text-blue-400">.</span></div>
                <div className="flex gap-4">
                 
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                <div className="max-w-3xl animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                        Elevate Your Business
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Upscale your business from this moment
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-3 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg active:scale-95 min-w-[160px]"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105 shadow-lg active:scale-95 min-w-[160px] backdrop-blur-sm"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 w-full text-center z-10">
                <p className="text-gray-400 text-sm">© 2026 Store Inc. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Landing;
