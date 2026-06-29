import { getMyRestaurant, handleGetRestaurantOrders } from "@/lib/actions/restaurant_actions";
import StatCard from "./_components/StatCard";
import RecentOrders from "./_components/RecentOrders";

export default async function RestaurantDashboard() {
    const restaurantRes = await getMyRestaurant();
    const restaurant = restaurantRes.data;

    const ordersRes = restaurant 
        ? await handleGetRestaurantOrders(restaurant._id) 
        : { data: [] };
    const orders = ordersRes.data ?? [];

    const stats = {
        total:     orders.length,
        pending:   orders.filter((o: any) => o.status?.toLowerCase() === 'pending').length,
        preparing: orders.filter((o: any) => o.status?.toLowerCase() === 'preparing').length,
        delivered: orders.filter((o: any) => o.status?.toLowerCase() === 'delivered').length,
        revenue:   orders
            .filter((o: any) => o.status?.toLowerCase() === 'delivered')
            .reduce((sum: number, o: any) => sum + (o.total ?? 0), 0),
    };

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-100 pb-5">
                <h1 className="text-3xl font-extrabold text-gray-900">
                    {restaurant?.restaurantName ?? "Dashboard"} 🍽️
                </h1>
                <p className="mt-1 text-sm text-gray-500">Here's what's happening today</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Orders"  value={stats.total}     icon="📦" />
                <StatCard label="Pending"       value={stats.pending}   icon="⏳" color="text-yellow-600" />
                <StatCard label="Preparing"     value={stats.preparing} icon="👨‍🍳" color="text-orange-600" />
                <StatCard label="Revenue"       value={`Rs. ${stats.revenue.toFixed(2)}`} icon="💰" color="text-green-600" />
            </div>

            <RecentOrders orders={orders.slice(0, 5)} />
        </div>
    );
}