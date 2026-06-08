"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  MessageSquareText,
  Store,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/restaurant",
    },
    {
      name: "Orders",
      icon: <ClipboardList size={20} />,
      href: "/restaurant/orders",
    },
    {
      name: "Menu",
      icon: <UtensilsCrossed size={20} />,
      href: "/restaurant/menu",
    },
    {
      name: "Analytics",
      icon: <BarChart3 size={20} />,
      href: "/analytics",
    },
    {
      name: "Reviews",
      icon: <MessageSquareText size={20} />,
      href: "/reviews",
    },
    {
      name: "Profile",
      icon: <Store size={20} />,
      href: "/profile",
    },
  ];

  return (
    <aside className="flex flex-col h-screen w-64 bg-white border-r border-gray-100 sticky top-0 left-0 overflow-y-auto">
      <Link
        href="/"
        className="p-6 block hover:opacity-90 transition-opacity"
      >
        <h1 className="text-[#A34F11] text-xl font-bold tracking-tight">
          GrubGo
        </h1>

        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
          Fish and chip Shop
        </p>
      </Link>

      <nav className="flex-1 mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-4 transition-all relative group ${
                isActive
                  ? "bg-[#FFEDE1] text-[#A34F11]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {/* Icon */}
              <span
                className={`mr-4 ${
                  isActive
                    ? "text-[#A34F11]"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {item.icon}
              </span>

              {/* Text */}
              <span className="font-semibold text-sm">{item.name}</span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-0 top-0 h-full w-1.5 bg-[#A34F11] rounded-l-md" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-50 space-y-1">
        <Link
          href="/settings"
          className="flex items-center px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Settings size={20} className="mr-4 text-gray-400" />

          <span className="text-sm font-semibold">Settings</span>
        </Link>

        <button className="w-full flex items-center px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group">
          <LogOut
            size={20}
            className="mr-4 text-gray-400 group-hover:text-red-500"
          />

          <span className="text-sm font-semibold">Logout</span>
        </button>

        <button className="w-full mt-4 bg-[#A34F11] text-white py-3.5 rounded-2xl font-bold shadow-md shadow-[#A34F11]/20 hover:bg-[#8B420E] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
          <LifeBuoy size={18} />
          Support Center
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;