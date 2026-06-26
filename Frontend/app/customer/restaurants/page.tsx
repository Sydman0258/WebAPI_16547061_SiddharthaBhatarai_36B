import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import RestaurantCard from "../_components/RestaurantCard";
import Navbar from "../_components/Navbar";

export default async function RestaurantsPage() {
    const restaurants = (await getAllRestaurants())?.data ?? [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Restaurants 🍽️</h1>
                    <p className="mt-2 text-sm text-gray-500">Find your next favourite meal</p>
                </div>
                {restaurants.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🍽️</span>
                        <h2 className="text-xl font-bold text-gray-800">No restaurants available</h2>
                        <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((r: any) => (
                            <RestaurantCard key={r._id} restaurant={r} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}