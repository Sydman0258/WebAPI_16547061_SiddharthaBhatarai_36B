"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";

export default function SettingsForm({ restaurant }: { restaurant: any }) {
    const router = useRouter();

    const [status, setStatus] = useState(restaurant?.status || "open");
    const [openingHours, setOpeningHours] = useState(restaurant?.openingHours || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!restaurant?._id) {
            toast.error("Restaurant details are missing");
            return;
        }

        setLoading(true);

        try {
            const res = await axiosInstance.put(
                API.RESTAURANT.UPDATE(restaurant._id),
                {
                    status,
                    openingHours,
                }
            );

            if (!res.data?.success) {
                throw new Error(res.data?.message || "Update failed");
            }

            toast.success("Settings updated successfully");
            
            // Forces Next.js to pull the updated data from the server layout
            router.refresh(); 
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || err?.message || "Failed to update settings"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
            {/* STATUS DROP-DOWN */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Restaurant Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 text-black bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="busy">Busy</option>
                </select>
            </div>

            {/* OPENING HOURS */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Opening Hours
                </label>
                <input
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 9:00 AM - 10:00 PM"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
            </div>

            {/* ACTION BUTTON */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    );
}