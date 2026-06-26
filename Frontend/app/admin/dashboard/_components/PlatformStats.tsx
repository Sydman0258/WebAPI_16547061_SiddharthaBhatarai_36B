import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { handleGetAllUsers } from "@/lib/actions/admin/auth_actions";

async function fetchStats() {
  const result = await handleGetAllUsers({ page: 1, limit: 1 });
  const total = result.pagination?.total ?? 0;
  return { total };
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}

function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default async function PlatformStats() {
  const { total } = await fetchStats();

  const stats: StatCardProps[] = [
    {
      label: "Total Users",
      value: total,
      sub: "Registered accounts",
      icon: Users,
      accent: "bg-indigo-500",
    },
    {
      label: "Active Users",
      value: "—",
      sub: "Logged in last 30 days",
      icon: UserCheck,
      accent: "bg-emerald-500",
    },
    {
      label: "Suspended",
      value: "—",
      sub: "Restricted accounts",
      icon: UserX,
      accent: "bg-red-400",
    },
    {
      label: "Growth",
      value: "—",
      sub: "New this month",
      icon: TrendingUp,
      accent: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}