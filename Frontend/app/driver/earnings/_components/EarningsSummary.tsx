const DRIVER_CUT = 0.1; // 10% of order total

export default function EarningsSummary({ deliveries }: { deliveries: any[] }) {
    const total = deliveries.reduce((sum: number, d: any) => sum + d.total * DRIVER_CUT, 0);
    const thisMonth = deliveries
        .filter((d: any) => new Date(d.placedAt).getMonth() === new Date().getMonth())
        .reduce((sum: number, d: any) => sum + d.total * DRIVER_CUT, 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
                { label: "Total Earned", value: `Rs. ${total.toFixed(2)}`, icon: "💰", color: "text-green-600" },
                { label: "This Month", value: `Rs. ${thisMonth.toFixed(2)}`, icon: "📅", color: "text-orange-600" },
                { label: "Deliveries Done", value: deliveries.length, icon: "✅", color: "text-gray-900" },
            ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <span className="text-2xl block mb-2">{icon}</span>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">{label}</p>
                </div>
            ))}
        </div>
    );
}