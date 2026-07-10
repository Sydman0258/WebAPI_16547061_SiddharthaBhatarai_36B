// _components/RevenueChart.tsx
"use client";

interface RevenueChartProps {
    orders: any[];
}

export default function RevenueChart({ orders }: RevenueChartProps) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Group dynamic revenue by day of the week
    const dailyRevenue = new Array(7).fill(0);
    orders.forEach((order) => {
        if (order.status?.toLowerCase() === 'delivered' && order.createdAt) {
            const dayIndex = new Date(order.createdAt).getDay();
            dailyRevenue[dayIndex] += (order.total ?? 0);
        }
    });

    const maxRevenue = Math.max(...dailyRevenue, 1000); // Prevent divide by zero

    return (
        <div className="w-full h-full flex flex-col justify-between pt-4">
            {/* Chart Bars */}
            <div className="flex-1 flex items-end justify-between gap-3 px-2 border-b border-gray-100 pb-2">
                {days.map((day, index) => {
                    const value = dailyRevenue[index];
                    const percentage = (value / maxRevenue) * 100;
                    const isThursday = day === "Thu"; // Matching the screenshot's active look

                    return (
                        <div key={day} className="flex-1 flex flex-col items-center gap-2 group relative">
                            {/* Tooltip on Hover */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none z-10 flex flex-col items-center">
                                <span className="font-semibold">Rs. {value.toFixed(0)}</span>
                            </div>

                            {/* Column Bar */}
                            <div className="w-full bg-gray-50 rounded-t-lg h-48 flex items-end overflow-hidden">
                                <div 
                                    className={`w-full rounded-t-md transition-all duration-500 origin-bottom ${
                                        isThursday 
                                            ? "bg-gradient-to-t from-orange-600 to-orange-400 shadow-sm" 
                                            : "bg-gray-200/70 group-hover:bg-gray-300"
                                    }`}
                                    style={{ height: `${Math.max(percentage, 8)}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[11px] font-medium text-gray-400 pt-2 px-2">
                {days.map((day) => (
                    <span key={day} className={day === "Thu" ? "text-orange-600 font-bold" : ""}>
                        {day}
                    </span>
                ))}
            </div>
        </div>
    );
}