"use client";

import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
    pending:   "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    preparing: "bg-orange-50 text-orange-600",
    ready:     "bg-purple-50 text-purple-600",
    picked_up: "bg-indigo-50 text-indigo-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-500",
};

export default function RecentOrders({ orders }: { orders: any[] }) {
    const router = useRouter();

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>
            ) : (
                <div className="divide-y divide-gray-50">
                    {orders.map((order: any) => (
                        <div
                            key={order._id}
                            onClick={() => router.push(`/restaurant/orders/${order._id}`)}
                            className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 -mx-2 px-2 rounded-xl transition-colors"
                        >
                            <div>
                                <p className="font-semibold text-sm text-gray-900">
                                    {order.customerId?.fullname ?? "Customer"}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {order.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                                    {order.status}
                                </span>
                                <p className="text-sm font-black text-red-600 mt-1">Rs. {order.total}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}