import { getUserData } from "@/lib/actions/auth_actions";
import { getAllRestaurants } from "@/lib/actions/restaurant_actions";
import Navbar from "./_components/Navbar";
import RestaurantCard from "./_components/RestaurantCard";

export default async function DashboardPage() {
    const userResult = await getUserData();
    const restaurantsResult = await getAllRestaurants();

    const user = userResult?.data;
    const restaurants = restaurantsResult?.data || [];

    const name = user?.fullname || user?.username || user?.email || "User";
    const address = user?.address || user?.savedAddress || "No address saved";
    const firstName = name.split(" ")[0];

    return (
        <div className="min-h-screen bg-amber-50/40">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20">
                {/* Greeting Header */}
                <div className="mb-10">
                    <h1 className="text-4xl lg:text-5xl font-semibold tracking-tighter text-stone-900">
                        Good afternoon, {firstName} 👋
                    </h1>
                    <p className="mt-3 text-stone-500 text-lg">
                        Delivering to{" "}
                        <span className="font-medium text-stone-700 underline decoration-dotted cursor-pointer hover:text-orange-600">
                            {address}
                        </span>
                    </p>
                </div>


                {/* Main Restaurant Sections */}
                <div className="space-y-16 mt-12">
                    {restaurants && restaurants.length > 0 ? (
                        <>
                            {/* Recommended */}
                            <Section title="Recommended for you">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {restaurants.slice(0, 8).map((restaurant: any) => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>
                            </Section>

                            {/* Popular Near You */}
                            <Section title="Popular near you">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {restaurants.slice(4, 12).map((restaurant: any) => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>
                            </Section>

                            {/* All Restaurants */}
                            <Section title="Restaurants near you">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {restaurants.map((restaurant: any) => (
                                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                                    ))}
                                </div>
                            </Section>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-6 block">🍽️</span>
                            <p className="text-xl text-stone-400">No restaurants available right now</p>
                            <p className="text-stone-500 mt-2">Please check back later</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Reusable Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-6 text-stone-900">
                {title}
            </h2>
            {children}
        </section>
    );
}