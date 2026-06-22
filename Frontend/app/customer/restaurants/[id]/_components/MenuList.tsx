"use client";

import MenuItemCard from "./MenuItemCard";

export default function MenuList({ items, restaurantId }: { items: any[]; restaurantId: string }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <span className="text-4xl block mb-3">🍽️</span>
                <p className="text-gray-500 font-medium">No menu items available right now.</p>
            </div>
        );
    }

    const grouped = items.reduce((acc: Record<string, any[]>, item: any) => {
        const cat = item.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <MenuItemCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}