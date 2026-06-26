"use client";

import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function AdminHeader({ onMenuToggle, isSidebarOpen }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left: mobile menu toggle + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest hidden sm:block">
          Admin Panel
        </span>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
      
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold select-none">
          A
        </div>
      </div>
    </header>
  );
}