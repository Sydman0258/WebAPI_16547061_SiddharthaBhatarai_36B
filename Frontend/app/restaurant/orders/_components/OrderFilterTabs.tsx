const TABS = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];

export default function OrderFilterTabs({
    active,
    onChange,
}: {
    active: string;
    onChange: (tab: string) => void;
}) {
    return (
        <div className="flex gap-2 p-4 overflow-x-auto border-b border-gray-100">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                        active === tab
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}