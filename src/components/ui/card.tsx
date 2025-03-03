"use client";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-[#111] opacity-30 p-8 h-[280px] rounded-lg text-white flex flex-col items-center justify-center text-center shadow-md transition-all duration-300 border border-transparent hover:opacity-100 hover:border-blue-500 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
