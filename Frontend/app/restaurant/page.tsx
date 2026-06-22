import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import StatCard from "./_components/StatCard";
import RecentOrders from "./_components/RecentOrders";

async function getMyRestaurant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? null;
}

async function getRestaurantOrders(restaurantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_RESTAURANT(restaurantId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
}

export default async function RestaurantDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const restaurant = await getMyRestaurant(token);
    const orders = restaurant ? await getRestaurantOrders(restaurant._id, token) : [];

    const stats = {
        total: orders.length,
        pending: orders.filter((o: any) => o.status === "pending").length,
        preparing: orders.filter((o: any) => o.status === "preparing").length,
        delivered: orders.filter((o: any) => o.status === "delivered").length,
        revenue: orders
            .filter((o: any) => o.status === "delivered")
            .reduce((sum: number, o: any) => sum + o.total, 0),
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
                <StatCard label="Total Orders" value={stats.total} icon="📦" />
                <StatCard label="Pending" value={stats.pending} icon="⏳" color="text-yellow-600" />
                <StatCard label="Preparing" value={stats.preparing} icon="👨‍🍳" color="text-orange-600" />
                <StatCard label="Revenue" value={`Rs. ${stats.revenue.toFixed(2)}`} icon="💰" color="text-green-600" />
            </div>

            <RecentOrders orders={orders.slice(0, 5)} />
        </div>
    );
}