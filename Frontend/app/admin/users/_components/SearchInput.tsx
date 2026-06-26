// app/admin/users/_components/SearchInput.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

export function SearchInput({ initialValue }: { initialValue: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(initialValue);

    // Sync input box if URL params mutate externally
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSearch = (text: string) => {
        setValue(text);
        startTransition(() => {
            const params = new URLSearchParams();
            if (text) params.set("search", text);
            params.set("page", "1"); // Force return to page 1 on active text filters
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <div className="relative w-full max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
                type="text"
                value={value}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-500 font-medium"
            />
            {isPending && (
                <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" />
            )}
        </div>
    );
}