"use client";

import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 sticky top-0 z-10">
      
      {/* 1. Left Side: Fixed width container to prevent shifting */}
      <div className="w-48 hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-800">Search</h2>
      </div>

      <div className="flex-1 flex">
        <div className="w-full max-w-md relative group">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#A34F11] transition-colors" 
            size={18} 
          />
          <input 
            type="text"
            placeholder="Search orders, menu, or customers..."
            className="w-full bg-gray-50 border border-transparent focus:border-[#A34F11]/20 focus:bg-white focus:ring-4 focus:ring-[#A34F11]/5 py-2.5 pl-10 pr-4 rounded-xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end w-auto lg:w-max">
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
          <span className={`text-[10px] font-bold uppercase tracking-wider w-20 text-center ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
            {isOpen ? 'Store Open' : 'Store Closed'}
          </span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isOpen ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isOpen ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 bg-[#FFEDE1] rounded-xl flex items-center justify-center text-[#A34F11] border border-[#A34F11]/10 cursor-pointer">
            <User size={20} />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;