"use client";

import { useAuth } from "@/lib/context/authContext";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
    { href: "/restaurant", label: "Dashboard", icon: "📊" },
    { href: "/restaurant/orders", label: "Orders", icon: "📦" },
    { href: "/restaurant/menu", label: "Menu", icon: "🍽️" },
    { href: "/restaurant/review", label: "Reviews", icon: "⭐" },
    { href: "/restaurant/profile", label: "Profile", icon: "🏪" },
    { href: "/restaurant/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/restaurant") return pathname === href;
        return pathname.startsWith(href);
    };
     const { logout } = useAuth(); 

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4">
            <div
                className="flex items-center gap-2 mb-8 cursor-pointer"
                onClick={() => router.push("/restaurant")}
            >
                <span className="text-2xl">🍽️</span>
                <span className="text-lg font-black text-gray-900">
                    Grub<span className="text-red-600">GO</span>
                </span>
            </div>
            <nav className="flex-1 space-y-1">
                {NAV.map(({ href, label, icon }) => (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive(href)
                                ? "bg-red-50 text-red-600 font-semibold"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        <span>{icon}</span>
                        {label}
                    </button>
                ))}
            </nav>
            <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
                <span>🚪</span>
                Log out
            </button>
        </aside>
    );
}