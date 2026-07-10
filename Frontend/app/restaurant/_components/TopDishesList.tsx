// _components/TopDishesList.tsx
"use client";

interface TopDishesListProps {
    orders: any[];
}

export default function TopDishesList({ orders }: TopDishesListProps) {
    const dishCounts: Record<string, number> = {};
    orders.forEach((order) => {
        order.items?.forEach((item: any) => {
            if (item.name) {
                dishCounts[item.name] = (dishCounts[item.name] || 0) + (item.quantity || 1);
            }
        });
    });

    const topDishes = Object.entries(dishCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    if (topDishes.length === 0) {
        return <div className="text-center py-12 text-xs text-gray-400">No dish performance logs available yet.</div>;
    }

    return (
        <div className="space-y-3.5">
            {topDishes.map((dish, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Static placeholder thumbnail matching the screenshot layout */}
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-100/50">
                            🍳
                        </div>
                        <span className="text-xs font-semibold text-gray-700 max-w-[180px] truncate">
                            {dish.name}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-900">{dish.count}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Orders</span>
                    </div>
                </div>
            ))}
        </div>
    );
}