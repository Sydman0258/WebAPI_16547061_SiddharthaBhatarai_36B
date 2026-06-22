"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";
import { useRouter } from "next/navigation";
import MenuItemForm from "./MenuItemForm";
import ToggleAvailability from "./ToggleAvailability";

export default function MenuTable({ items, restaurantId }: { items: any[]; restaurantId: string }) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        try {
            await axiosInstance.delete(API.MENU.DELETE(id));
            toast.success("Item deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => { setEditItem(null); setShowForm(true); }}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-sm"
                >
                    + Add Item
                </button>
            </div>

            {showForm && (
                <MenuItemForm
                    restaurantId={restaurantId}
                    item={editItem}
                    onClose={() => { setShowForm(false); setEditItem(null); }}
                    onSuccess={() => { setShowForm(false); router.refresh(); }}
                />
            )}

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <span className="text-4xl block mb-3">🍽️</span>
                        <p className="text-sm font-medium">No menu items yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {items.map((item: any) => (
                            <div key={item._id} className="flex items-center gap-4 px-6 py-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {item.imageUrl ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`} className="w-full h-full object-cover" alt={item.name} />
                                    ) : (
                                        <span className="text-xl">🍴</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.category} · Rs. {item.price}</p>
                                </div>
                                <ToggleAvailability id={item._id} isAvailable={item.isAvailable} />
                                <button
                                    onClick={() => { setEditItem(item); setShowForm(true); }}
                                    className="text-xs text-gray-400 hover:text-orange-500 font-medium transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-xs text-gray-400 hover:text-red-600 font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}