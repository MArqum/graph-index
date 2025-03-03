import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        router.push("/Login");
    };

    return (
        <nav className="bg-[#121212] py-4 px-6 flex justify-between items-center">
            <div className="flex ml-12 space-x-8">
            <span className="text-white text-2xl font-bold cursor-pointer"> <img src="/logo.png" alt="AI Logo" className="w-8 h-8" /></span>
                <a href="#" className="text-lg font-semibold hover:text-purple-400">PlayGround</a>
                <a href="#" className="text-lg font-semibold hover:text-purple-400">Docs</a>
                <a href="#" className="text-lg font-semibold hover:text-purple-400">Community</a>
            </div>

            <div
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaUser className="text-white hover:text-purple-400" />
                <button className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                    Connect to Wallet
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-60 top-12 mt-2 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-lg">
                    <ul className="text-white">
                        <li
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => alert("Settings Clicked")}
                        >
                            Settings
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-red-600 cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
