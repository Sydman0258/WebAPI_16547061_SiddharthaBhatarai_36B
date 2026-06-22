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

export default function OrderCard({ order }: { order: any }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/customer/orders/${order._id}`)}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-orange-200 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-bold text-gray-900">{order.restaurantId?.restaurantName ?? "Restaurant"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.placedAt).toLocaleDateString()} · {order.items?.length} item(s)
                    </p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                        {order.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {order.status}
                    </span>
                    <p className="text-base font-black text-red-600 mt-2">Rs. {order.total}</p>
                </div>
            </div>
        </div>
    );
}