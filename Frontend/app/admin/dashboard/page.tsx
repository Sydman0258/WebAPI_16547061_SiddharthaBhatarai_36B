import { Suspense } from "react";
import PlatformStats from "./_components/PlatformStats";
import RecentActivity from "./_components/RecentActivity";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-24 animate-pulse" />
      ))}
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-64 animate-pulse" />
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview and recent activity</p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <PlatformStats />
      </Suspense>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>

        {/* Quick links panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Manage users", href: "/admin/users" },
              { label: "Create new user", href: "/admin/users?action=create" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group"
              >
                <span>{label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}