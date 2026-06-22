import { getUserData } from "@/lib/actions/auth_actions";
import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import OrderCard from "./_components/OrderCard";

async function getMyOrders(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
}

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const orders = await getMyOrders(token);

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Orders 📦</h1>
                    <p className="mt-2 text-sm text-gray-500">Track your current and past orders</p>
                </div>
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">📦</span>
                        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
                        <p className="text-sm text-gray-400 mt-2">Your order history will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}