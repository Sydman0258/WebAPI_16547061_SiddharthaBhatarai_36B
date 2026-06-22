"use client";

import { useRouter, usePathname } from "next/navigation";

const NAV = [
    { href: "/driver/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/driver/deliveries", label: "Deliveries", icon: "🚗" },
    { href: "/driver/earnings", label: "Earnings", icon: "💰" },
];

export default function DriverNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <nav className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/driver/dashboard")}>
                <span className="text-xl">🚗</span>
                <span className="text-lg font-black text-gray-900">Grub<span className="text-red-600">GO</span></span>
            </div>
            <div className="flex items-center gap-1">
                {NAV.map(({ href, label, icon }) => (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isActive(href) ? "bg-red-50 text-red-600 font-semibold" : "text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        <span>{icon}</span>
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
                <button
                    onClick={() => router.push("/login")}
                    className="ml-2 px-3 py-2 text-sm text-gray-400 hover:text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all"
                >
                    Log out
                </button>
            </div>
        </nav>
    );
}