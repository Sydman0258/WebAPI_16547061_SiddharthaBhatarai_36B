"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function AddToCartButton({ item }: { item: any }) {
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        // wire to your cart context/store when ready
        setAdded(true);
        toast.success(`${item.name} added to cart`);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                added
                    ? "bg-green-500 text-white"
                    : "bg-red-600 text-white hover:bg-red-700"
            }`}
        >
            {added ? "Added ✓" : "+ Add"}
        </button>
    );
}