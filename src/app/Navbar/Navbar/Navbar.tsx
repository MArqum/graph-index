"use client";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        router.push("/Login");
    };

    return (
        <nav className="bg-[#121212] py-4 px-6 flex justify-between items-center relative">
            {/* Mobile Menu Button */}
            <button className="lg:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo & Links */}
            <div className="flex items-center space-x-8">
                <img src="/logo.png" alt="AI Logo" className="w-8 h-8" />
                <div className={`absolute top-full left-0 w-full bg-[#121212] lg:static lg:flex lg:space-x-8 lg:bg-transparent ${menuOpen ? "block" : "hidden"} lg:block`}>
                    <Link href="/Ethereum-Subindex-Page" className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400">PlayGround</Link>
                    <Link href="/" className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400">Docs</Link>
                    <Link href="/" className="block py-2 px-6 text-lg font-semibold text-white hover:text-purple-400">Community</Link>
                </div>
            </div>

            {/* User & Wallet Button */}
            <div className="flex items-center space-x-4">
                <FaUser className="text-white hover:text-purple-400 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                <button className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                    Connect to Wallet
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-6 top-16 w-40 bg-[#111] border border-gray-700 rounded-lg shadow-lg">
                    <ul className="text-white">
                        <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => alert("Settings Clicked")}>Settings</li>
                        <li className="px-4 py-2 hover:bg-red-600 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
