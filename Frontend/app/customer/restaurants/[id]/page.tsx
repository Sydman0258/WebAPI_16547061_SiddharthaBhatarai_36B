import { notFound } from "next/navigation";
import { getRestaurantById } from "@/lib/actions/restaurant_actions";
import { getAvailableMenu } from "@/lib/actions/menu_actions";
import RestaurantHeader from "./_components/RestaurantHeader";
import MenuList from "./_components/MenuList";
import Navbar from "../../_components/Navbar";

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [restaurantRes, menuRes] = await Promise.all([
        getRestaurantById(id),
        getAvailableMenu(id),
    ]);

    const restaurant = restaurantRes?.data;
    const menu = menuRes?.data ?? [];

    if (!restaurant) notFound();

    const topSellers = menu.filter((item: any) => item.isTopSeller || item.isPopular).slice(0, 3);
    const displayedTopSellers = topSellers.length > 0 ? topSellers : menu.slice(0, 3);

    return (
        <div className="min-h-screen bg-amber-50/20 text-stone-800">
            {/* Navbar left alone */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
                
                {/* Embedded Restaurant Info Header Card */}
                <div className="bg-white border border-stone-200 rounded-[2.2rem] p-4 sm:p-6 shadow-[0_4px_20px_-4px_rgba(139,92,26,0.04)]">
                    <RestaurantHeader restaurant={restaurant} />
                </div>

                {/* 2-Column Balanced Grid Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT MAIN AREA: Full Menu Compilation (75% / 9 Cols) */}
                    <div className="lg:col-span-9 bg-white border border-stone-200 rounded-[2.2rem] p-6 shadow-[0_4px_20px_-4px_rgba(139,92,26,0.04)]">
                        <h2 className="text-xl font-bold text-stone-900 mb-6 tracking-tight">
                            Full Menu
                        </h2>
                        <MenuList items={menu} restaurantId={id} />
                    </div>

                    {/* RIGHT SIDEBAR: Top Sellers Spotlight (25% / 3 Cols) */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-6 space-y-6">
                        
                        <div className="bg-white border border-stone-200 rounded-[2.2rem] p-5 shadow-[0_4px_20px_-4px_rgba(139,92,26,0.04)]">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">🔥</span>
                                <h3 className="font-bold text-stone-900 text-sm tracking-tight">
                                    Top Sellers
                                </h3>
                            </div>
                            
                            {displayedTopSellers && displayedTopSellers.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedTopSellers.map((item: any) => (
                                        <div 
                                            key={item._id} 
                                            className="group/item flex items-center justify-between gap-3 pb-3.5 border-b border-stone-100 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-center gap-3 truncate">
                                                {item.image ? (
                                                    <img 
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`} 
                                                        alt={item.name} 
                                                        className="w-12 h-12 rounded-xl object-cover bg-stone-50 shrink-0 border border-stone-100"
                                                    />
                                                ) : (
                                                    <span className="text-2xl w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/50">
                                                        🍔
                                                    </span>
                                                )}
                                                <div className="truncate">
                                                    <p className="text-xs font-bold text-stone-800 truncate group-hover/item:text-orange-600 transition-colors">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-[11px] font-semibold text-orange-600 mt-0.5">
                                                        Rs. {item.price}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Micro Direct Add Action */}
                                            <button className="text-lg font-bold text-stone-400 hover:text-orange-600 w-7 h-7 bg-stone-50 hover:bg-orange-50 rounded-xl flex items-center justify-center transition-all shrink-0 border border-stone-100">
                                                +
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-stone-400 text-xs">
                                    No items highlighted yet.
                                </div>
                            )}
                        </div>

                    </aside>

                </div>
            </main>
        </div>
    );
}