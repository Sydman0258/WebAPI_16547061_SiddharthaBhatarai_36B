const STEPS = ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered"];

export default function OrderTimeline({ status }: { status: string }) {
    const currentIndex = STEPS.indexOf(status);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Order Status</h2>
            <div className="flex items-center gap-0">
                {STEPS.map((step, idx) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                idx <= currentIndex
                                    ? "bg-red-600 border-red-600 text-white"
                                    : "bg-white border-gray-200 text-gray-300"
                            }`}>
                                {idx < currentIndex ? "✓" : idx + 1}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 text-center capitalize w-14 leading-tight">
                                {step.replace("_", " ")}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mb-4 transition-all ${idx < currentIndex ? "bg-red-500" : "bg-gray-100"}`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}