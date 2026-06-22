"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";

export default function ToggleAvailability({ id, isAvailable }: { id: string; isAvailable: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            await axiosInstance.patch(API.MENU.TOGGLE(id));
            toast.success(`Item marked as ${isAvailable ? "unavailable" : "available"}`);
            router.refresh();
        } catch {
            toast.error("Failed to toggle availability");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all disabled:opacity-50 ${
                isAvailable ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
        >
            {isAvailable ? "Available" : "Unavailable"}
        </button>
    );
}