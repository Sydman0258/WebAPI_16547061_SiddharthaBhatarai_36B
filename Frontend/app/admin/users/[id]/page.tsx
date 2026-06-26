import Link from "next/link";
import { notFound } from "next/navigation";
import UserRoleBadge from "../_components/UserRoleBadge";
// Import your handleGetUserById server action (adjust path if needed)
import { handleGetUserById } from "@/lib/actions/admin/auth_actions"; 

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserPageProps) {
  // Await the dynamic URL parameters
  const { id } = await params;

  // Call your Server Action directly
  const response = await handleGetUserById(id);

  // If the server action fails or the user isn't found, trigger a 404
  if (!response.success || !response.data) {
    notFound();
  }

  const user = response.data;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Link */}
      <Link 
        href="/admin/users" 
        className="text-sm text-gray-500 hover:text-indigo-600 inline-flex items-center gap-1 mb-6 transition-colors"
      >
        ← Back to Users List
      </Link>

      {/* User Information Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              User Profile
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          </div>
          {/* Reusing your badge component */}
          <UserRoleBadge role={user.role} />
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">
              Unique ID
            </span>
            <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-700 border border-gray-100 text-xs">
              {id}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">
              Email Address
            </span>
            <span className="text-gray-900 font-medium">{user.email}</span>
          </div>

          {user.createdAt && (
            <div>
              <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">
                Account Created
              </span>
              <span className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}