"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/api/axiosinstance";
import { API } from "@/lib/api/endpoint";

const TRANSITIONS: Record<string, string[]> = {
    pending:   ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready"],
    ready:     [],
    picked_up: [],
    delivered: [],
    cancelled: [],
};

const STATUS_LABELS: Record<string, string> = {
    confirmed: "Confirm Order",
    preparing: "Start Preparing",
    ready:     "Mark as Ready",
    cancelled: "Cancel Order",
};

export default function UpdateStatusButton({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const nextStatuses = TRANSITIONS[currentStatus] ?? [];

    if (nextStatuses.length === 0) return null;

    const handleUpdate = async (status: string) => {
        setLoading(true);
        try {
            await axiosInstance.patch(API.ORDER.UPDATE_STATUS(orderId), { status });
            toast.success(`Order marked as ${status}`);
            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3 flex-wrap">
            {nextStatuses.map((status) => (
                <button
                    key={status}
                    onClick={() => handleUpdate(status)}
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 ${
                        status === "cancelled"
                            ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                >
                    {loading ? "Updating..." : STATUS_LABELS[status] ?? status}
                </button>
            ))}
        </div>
    );
}