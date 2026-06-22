export default function DeliveryMap({ address }: { address: string }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Delivery Location</h2>
            <div className="bg-gray-50 rounded-xl h-40 flex items-center justify-center border border-gray-100">
                <div className="text-center text-gray-400">
                    <span className="text-3xl block mb-2">📍</span>
                    <p className="text-sm font-medium text-gray-600">{address}</p>
                    <p className="text-xs text-gray-400 mt-1">Map integration coming soon</p>
                </div>
            </div>
        </div>
    );
}