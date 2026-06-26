// app/admin/users/page.tsx
import { handleGetAllUsers } from "@/lib/actions/admin/auth_actions";
import UserTable from "./_components/UserTable";
import CreateUserButtonAndModal from "./_components/CreateUserButtonAndModal"; // Extracted button/modal container
import { SearchInput } from "./_components/SearchInput"; // Clean client component for search input

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Await search params according to Next.js guidelines
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const search = query.search ? (query.search as string) : '';

    // Secure server-side data fetching
    const result = await handleGetAllUsers({ page, limit, search });

    if (!result.success) {
        throw new Error("Failed to load users");
    }

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-black">Users</h1>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">
                        {result.pagination?.total ?? 0} total accounts
                    </p>
                </div>
                {/* Client container to keep button actions local, rendering zero layout overhead */}
                <CreateUserButtonAndModal />
            </div>

            {/* Search Input Box Component */}
            <SearchInput initialValue={search} />

            {/* Table Component with Integrated Modal management */}
            <UserTable 
                data={result.data ?? []} 
                pagination={result.pagination} 
                search={search} 
            />
        </div>
    );
}