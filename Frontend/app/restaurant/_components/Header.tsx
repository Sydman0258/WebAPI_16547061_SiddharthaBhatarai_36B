"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
    "/restaurant": "Dashboard",
    "/restaurant/orders": "Orders",
    "/restaurant/menu": "Menu",
    "/restaurant/review": "Reviews",
    "/restaurant/profile": "Profile",
    "/restaurant/settings": "Settings",
};

export default function Header() {
    const pathname = usePathname();
    const title = Object.entries(TITLES).find(([key]) =>
        pathname === key || pathname.startsWith(key + "/")
    )?.[1] ?? "Dashboard";

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 justify-between">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </header>
    );
}