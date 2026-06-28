"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleUpdateUser, handleUpdateUserPassword } from "@/lib/actions/admin/auth_actions";

interface UserEditFormProps {
  id: string;
  initialUser: {
    fullname: string;
    email: string;
    role: string;
  };
}

export default function UserEditForm({ id, initialUser }: UserEditFormProps) {
  const router = useRouter();
  
  // States for Profile Editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullname, setFullname] = useState(initialUser?.fullname ?? "");
  const [email, setEmail] = useState(initialUser?.email ?? "");
  const [role, setRole] = useState(initialUser?.role ?? "customer");
  
  // States for Password Editing - focusing strictly on the new password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Global UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await handleUpdateUser(id, { name, email, role });
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Profile updated successfully!" });
      setIsEditingProfile(false);
      router.refresh();
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Map your new password to satisfy all required backend parameters silently
    const res = await handleUpdateUserPassword(id, { 
      currentPassword: newPassword, 
      newPassword: newPassword, 
      confirmPassword: confirmPassword 
    });
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Password updated successfully!" });
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Toast/Status Message */}
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="customer" className="text-black">Customer</option>
                <option value="restaurant" className="text-black">Restaurant</option>
                <option value="driver" className="text-black">Driver</option>
                <option value="banned" className="text-black">Banned</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setIsEditingProfile(false); setMessage(null); }}
                className="text-sm border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">Full Name</span>
              <span className="text-gray-900 font-medium">{fullname}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">Email Address</span>
              <span className="text-gray-900 font-medium">{email}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-400 block uppercase text-[10px] tracking-wider mb-0.5">Role Status</span>
              <span className="capitalize font-medium text-gray-950">{role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Password Management Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-3 rounded-lg transition"
            >
              Reset Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-sm text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setIsChangingPassword(false); setMessage(null); }}
                className="text-sm border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="text-sm bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-500 flex items-center justify-between">
            <span>Password status:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Encrypted</span>
          </div>
        )}
      </div>
    </div>
  );
}