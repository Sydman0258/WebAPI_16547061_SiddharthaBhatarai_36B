"use client";

import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
    ready:     "bg-purple-50 text-purple-600",
    picked_up: "bg-indigo-50 text-indigo-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-500",
};

export default function DeliveryList({ deliveries }: { deliveries: any[] }) {
    const router = useRouter();

    if (deliveries.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <span className="text-4xl block mb-3">🚗</span>
                <p className="text-sm font-medium">No deliveries yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-50">
            {deliveries.map((d: any) => (
                <div
                    key={d._id}
                    onClick={() => router.push(`/driver/deliveries/${d._id}`)}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                    <div>
                        <p className="font-semibold text-sm text-gray-900">
                            {d.restaurantId?.restaurantName ?? "Restaurant"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{d.deliveryAddress}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(d.placedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[d.status] ?? "bg-gray-100 text-gray-500"}`}>
                            {d.status}
                        </span>
                        <p className="text-sm font-black text-red-600 mt-1">Rs. {d.total}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}