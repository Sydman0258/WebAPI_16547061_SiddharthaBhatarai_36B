import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import RestaurantCard from "../_components/RestaurantCard";
import Navbar from "../_components/Navbar";

export default async function RestaurantsPage() {
    const restaurants = (await getAllRestaurants())?.data ?? [];

    return (
        <div className="min-h-screen bg-amber-50/40">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-semibold tracking-tighter text-stone-900">
                        All Restaurants
                    </h1>
                    <p className="mt-3 text-xl text-stone-500">
                        Discover the best places near you
                    </p>
                </div>

                {restaurants.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-7xl mb-6 opacity-50">🍽️</div>
                        <h2 className="text-2xl font-semibold text-stone-400">No restaurants available</h2>
                        <p className="text-stone-500 mt-3 max-w-sm mx-auto">
                            We couldn't find any restaurants in your area right now. Please check back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {restaurants.map((r: any) => (
                            <RestaurantCard key={r._id} restaurant={r} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}