"use client"
import { motion } from "framer-motion"; // For animations if needed
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa"; // Import icons for user and search
import Navbar from "@/app/Navbar/page";
import { useEffect, useState } from "react";
import Link from "next/link";

const Dashboard = () => {

    interface GraphNode {
        id: string;
    }
    
    interface GraphDataItem {
        nodes?: GraphNode[]; // Optional array of nodes
        createdAt?: string;  // Date string (ISO format expected)
        indexName?:string;
        selectedProvider?:string;
    }

    const router = useRouter();
    const [graphData, setGraphData] = useState<GraphDataItem[]>([]);
    const apiURL= process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await fetch(`${apiURL}/graphData`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log("Fetched Data:", data);
    
                if (Array.isArray(data)) {
                    setGraphData(data);
                } else {
                    console.error("API did not return an array:", data);
                    setGraphData([]);
                }
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };
    
        fetchGraphData();
    }, []);
    
    


    const handleNavigation = () => {
        // Add any logout logic here (e.g., clearing auth tokens)
        router.push("/Create-Subindex"); // Redirect to login page
    };

    const handleCopy = (wallet: string) => {
        navigator.clipboard.writeText(wallet);


    };

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <Navbar />

            {/* Adding margin-top to create space below the fixed navbar */}
            <div className="mt-16 px-5 md:px-6 lg:px-14 xl:px-9">
                {/* Body Section */}
                <section className="py-16 px-6 flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Explore Decentralized Subindexes</h2>
                        <p className="mt-4 text-sm opacity-70">
                            Discover, search, and interact with AI-powered subindexes. Easily find the data you need or create your own custom subindex in just a few clicks.
                        </p>
                    </div>

                    {/* Right Content */}
                    <div className="mt-6 lg:mt-0 w-full lg:w-auto flex justify-center lg:justify-end">
                        <button
                            onClick={handleNavigation}
                            className="bg-gray-900 text-white whitespace-nowrap hover:bg-slate-500 py-2 px-4 rounded-lg">
                            Create subIndex
                        </button>
                    </div>
                </section>



                {/* Search Bar and Filter Section */}
                <section className="py-8 px-6 flex items-center">
                    {/* Search Bar with Hover & Focus Effects */}
                    <div className="w-2/3 flex items-center bg-gray-900 rounded-full px-4 py-2 transition-all duration-300 
                  hover:bg-gray-800 focus-within:bg-gray-700 border border-transparent hover:border-gray-600">
                        <input
                            type="text"
                            placeholder="Search by name, description, creator, data provider or creation date"
                            className="bg-transparent border-none outline-none text-white ml-2 placeholder-gray-400 w-full 
                 focus:placeholder-gray-500"
                        />
                        <FaSearch className="text-white" />
                    </div>

                    {/* Filter Button */}
                    <button className="ml-4 bg-gray-900 text-white py-2 px-6 rounded-3xl hover:bg-gray-800 transition">
                        Filter by
                    </button>
                </section>


                {/* SubIndex Cards Section */}
                <section className="py-8 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {graphData.map((item, index) => {
                            const encodedData = encodeURIComponent(JSON.stringify(item));

                            return (
                                <Link key={index} href={`/Ethereum-Subindex-Page?graphData=${encodedData}`} passHref>
                                    <motion.div
                                        whileHover={{
                                            opacity: 1,
                                            borderColor: "lightblue",
                                            transition: { duration: 0.3 },
                                        }}
                                        className="relative bg-[#1E1E1E] text-white p-4 w-full h-auto min-h-[350px] rounded-[20px] opacity-60 border border-transparent cursor-pointer"
                                    >
                                        {/* Top Left: Live Indicator */}
                                        <div className="absolute top-3 left-3 flex items-center">
                                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                            <span className="text-green-400 text-sm font-semibold">Live</span>
                                        </div>

                                        {/* Top Right: Powered by QuickNode */}
                                        <div className="absolute top-3 right-3 text-xs sm:text-sm text-gray-400">
                                            Powered by <span className="font-bold text-white">{item.selectedProvider}</span>
                                        </div>

                                        {/* Card Content */}
                                        <h3 className="font-bold text-lg sm:text-xl mt-14">{item.indexName}</h3>
                                        <p className="text-xs sm:text-sm mt-2 opacity-80">
                                            Aggregates and indexes Ethereum transactions, allowing users to query by sender, receiver, amount, and timestamp.
                                        </p>

                                        {/* Queries Count */}
                                        <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                            Queried: <span className="text-white">10 times</span>
                                        </p>

                                        {/* Wallet Address + Copy Button */}
                                        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between">
                                            <span className="text-xs sm:text-sm text-gray-400">
                                                Created By:{" "}
                                                <span className="text-white">
                                                    {item.nodes?.[0]?.id
                                                        ? `${item.nodes[0].id.slice(0, 6)}...${item.nodes[0].id.slice(-4)}`
                                                        : "N/A"}
                                                </span>
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCopy(item.nodes?.[0]?.id ?? "N/A");
                                                }}
                                                className="p-1 bg-gray-700 rounded-full hover:bg-gray-600 mt-2 sm:mt-0"
                                            >
                                                <Copy size={16} className="text-white" />
                                            </button>
                                        </div>

                                        {/* Creation Date */}
                                        <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                            Creation Date:{" "}
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                                        </p>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </section>



                {/* Footer Section */}
                <footer className="py-8 px-6 bg-black">
                    <div className="text-center text-lg font-semibold opacity-70">
                        <p>Powered by</p>
                        <div className="flex justify-center space-x-8 mt-4">
                            <div>
                                <img src="/Solana.png" alt="Company 1" className="w-20" />
                            </div>
                            <div>
                                <img src="/Etherium.png" alt="Company 2" className="w-20" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-32 text-center text-lg">
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
                            <a href="#" className="opacity-70 hover:text-purple-400">Home</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Playground</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Docs</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Community</a>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-sm">
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12">
                            <a href="#" className="opacity-70 hover:text-purple-400">Status</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Testnet</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Privacy Policy</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Terms of Service</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Brand Assets</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Partnership Requests</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Forum</a>
                            <a href="#" className="opacity-70 hover:text-purple-400">Security</a>
                        </div>
                    </div>


                    {/* Social Media Icons */}
                    <div className="mt-9 flex justify-center space-x-14">
                        <a href="#"><img src="/1.png" alt="Social 1" className="w-6" /></a>
                        <a href="#"><img src="/2.png" alt="Social 2" className="w-6" /></a>
                        <a href="#"><img src="/3.png" alt="Social 3" className="w-6" /></a>
                        <a href="#"><img src="/4.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/5.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/6.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/7.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/8.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/9.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/10.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/11.png" alt="Social 4" className="w-6" /></a>
                        <a href="#"><img src="/12.png" alt="Social 4" className="w-6" /></a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
