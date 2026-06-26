// app/_components/CreateUserModal.tsx
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { handleCreateUser } from "@/lib/actions/admin/auth_actions";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "customer",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.fullname || !form.email || !form.password) {
      setError("Username, Full name, Email, and Password are required.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await handleCreateUser(form);
    setLoading(false);

    if (result.success) {
      onSuccess();
      onClose();
      setForm({
        username: "",
        fullname: "",
        email: "",
        role: "customer",
        password: "",
        phoneNumber: "",
      });
    } else {
      setError(result.message ?? "Failed to create user.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-black">Create user</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Fields Content */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 text-sm px-3 py-2 rounded-lg font-medium">
              {error}
            </div>
          )}

          {[
            { label: "Username", key: "username", type: "text", placeholder: "janesmith123" },
            { label: "Full name", key: "fullname", type: "text", placeholder: "Jane Smith" },
            { label: "Email", key: "email", type: "email", placeholder: "jane@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
            { label: "Phone number", key: "phoneNumber", type: "tel", placeholder: "+1 (555) 000-0000" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-black mb-1.5">{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-500 font-medium bg-white"
              />
            </div>
          ))}

          {/* Dropdown Select Field */}
          <div>
            <label className="block text-xs font-semibold text-black mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black font-medium"
            >
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant</option>
              <option value="driver">Driver</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 px-6 pb-5 pt-3 border-t border-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create user
          </button>
        </div>
      </div>
    </div>
  );
}