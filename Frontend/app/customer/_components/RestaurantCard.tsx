"use client";

import Link from "next/link";
import { useState } from "react";
import { getRestaurantMenu } from "@/lib/actions/menu_actions";

interface Restaurant {
    _id: string;
    restaurantName: string;
    restaurantImage?: string;
    openingHours?: string;
    status: boolean;
    description?: string;
    foodTypes?: string[];
    rating?: number;
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    const handleMouseEnter = async () => {
        if (hasFetched) return;
        const result = await getRestaurantMenu(restaurant._id);
        if (result?.success && result?.data) {
            setMenuItems(result.data);
            setHasFetched(true);
        }
    };

    const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
    const imageUrl = restaurant.restaurantImage 
        ? `${process.env.NEXT_PUBLIC_API_URL}${restaurant.restaurantImage}`
        : fallbackImage;

    return (
        <Link
            href={`/customer/restaurants/${restaurant._id}`}
            onMouseEnter={handleMouseEnter}
            className="group flex flex-col bg-white border border-stone-200 rounded-[2.2rem] p-3 h-full transition-all duration-300 ease-out transform hover:-translate-y-1.5 shadow-[0_4px_20px_-4px_rgba(139,92,26,0.05)] hover:shadow-[0_20px_35px_-8px_rgba(139,92,26,0.12)] hover:border-orange-300/70 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
            <div className="relative h-44 w-full rounded-[1.6rem] overflow-hidden bg-stone-100 shrink-0 shadow-inner">
                <img
                    src={imageUrl}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />
                
                {/* Warm, Muted Organic Status Pill */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                        restaurant.status ? "bg-emerald-600" : "bg-stone-600"
                    }`}>
                        <span className={`h-1.5 w-1.5 rounded-full bg-white ${restaurant.status ? "animate-pulse" : ""}`} />
                        {restaurant.status ? "Open" : "Closed"}
                    </span>
                </div>
            </div>

            {/* Content Body utilizing warm typography pairings */}
            <div className="flex flex-col flex-1 px-2 pt-4 pb-2">
                {/* Title & Rating using deep earthy Stone-800 instead of black */}
                <div className="flex justify-between items-start gap-2 h-7">
                    <h3 className="font-bold text-lg tracking-tight text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {restaurant.restaurantName}
                    </h3>
                    
                    {/* Warm Sand-colored Star Badge */}
                    <div className="flex items-center gap-1 bg-amber-50/80 border border-amber-100 px-2 py-0.5 rounded-lg text-xs font-semibold text-amber-800 shrink-0 shadow-sm">
                        <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span>{restaurant.rating || "4.7"}</span>
                    </div>
                </div>

                {/* Subdued clay/stone tone for description */}
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 flex-1 leading-relaxed">
                    {restaurant.description || "Fresh local dishes prepared daily with handpicked seasonal ingredients."}
                </p>

                {/* Micro-tags with cream/orange tints */}
                {restaurant.foodTypes && restaurant.foodTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {restaurant.foodTypes.slice(0, 2).map((type, index) => (
                            <span 
                                key={index}
                                className="px-2.5 py-0.5 bg-orange-50 border border-orange-100/70 text-orange-700/90 text-[10px] font-medium rounded-md tracking-wide shadow-sm"
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                )}

                {/* Warm Accent Divider Lines & Footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                    <div className="flex items-center gap-1 text-stone-500">
                        <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0 Z" />
                        </svg>
                        <span>{restaurant.openingHours || "20-35 min"}</span>
                    </div>
                    
                    <div className="text-stone-500 group-hover:text-orange-600 font-semibold transition-colors">
                        {menuItems.length > 0 
                            ? `${menuItems.length} items available` 
                            : "View full menu"}
                    </div>
                </div>
            </div>
        </Link>
    );
}