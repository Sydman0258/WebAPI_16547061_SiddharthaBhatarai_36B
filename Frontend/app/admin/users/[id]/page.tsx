import Link from "next/link";
import { notFound } from "next/navigation";
import UserRoleBadge from "../_components/UserRoleBadge";
import UserEditForm from "../_components/UserEditForm"; // Import the form
import { handleGetUserById } from "@/lib/actions/admin/auth_actions"; 

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserPageProps) {
  const { id } = await params;
  const response = await handleGetUserById(id);

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

      {/* User Header Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-1">
              User Profile
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          </div>
          <UserRoleBadge role={user.role} />
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">
              Unique ID
            </span>
            <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-700 border border-gray-100 text-xs">
              {id}
            </span>
          </div>

          {user.createdAt && (
            <div className="text-right">
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

      {/* Modular Client Interaction Forms */}
      <UserEditForm id={id} initialUser={{ fullname: user.fullname, email: user.email, role: user.role }} />
    </div>
  );
}