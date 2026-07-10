import { getMyRestaurant, handleGetRestaurantOrders } from "@/lib/actions/restaurant_actions";
import RestaurantStatusToggle from "./_components/RestaurantStatusToggle";
import { Package, Clock, ChefHat, DollarSign, ArrowUpRight, Users, ShoppingBag } from "lucide-react";

import RevenueChart from "./_components/RevenueChart";
import RecentActivityList from "./_components//RecentActivityList";
import TopDishesList from "./_components/TopDishesList";

export default async function RestaurantDashboard() {
    const restaurantRes = await getMyRestaurant();
    const restaurant = restaurantRes.data;

    const ordersRes = restaurant
        ? await handleGetRestaurantOrders(restaurant._id)
        : { data: [] };
    const orders = ordersRes.data ?? [];

    // Core computations from your orders data
    const totalOrders = orders.length;
    const pendingCount = orders.filter((o: any) => o.status?.toLowerCase() === 'pending').length;
    const preparingCount = orders.filter((o: any) => o.status?.toLowerCase() === 'preparing').length;
    const deliveredOrders = orders.filter((o: any) => o.status?.toLowerCase() === 'delivered');
    
    const revenue = deliveredOrders.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0);
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    return (
        <div className="space-y-6 p-6 max-w-[1600px] mx-auto bg-gray-50/50 min-h-screen">
            
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {restaurant?.restaurantName ?? "Dashboard"}
                    </h1>
                    <p className="mt-1.5 text-sm text-gray-500">Welcome back!</p>
                </div>

                {restaurant && (
                    <div className="w-full sm:w-72">
                        <RestaurantStatusToggle
                            restaurantId={restaurant._id}
                            initialStatus={restaurant.status ?? true}
                        />
                    </div>
                )}
            </div>

            {/* 2. TOP METRIC ROW (Operational Pulse) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Pending Orders Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <Clock size={16} className="text-amber-500" />
                                <span>Pending Orders</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">{pendingCount}</p>
                        </div>
                        <span className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 transition-colors">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>

                {/* Orders in Progress Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <ChefHat size={16} className="text-orange-500" />
                                <span>Orders in Progress</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">{preparingCount}</p>
                        </div>
                        <span className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 transition-colors">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>

                {/* Total Capacity / Available Tables Alternative */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                <Package size={16} className="text-blue-500" />
                                <span>Active Pipeline</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">
                                {pendingCount + preparingCount}<span className="text-lg text-gray-400 font-normal"> Total</span>
                            </p>
                        </div>
                        <span className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-gray-900 transition-colors">
                            <ArrowUpRight size={18} />
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. MIDDLE ROW (Financial Analytics & Macro Business Data) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 2/3 - Revenue Analytics Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Total Revenue</h3>
                            <p className="text-xs text-gray-400">Sales Overview</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 outline-none">
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                    </div>
                    {/* Reusable chart placeholder passing your live orders data */}
                    <div className="h-64">
                        <RevenueChart orders={orders} />
                    </div>
                </div>

                {/* Right 1/3 - Business Stack Metrics */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">Business Data</h4>
                            <p className="text-[11px] text-gray-400">Snapshot performance</p>
                        </div>

                        <div className="space-y-3 mt-4">
                            {/* Customers / Unique Users Stack Card */}
                            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Users size={16} /></div>
                                    <div>
                                        <p className="text-xs text-indigo-900/60 font-medium">Estimated Customers</p>
                                        <p className="text-lg font-bold text-indigo-950">{Array.from(new Set(orders.map((o: any) => o.userId))).length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Orders Stack Card */}
                            <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><ShoppingBag size={16} /></div>
                                    <div>
                                        <p className="text-xs text-amber-900/60 font-medium">Total Orders</p>
                                        <p className="text-lg font-bold text-amber-950">{totalOrders}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Average Order Value Stack Card */}
                            <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><DollarSign size={16} /></div>
                                    <div>
                                        <p className="text-xs text-emerald-900/60 font-medium">Avg Order Value</p>
                                        <p className="text-lg font-bold text-emerald-950">Rs. {avgOrderValue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM ROW (Granular Logs Split 50/50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Live Activity Stream */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-md">Recent Activity</h3>
                        <span className="p-1 bg-gray-50 rounded-lg text-gray-400 cursor-pointer"><ArrowUpRight size={16} /></span>
                    </div>
                    <RecentActivityList orders={orders.slice(0, 4)} />
                </div>

                {/* Popular Insights Leaderboard */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 text-md">Top Dishes</h3>
                        <select className="text-[11px] font-medium bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-gray-500 outline-none">
                            <option>This Week</option>
                        </select>
                    </div>
                    <TopDishesList orders={orders} />
                </div>
            </div>

        </div>
    );
}