"use client";

import { getRestaurantMenu } from "@/lib/actions/menu_actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RestaurantCard({ restaurant }: { restaurant: any }) {
    const router = useRouter();
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const result = await getRestaurantMenu(restaurant._id);
            if (result?.success && result?.data) {
                setMenuItems(result.data);
            }
        };
        fetchMenu();
    }, [restaurant._id]);

    return (
        <div
            onClick={() => router.push(`/customer/restaurants/${restaurant._id}`)}
            className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {restaurant.restaurantImage ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.restaurantImage}`}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-700">
                        🍽️
                    </div>
                )}

                {/* Delivery Time / Status Badge */}
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-sm font-semibold shadow flex items-center gap-1">
                    🕒 {restaurant.openingHours || "25-35 min"}
                </div>

                {/* Open/Closed Badge */}
                <div className={`absolute bottom-4 left-4 px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${
                    restaurant.status === "open" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-red-500/90 text-white"
                }`}>
                    {restaurant.status?.toUpperCase() || "OPEN"}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-white line-clamp-1">
                        {restaurant.restaurantName}
                    </h3>

                    {/* Rating (you can add real rating later) */}
                    <div className="text-amber-500 flex items-center text-lg">
                        ★ <span className="ml-1 text-base text-zinc-600 dark:text-zinc-400">4.7</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 flex-1">
                    {restaurant.description}
                </p>

                {/* Food Types / Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {restaurant.foodTypes?.slice(0, 3).map((type: string, index: number) => (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full"
                        >
                            {type}
                        </span>
                    ))}
                </div>

                {/* Menu Count */}
                <div className="mt-5 text-xs text-zinc-400 dark:text-zinc-500">
                    {menuItems.length > 0
                        ? `${menuItems.length} delicious items on menu`
                        : "Menu loading..."}
                </div>
            </div>
        </div>
    );
}