"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Grid, Globe } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const toggleDropdown = (menu: string) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 backdrop-blur-lg ${
        isScrolled ? "bg-black/40 shadow-lg" : "bg-black/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <span className="text-white text-2xl font-bold cursor-pointer"> <img src="/logo.png" alt="AI Logo" className="w-8 h-8" /></span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-white">
          {[
            "Products",
            "Networks",
            "Participate",
            "Ecosystem",
            "Resources",
            "Pricing",
          ].map((item) => (
            <div key={item} className="relative group">
              <button
                onClick={() => toggleDropdown(item)}
                className="flex items-center space-x-1 hover:text-purple-400 transition"
              >
                <span>{item}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdown === item && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-48 bg-black/80 rounded-lg shadow-lg p-4"
                >
                  <Link href="#" className="block text-white hover:text-purple-400">Option 1</Link>
                  <Link href="#" className="block text-white hover:text-purple-400 mt-2">Option 2</Link>
                </motion.div>
              )}
            </div>
          ))}
          <Link href="#docs" className="hover:text-purple-400 transition">
            Docs
          </Link>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button
              onClick={() => toggleDropdown("Language")}
              className="flex items-center text-white hover:text-purple-400 transition"
            >
              <Globe className="w-5 h-5 mr-1" />
              English
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {dropdown === "Language" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-32 bg-black/80 rounded-lg shadow-lg p-2"
              >
                <Link href="#" className="block text-white hover:text-purple-400">
                  English
                </Link>
                <Link href="#" className="block text-white hover:text-purple-400 mt-2">
                  Spanish
                </Link>
              </motion.div>
            )}
          </div>

          {/* Apps Button */}
          <button className="flex items-center px-5 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded-lg transition">
            <Grid className="w-5 h-5 mr-2" />
            Apps
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
