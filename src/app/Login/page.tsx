// src/Login/page.tsx
"use client";
import Login from './Login/Login';
import { SessionProvider } from 'next-auth/react';

const Page = () => {
  return (
    <div className="min-h-screen text-white font-sans relative bg-gradient-to-b from-purple-900 to-black flex justify-center items-center">
      <SessionProvider><Login /></SessionProvider>
    </div>
  );
};

export default Page;
