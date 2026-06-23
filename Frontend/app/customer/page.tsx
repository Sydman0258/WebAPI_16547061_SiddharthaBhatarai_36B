import { getUserData } from "@/lib/actions/auth_actions";
import Navbar from "./_components/Navbar";

export default async function DashboardPage() {
    const result = await getUserData();
    const user = result?.data;
    const name = user?.fullname || user?.username || user?.email || "User";
    const address = user?.address || user?.savedAddress || "No address saved";
const firstName=name.split(" ")[0];
    return (
        <div className="min-h-screen bg-white text-gray-900">
<Navbar/>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Top Header Section */}
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        Hungry, {firstName}? 
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Delivering to: <span className="font-semibold text-gray-700">{address}</span>
                    </p>
                </div>

            </main>
        </div>
    );
}