"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/lib/context/CartContext"; 

// 1. Accept restaurantId along with the item object
export default function AddToCartButton({ item, restaurantId }: { item: any; restaurantId: string }) {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAdd = () => {
        // 2. Spread the item details and append the real restaurantId
        addToCart({
            ...item,
            restaurantId: restaurantId
        }); 
        
        setAdded(true);
        toast.success(`${item.name} added to cart!`);
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