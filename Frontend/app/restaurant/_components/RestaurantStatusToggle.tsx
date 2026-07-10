"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";

interface Props {
    restaurantId: string;
    initialStatus: boolean;
}

export default function RestaurantStatusToggle({ restaurantId, initialStatus }: Props) {
    const [isOpen, setIsOpen] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const updateStatus = async (nextStatus: boolean) => {
        // Prevent duplicate requests or clicking the already active state
        if (loading || nextStatus === isOpen) return;

        const previous = isOpen;
        setIsOpen(nextStatus); // Optimistic UI update
        setLoading(true);

        try {
            // Sending as JSON preserves the strict boolean type (true/false)
            const res = await axiosInstance.put(
                API.RESTAURANT.UPDATE(restaurantId),
                { status: nextStatus } 
            );

            if (!res.data?.success) {
                throw new Error(res.data?.message || "Status update failed");
            }

            toast.success(nextStatus ? "Restaurant is now open" : "Restaurant is now closed");
        } catch (err: any) {
            setIsOpen(previous); // Rollback to original state if API fails
            toast.error(err?.response?.data?.message || err?.message || "Status update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Restaurant Status</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {isOpen ? "Accepting new orders" : "Not accepting orders"}
                    </p>
                </div>
                <span
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                        isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                />
            </div>

            <div className="flex rounded-xl overflow-hidden border border-gray-200">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => updateStatus(true)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-all disabled:opacity-50 ${
                        isOpen
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    Open
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => updateStatus(false)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-all disabled:opacity-50 ${
                        !isOpen
                            ? "bg-red-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    Closed
                </button>
            </div>
        </div>
    );
}