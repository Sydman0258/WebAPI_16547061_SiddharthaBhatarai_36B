"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Utensils } from "lucide-react"; // Sleek iconography

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
        <div className="space-y-6 max-w-[1600px] mx-auto p-1">
            {/* Action Bar Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
                    <p className="text-xs text-gray-400">{items.length} items configured</p>
                </div>
                <button
                    onClick={() => {
                        setEditItem(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={16} />
                    Add New Item
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

            {/* Content Section */}
            {items.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-20 text-center text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-2xl shadow-inner">
                        🍳
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No items on the menu yet</p>
                    <p className="text-xs text-gray-400 mt-1">Click the button above to begin showcasing your dishes.</p>
                </div>
            ) : (
                /* Premium Dynamic Visual Grid Layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {items.map((item: any) => (
                        <div
                            key={item._id}
                            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group justify-between"
                        >
                            {/* Card Media Top Section */}
                            <div className="relative aspect-[4/3] bg-gray-50 border-b border-gray-50 overflow-hidden shrink-0">
                                {item.imageUrl ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-1.5">
                                        <Utensils size={28} className="stroke-[1.5]" />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">No Image</span>
                                    </div>
                                )}
                                
                                {/* Absolute Category Floating Badge */}
                                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold text-gray-800 rounded-lg shadow-sm border border-white/40 uppercase tracking-wider">
                                    {item.category || "General"}
                                </span>
                            </div>

                            {/* Info Body */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm font-black text-gray-900">
                                        Rs. {item.price}
                                    </p>
                                </div>

                                {/* Active Controls Divider */}
                                <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3">
                                    {/* Availability Sub-toggle block */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status:</span>
                                        <ToggleAvailability
                                            id={item._id}
                                            isAvailable={item.isAvailable}
                                        />
                                    </div>

                                    {/* Action Icon Grouping */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                setEditItem(item);
                                                setShowForm(true);
                                            }}
                                            className="p-1.5 bg-gray-50 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-gray-100"
                                            title="Edit Item"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(item._id)}
                                            className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-100"
                                            title="Delete Item"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
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