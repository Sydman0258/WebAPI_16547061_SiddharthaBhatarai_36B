export default function RatingSummary({ driver }: { driver: any }) {
    if (!driver) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                    <p className="text-3xl font-black text-orange-500">⭐ {driver.ratings?.toFixed(1) ?? "—"}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Rating</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-gray-900">{driver.totalDeliveries}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Total Deliveries</p>
                </div>
                <div className="text-center">
                    <p className={`text-3xl font-black ${driver.isAvailable ? "text-green-500" : "text-red-400"}`}>
                        {driver.isAvailable ? "Online" : "Offline"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Status</p>
                </div>
            </div>
        </div>
    );
}