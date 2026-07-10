// _components/RecentActivityList.tsx
"use client";

import { Clock } from "lucide-react";

interface RecentActivityListProps {
    orders: any[];
}

export default function RecentActivityList({ orders }: RecentActivityListProps) {
    if (orders.length === 0) {
        return <div className="text-center py-12 text-xs text-gray-400">No recent activity logs found.</div>;
    }

    return (
        <div className="divide-y divide-gray-100">
            {orders.map((order) => {
                const isCompleted = order.status?.toLowerCase() === 'delivered';
                
                return (
                    <div key={order._id} className="py-3.5 flex items-center justify-between gap-4 group transition-colors">
                        <div className="flex items-center gap-3">
                            {/* Dummy Dish Avatar Ring */}
                            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                                {order.items?.[0]?.name?.slice(0, 2) || "OR"}
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-semibold text-gray-800">Status Changed</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                                    <span className="text-gray-700 font-medium">Rs. {order.total?.toFixed(2)}</span>
                                    <span>•</span>
                                    <span className="font-mono">#{order._id?.slice(-4).toUpperCase()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5"><Clock size={10} /> Wait 9min</span>
                                </div>
                            </div>
                        </div>

                        {/* Custom Status Pill */}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            isCompleted 
                                ? "bg-green-100 text-green-700" 
                                : "bg-amber-100 text-amber-700"
                        }`}>
                            {isCompleted ? "Completed" : "Pending"}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}