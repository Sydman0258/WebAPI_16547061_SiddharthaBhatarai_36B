"use client";

import AddToCartButton from "./AddToCartButton";

export default function MenuItemCard({ item }: { item: any }) {
    return (
        <div className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-orange-100 transition-all">
            <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                {item.imageUrl ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-3xl">🍴</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">⏱ {item.preparationTime} mins</p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-black text-red-600">Rs. {item.price}</span>
                    <AddToCartButton item={item} />
                </div>
            </div>
        </div>
    );
}