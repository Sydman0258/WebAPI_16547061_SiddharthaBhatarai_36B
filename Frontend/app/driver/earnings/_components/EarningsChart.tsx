"use client";

const DRIVER_CUT = 0.1;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function EarningsChart({ deliveries }: { deliveries: any[] }) {
    const byMonth = MONTHS.map((month, idx) => ({
        month,
        earnings: deliveries
            .filter((d: any) => new Date(d.placedAt).getMonth() === idx)
            .reduce((sum: number, d: any) => sum + d.total * DRIVER_CUT, 0),
    }));

    const max = Math.max(...byMonth.map((m) => m.earnings), 1);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-6">Monthly Earnings</h2>
            <div className="flex items-end gap-2 h-36">
                {byMonth.map(({ month, earnings }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className="w-full bg-red-500 rounded-t-md transition-all"
                            style={{ height: `${(earnings / max) * 100}%`, minHeight: earnings > 0 ? "4px" : "0" }}
                        />
                        <span className="text-[10px] text-gray-400 font-medium">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}