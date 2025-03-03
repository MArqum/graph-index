"use client";

import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Navbar from '@/app/Navbar/page';

// Custom Card component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1E1E1E] rounded-2xl p-4 shadow-lg ${className}`}>{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="h-48 overflow-auto text-sm leading-6">{children}</div>
);

// Custom Button component
const Button = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button
    className={`bg-[#1E1E1E] hover:bg-[#141414] border-black text-white px-4 py-2 rounded-xl transition flex items-center justify-center space-x-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Custom Input and Textarea components
const Input = ({ ...props }) => (
  <input
    className="bg-gray-800 text-white rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    className="bg-gray-800 text-white rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  />
);

const Playground = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />

      <div className="p-4 space-x-4 mt-16 flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#1E1E1E] rounded-2xl p-4 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="AI Logo" className="w-8 h-8" />
              <h2 className="text-lg font-semibold">AI Name</h2>
            </div>
            <FiSearch className="text-xl cursor-pointer" />
          </div>
          <div className="flex justify-end space-x-4 mb-4">
            <IoMdHelpCircleOutline className="text-xl cursor-pointer" />
            <BsThreeDotsVertical className="text-xl cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="mb-6">
              <p className="text-xs text-gray-400">Today</p>
              <p className="mt-1 cursor-pointer hover:text-blue-500">Query History</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Yesterday</p>
              <p className="mt-1 cursor-pointer hover:text-blue-500">Query History</p>
              <p className="mt-1 cursor-pointer hover:text-blue-500">Query History</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">User's Query</h2>
          </div>

          <Card className="h-64">
            <CardContent>
              <p>
                This is an example of a response given or provided by this AI chatbot. Responses are liable to be awesome! This is an example of a response given or provided by this AI chatbot. Responses are liable to be awesome! This is an example of a response given or provided by this AI chatbot. Responses are liable to be awesome!
              </p>
            </CardContent>
          </Card>

          <Textarea
            className="h-52 rounded-lg bg-[#1E1E1E] p-2"
            placeholder="Input query"
            value={query}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setQuery(e.target.value)}
          />

          <div className="flex space-x-4">
            <Button>List top 10 Ethereum transactions</Button>
            <Button>How NFT sales above 5 ETH</Button>
            <Button>Find all transactions from 0xABC...123</Button>
          </div>
        </div>

        {/* Query Results */}
        <div className="w-1/4 bg-[#1E1E1E] rounded-2xl p-4 shadow-lg relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Query Results</h2>
            <Button className="px-3 py-1 text-sm">JSON ⟳</Button>
          </div>

          <Card className="mt-4 h-64">
            <CardContent>
              <p>No results yet</p>
            </CardContent>
          </Card>

          <button className="absolute bottom-4 right-4 bg-[#121212] text-white px-4 py-2 rounded-xl transition flex items-center justify-center space-x-2">Export</button>
        </div>
      </div>
    </div>
  );
};

export default Playground;
