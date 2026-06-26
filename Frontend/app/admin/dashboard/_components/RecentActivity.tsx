import { handleGetAllUsers } from "@/lib/actions/admin/auth_actions";
import { Clock } from "lucide-react";
import UserRoleBadge from "../../users/_components/UserRoleBadge";

export default async function RecentActivity() {
  const result = await handleGetAllUsers({ page: 1, limit: 5 });
  const users: any[] = result.data ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-700">Recent Users</h2>
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">No users yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {users.map((user: any) => (
            <li key={user._id} className="flex items-center justify-between py-3 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 uppercase">
                  {user.username?.[0] ?? user.email?.[0] ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username ?? "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <UserRoleBadge role={user.role} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}