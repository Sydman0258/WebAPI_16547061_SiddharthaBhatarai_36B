"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";

const DRIVER_TRANSITIONS: Record<string, string | null> = {
    picked_up: "delivered",
    delivered: null,
    cancelled: null,
};

const LABELS: Record<string, string> = {
    delivered: "Mark as Delivered",
};

export default function UpdateDeliveryStatus({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const nextStatus = DRIVER_TRANSITIONS[currentStatus];

    if (!nextStatus) return null;

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await axiosInstance.patch(API.ORDER.UPDATE_STATUS(orderId), { status: nextStatus });
            toast.success(`Marked as ${nextStatus}`);
            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl text-sm hover:bg-red-700 disabled:opacity-50 shadow-sm transition-all"
        >
            {loading ? "Updating..." : LABELS[nextStatus] ?? nextStatus}
        </button>
    );
}