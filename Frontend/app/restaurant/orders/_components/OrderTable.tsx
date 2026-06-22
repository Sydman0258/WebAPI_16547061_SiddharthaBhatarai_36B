"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrderFilterTabs from "./OrderFilterTabs";

const STATUS_COLORS: Record<string, string> = {
    pending:   "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    preparing: "bg-orange-50 text-orange-600",
    ready:     "bg-purple-50 text-purple-600",
    picked_up: "bg-indigo-50 text-indigo-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-500",
};

export default function OrderTable({ orders }: { orders: any[] }) {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered = activeFilter === "all"
        ? orders
        : orders.filter((o) => o.status === activeFilter);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <OrderFilterTabs active={activeFilter} onChange={setActiveFilter} />
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <span className="text-4xl block mb-3">📦</span>
                    <p className="text-sm font-medium">No orders found</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {filtered.map((order: any) => (
                        <div
                            key={order._id}
                            onClick={() => router.push(`/restaurant/orders/${order._id}`)}
                            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900">
                                    {order.customerId?.fullname ?? "Customer"}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">
                                    {order.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {new Date(order.placedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right ml-4">
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