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
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-orange-200 hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
            <div className="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
                {restaurant.restaurantImage ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${restaurant.restaurantImage}`}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">🍽️</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base">{restaurant.restaurantName}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{restaurant.description}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {restaurant.foodTypes?.map((type: string) => (
                        <span key={type} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                            {type}
                        </span>
                    ))}
                </div>

                {/* Menu item count from menu_actions */}
                <div className="mt-2 text-xs text-gray-400">
                    {menuItems.length > 0
                        ? `${menuItems.length} item${menuItems.length > 1 ? "s" : ""} on menu`
                        : "No menu items yet"}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span>🕒 {restaurant.openingHours}</span>
                    <span className={`font-semibold ${restaurant.status === "open" ? "text-green-500" : "text-red-400"}`}>
                        {restaurant.status}
                    </span>
                </div>
            </div>
        </div>
    );
}