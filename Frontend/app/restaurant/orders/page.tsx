import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import OrderTable from "./_components/OrderTable";

async function getOrders(restaurantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_RESTAURANT(restaurantId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
}

async function getMyRestaurant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? null;
}

export default async function RestaurantOrdersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const restaurant = await getMyRestaurant(token);
    const orders = restaurant ? await getOrders(restaurant._id, token) : [];

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-400 mt-1">{orders.length} total orders</p>
            </div>
            <OrderTable orders={orders} />
        </div>
    );
}