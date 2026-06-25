"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import DeleteModal from "@/app/_component/DeleteModel";
import MenuItemForm from "./MenuItemForm";
import ToggleAvailability from "./ToggleAvailability";
import { deleteMenu } from "@/lib/actions/menu_actions";

export default function MenuTable({
    items,
    restaurantId,
}: {
    items: any[];
    restaurantId: string;
}) {
    const router = useRouter();

    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const onDelete = async () => {
        try {
            if (!deleteId) return;

            await deleteMenu(deleteId);

            toast.success("Menu item deleted successfully");

            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete menu item");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Add Item Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setEditItem(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-sm"
                >
                    + Add Item
                </button>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <MenuItemForm
                    restaurantId={restaurantId}
                    item={editItem}
                    onClose={() => {
                        setShowForm(false);
                        setEditItem(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditItem(null);
                        router.refresh();
                    }}
                />
            )}

            {/* Menu Items */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {items.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <span className="text-4xl block mb-3">🍽️</span>
                        <p className="text-sm font-medium">
                            No menu items yet
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {items.map((item: any) => (
                            <div
                                key={item._id}
                                className="flex items-center gap-4 px-6 py-4"
                            >
                                {/* Image */}
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                    {item.imageUrl ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl">🍴</span>
                                    )}
                                </div>

                                {/* Name + Category + Price */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.category} · Rs. {item.price}
                                    </p>
                                </div>

                                {/* Availability Toggle */}
                                <ToggleAvailability
                                    id={item._id}
                                    isAvailable={item.isAvailable}
                                />

                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        setEditItem(item);
                                        setShowForm(true);
                                    }}
                                    className="text-xs text-gray-400 hover:text-orange-500 font-medium transition-colors"
                                >
                                    Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => setDeleteId(item._id)}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={onDelete}
                title="Delete Confirmation"
                description="Are you sure you want to delete this item? This action cannot be undone."
            />
        </div>
    );
}