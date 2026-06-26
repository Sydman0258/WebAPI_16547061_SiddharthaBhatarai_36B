// app/admin/users/_components/CreateUserButtonAndModal.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateUserModal from "../../../_component/CreateUserModal";

export default function CreateUserButtonAndModal() {
    const router = useRouter();
    const [showCreate, setShowCreate] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors self-start sm:self-auto"
            >
                <Plus size={16} />
                Create user
            </button>

            <CreateUserModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={() => {
                    setShowCreate(false);
                    router.refresh(); // Tells server component to update dataset
                }}
            />
        </>
    );
}