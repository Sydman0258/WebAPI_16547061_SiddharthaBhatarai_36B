export default function StatCard({
    label,
    value,
    icon,
    color = "text-gray-900",
}: {
    label: string;
    value: string | number;
    icon: string;
    color?: string;
}) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">{label}</p>
        </div>
    );
}