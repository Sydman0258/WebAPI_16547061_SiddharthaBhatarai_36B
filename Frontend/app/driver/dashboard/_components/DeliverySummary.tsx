export default function DeliverySummary({ deliveries }: { deliveries: any[] }) {
    const delivered = deliveries.filter((d) => d.status === "delivered").length;
    const active = deliveries.filter((d) => d.status === "picked_up").length;
    const cancelled = deliveries.filter((d) => d.status === "cancelled").length;

    const stats = [
        { label: "Total Deliveries", value: deliveries.length, icon: "📦", color: "text-gray-900" },
        { label: "Completed", value: delivered, icon: "✅", color: "text-green-600" },
        { label: "Active", value: active, icon: "🚗", color: "text-orange-600" },
        { label: "Cancelled", value: cancelled, icon: "❌", color: "text-red-500" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon, color }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <span className="text-2xl block mb-2">{icon}</span>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">{label}</p>
                </div>
            ))}
        </div>
    );
}