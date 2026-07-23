import { getUserData } from "@/lib/actions/auth_actions";
import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import { handleGetMyOrders } from "@/lib/actions/order_actions";

import Navbar from "./_components/Navbar";
import RestaurantCard from "./_components/RestaurantCard";
import Link from "next/link";

export default async function DashboardPage() {
    const [userResult, restaurantsResult, ordersResult] = await Promise.all([
        getUserData(),
        getAllRestaurants(),
        handleGetMyOrders(),
    ]);

    const user = userResult?.data;
    const restaurants = restaurantsResult?.data || [];
    const recentOrders = ordersResult?.data || [];

    const name = user?.fullname || user?.username || user?.email || "Guest";
    const address = user?.address || user?.savedAddress || "Set your delivery location";
    const firstName = name.split(" ")[0];

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" :
        hour < 18 ? "Good afternoon" : "Good evening";

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getImageUrl(path?: string) {
    if (!path) return undefined;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
}
    return (
        <div className="min-h-screen bg-amber-50/20 text-stone-800">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Content */}
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
                                    className="text-orange-600 font-medium text-xs hover:underline ml-1 bg-orange-50 px-2 py-0.5 rounded-md transition-colors"
                                >
                                    Change
                                </Link>
                            </p>
                        </div>

                        {/* Hero */}
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white">
                            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]" />
                            
                            <div className="relative px-8 py-8 sm:py-12 flex flex-col items-start">
                                <div className="max-w-md">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium tracking-wider mb-4">
                                        FRESH • FAST • LOCAL
                                    </div>
                                    
                                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter leading-none mb-4">
                                        Craving something<br />delicious?
                                    </h2>
                                    
                                    <p className="text-lg text-stone-300 mb-8">
                                        Explore top-rated restaurants and popular dishes delivered straight to your door in minutes.
                                    </p>
                                    
                                    <Link
                                        href="/customer/restaurants"
                                        className="inline-flex items-center px-8 py-3.5 bg-white text-black font-semibold rounded-2xl hover:bg-amber-50 active:scale-[0.985] transition-all"
                                    >
                                        Browse restaurants
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <section id="restaurants">
                            <div className="flex items-end justify-between mb-6">
                                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                                    All Restaurants
                                </h2>
                                {restaurants.length > 0 && (
                                    <Link href="/customer/restaurants" className="text-orange-600 text-sm font-medium hover:underline">
                                        View all
                                    </Link>
                                )}
                            </div>

                            {restaurants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {restaurants.map((restaurant: any) => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white border border-stone-200/60 rounded-[2rem] p-6">
                                    <h3 className="text-base font-semibold text-stone-800">No restaurants open nearby</h3>
                                    <p className="text-stone-400 text-xs mt-1">Please adjust your address or check back later.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 lg:sticky lg:top-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-lg text-stone-900">Recent Orders</h3>
                                <Link href="/customer/orders" className="text-orange-600 text-sm font-medium hover:underline">
                                    View all
                                </Link>
                            </div>

                           {recentOrders.length > 0 ? (
    <div className="space-y-4">
        {recentOrders.slice(0, 3).map((order: any) => {
            const restaurantName = order.restaurantId?.restaurantName ?? "Restaurant";
            const restaurantImage = getImageUrl(order.restaurantId?.restaurantImage);

            return (
                <div key={order._id} className="flex gap-3 bg-stone-50 rounded-2xl p-3 hover:bg-stone-100 transition-colors">
                    {restaurantImage ? (
                        <img
                            src={restaurantImage}
                            alt={restaurantName}
                            className="w-12 h-12 rounded-xl flex-shrink-0 object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-stone-200 rounded-xl flex-shrink-0 flex items-center justify-center text-stone-400 text-xs font-semibold">
                            {restaurantName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">
                            {restaurantName}
                        </p>
                        <p className="text-sm text-stone-500 truncate">
                            {order.items?.length || 0} items • ${order.total?.toFixed(2)}
                        </p>
                        <p className={`text-xs mt-1 font-medium ${
                            order.status === 'delivered' ? 'text-emerald-600' :
                            order.status === 'preparing' ? 'text-amber-600' : 'text-stone-500'
                        }`}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending"}
                        </p>
                    </div>
                </div>
            );
        })}
    </div>
) : (
    <div className="text-center py-12 bg-stone-50 rounded-2xl">
        <p className="text-stone-400 text-sm">No recent orders yet</p>
        <p className="text-stone-400 text-xs mt-1">Your past orders will appear here</p>
    </div>
)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}