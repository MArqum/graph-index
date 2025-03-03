"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/LandingPage/Navbar";
import { useState } from "react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push("/Dashboard"); // Redirect to Dashboard
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-900">
      <div className="w-full">
        <Navbar />
      </div>

      <div className="relative w-96 h-[450px] mt-36 overflow-hidden">
        {/* Login Section */}
        <div
          className={`absolute w-full h-full bg-[#111] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-opacity duration-500 ${
            isLogin ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <h3 className="text-2xl font-bold">Login</h3>
          <form className="w-full mt-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 text-black rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 text-black rounded"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 rounded"
            >
              Login
            </button>
          </form>

          {/* Google Login Button */}
          <button
            onClick={() => signIn("google")}
            className="w-full mt-4 p-2 bg-red-500 rounded text-white"
          >
            Sign in with Google
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className="mt-4 text-blue-500"
          >
            Dont have an account? Register
          </button>
        </div>

        {/* Signup Section */}
        <div
          className={`absolute w-full h-full bg-[#111] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-opacity duration-500 ${
            isLogin ? "opacity-0 z-0" : "opacity-100 z-10"
          }`}
        >
          <h3 className="text-2xl font-bold">Sign Up</h3>
          <form className="w-full mt-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-4 text-black rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 text-black rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 text-black rounded"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 rounded">
              Sign Up
            </button>
          </form>

          {/* Google Signup Button */}
          <button
            onClick={() => signIn("google")}
            className="w-full mt-4 p-2 bg-red-500 rounded text-white"
          >
            Sign up with Google
          </button>

          <button
            onClick={() => setIsLogin(true)}
            className="mt-4 text-blue-500"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
