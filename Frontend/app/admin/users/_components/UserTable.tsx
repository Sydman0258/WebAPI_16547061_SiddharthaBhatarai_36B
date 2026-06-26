"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Layers } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import { handleDeleteUser } from "@/lib/actions/admin/auth_actions";
import { toast } from "react-toastify";

interface User {
    _id: string;
    fullname?: string;
    email: string;
    role: string;
    createdAt?: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface UserTableProps {
    data: User[];
    pagination?: Pagination;
    search?: string;
}

export default function UserTable({ data, pagination, search }: UserTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const users = data ?? [];
    
    // Set up safe defaults if pagination is missing from backend response
    const currentPage = pagination?.page ?? 1;
    const totalPages = pagination?.totalPages ?? 1;
    const currentLimit = pagination?.limit ?? 10;
    const totalUsers = pagination?.total ?? users.length;

    const changeParam = (key: string, value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(window.location.search);
            params.set(key, value);
            if (key === "limit") params.set("page", "1"); // Reset to page 1 if page limit changes
            router.push(`?${params.toString()}`);
        });
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            const res = await handleDeleteUser(userToDelete.id);
            if (res && 'success' in res && !res.success) {
                throw new Error(res.message || "Failed to delete user");
            }
            toast.success("User deleted successfully");
            setUserToDelete(null);
            router.refresh(); 
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setIsDeleting(false);
        }
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-400 text-sm">No users found.</p>
                <p className="text-gray-300 text-xs mt-1">Try adjusting your search or create a new user.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden relative">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">User</th>
                            <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
                            <th className="text-left px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                            <th className="px-5 py-3.5 text-right"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => {
                            const displayName = user.fullname ?? "Unnamed";
                            const initials = (user.fullname ?? user.email).slice(0, 2).toUpperCase();
                            const isRowDeleting = isDeleting && userToDelete?.id === user._id;

                            return (
                                <tr
                                    key={user._id}
                                    className={`hover:bg-gray-50 transition-colors ${isRowDeleting ? "opacity-50 pointer-events-none" : ""}`}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                {initials}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{displayName}</p>
                                                <p className="text-gray-400 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <UserRoleBadge role={user.role} />
                                    </td>
                                    <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title="Edit user"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                            <button
                                                disabled={isDeleting}
                                                onClick={() => setUserToDelete({ id: user._id, name: displayName })}
                                                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination & Limit Selection Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <p>
                        Showing {Math.min((currentPage - 1) * currentLimit + 1, totalUsers)}–{Math.min(currentPage * currentLimit, totalUsers)} of {totalUsers} users
                    </p>
                    
                    {/* Rows Per Page Dropdown Selector */}
                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                        <span className="text-gray-400">Rows:</span>
                        <select
                            value={currentLimit}
                            disabled={isPending}
                            onChange={(e) => changeParam("limit", e.target.value)}
                            className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                {/* Page Navigation Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => changeParam("page", String(currentPage - 1))}
                        disabled={currentPage <= 1 || isPending}
                        className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Previous Page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-xs font-medium text-gray-600 px-2 bg-gray-100 py-1 rounded-md">
                        {currentPage} / {totalPages}
                    </span>
                    
                    <button
                        onClick={() => changeParam("page", String(currentPage + 1))}
                        disabled={currentPage >= totalPages || isPending}
                        className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Next Page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Custom Modern Modal Overlay */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-100 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Delete User Account</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Are you sure you want to delete <span className="font-semibold text-gray-800">"{userToDelete.name}"</span>? All associated data will be permanently removed. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setUserToDelete(null)}
                                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 min-w-[100px]"
                            >
                                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : "Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}