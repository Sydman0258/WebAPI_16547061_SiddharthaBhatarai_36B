import { getUserData } from "@/lib/actions/auth_actions";
import Navbar from "./_components/Navbar";
import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import RestaurantCard from "./_components/RestaurantCard";

export default async function DashboardPage() {
    const result = await getUserData();
    const restaurants = (await getAllRestaurants())?.data;

    const user = result?.data;
    const name = user?.fullname || user?.username || user?.email || "User";
    const address = user?.address || user?.savedAddress || "No address saved";
    const firstName = name.split(" ")[0];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

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

                {/* Restaurant Grid */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Restaurants near you</h2>

                    {restaurants && restaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {restaurants.map((restaurant: any) => (
                                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-400">
                            <span className="text-5xl">🍽️</span>
                            <p className="mt-4 text-sm">No restaurants available right now.</p>
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}