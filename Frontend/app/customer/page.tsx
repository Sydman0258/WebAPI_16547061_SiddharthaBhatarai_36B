import { getUserData } from "@/lib/actions/auth_actions";
import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import Navbar from "./_components/Navbar";
import RestaurantCard from "./_components/RestaurantCard";
import RecentOrderTimeline from "./_components/RecentOrderTimeline";
import Link from "next/link";
import { handleGetMyOrders } from "@/lib/actions/order_actions";

export default async function DashboardPage() {
    const userResult = await getUserData();
    const restaurantsResult = await getAllRestaurants();
    const ordersResult = await handleGetMyOrders();

    const user = userResult?.data;
    const restaurants = restaurantsResult?.data || [];

    const name = user?.fullname || user?.username || user?.email || "Guest";
    const address = user?.address || user?.savedAddress || "Set your delivery location";
    const firstName = name.split(" ")[0];

    const activeOrder = user?.activeOrder || null;
    const recentOrders = ordersResult?.data || [];

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="min-h-screen bg-amber-50/20 text-stone-800">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Feed Content Column (75% / 9 Cols) */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="pb-2">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                                {greeting}, {firstName}
                            </h1>
                            <p className="mt-2 text-stone-500 text-sm sm:text-base flex items-center flex-wrap gap-1.5">
                                <span>Delivering to</span>
                                <span className="font-semibold text-stone-700 truncate max-w-[200px] sm:max-w-md">
                                    {address}
                                </span>
                                <Link
                                    href="/customer/profile"
                                    className="text-orange-600 font-medium text-xs hover:underline ml-1 bg-orange-50 px-2 py-0.5 rounded-md"
                                >
                                    Change
                                </Link>
                            </p>
                        </div>

                        <section>
                            <h2 className="text-xl font-bold text-stone-900 mb-6 tracking-tight">
                                All Restaurants
                            </h2>

                            {restaurants && restaurants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {restaurants.map((restaurant: any) => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white border border-stone-200/60 rounded-[2rem] p-6">
                                    <span className="text-5xl mb-3 block">🍽️</span>
                                    <h3 className="text-base font-semibold text-stone-800">No restaurants open nearby</h3>
                                    <p className="text-stone-400 text-xs mt-1">Please adjust your address or check back later.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Utilities Column (25% / 3 Cols) */}
                    <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-6">

                        {/* Dynamic Order Tracker Container */}
{activeOrder ? (
    <div className="bg-white border border-stone-200/60 rounded-[2rem] p-5 shadow-sm shadow-stone-900/[0.02]">
        <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Live Tracker
            </span>
            <span className="text-xs font-semibold text-emerald-600 animate-pulse flex items-center gap-1">
                ● {activeOrder.statusLabel || "Active"}
            </span>
        </div>

        <h3 className="font-bold text-stone-900 text-base">{activeOrder.restaurantName}</h3>
        <p className="text-xs text-stone-500 mt-0.5">Order #{activeOrder.orderNumber} • {activeOrder.itemCount} items</p>

        <div className="my-4 flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <span className="text-2xl">{activeOrder.statusIcon || "🛵"}</span>
            <div>
                <p className="text-xs font-bold text-stone-800">{activeOrder.statusDescription}</p>
                <p className="text-[11px] text-stone-400">{activeOrder.subStatusText}</p>
            </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-1">
            <span className="text-stone-500">Estimated Arrival:</span>
            <span className="text-stone-900 text-sm font-bold">{activeOrder.eta}</span>
        </div>
    </div>
) : (
    recentOrders?.[0]?._id && (
<div className="-ml-3 -mr-2 overflow-hidden">
            <RecentOrderTimeline orderId={recentOrders[0]._id} />
        </div>
    )
)}
                        
                    </aside>

                </div>
            </main>
        </div>
    );
}