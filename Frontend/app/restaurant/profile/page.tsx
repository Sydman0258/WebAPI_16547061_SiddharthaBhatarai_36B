import { notFound } from "next/navigation";
import { getMyRestaurant } from "@/lib/actions/restaurant_actions";
import RestaurantProfileForm from "./_components/RestaurantProfileForm";

export const dynamic = "force-dynamic";
export default async function RestaurantProfilePage() {
    const restaurantRes = await getMyRestaurant();

    if (!restaurantRes.success) {
        throw new Error(
            restaurantRes.message || "Failed to fetch restaurant data"
        );
    }

    if (!restaurantRes.data) {
        notFound();
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-black">
                    Restaurant Profile
                </h1>
                <p className="text-sm text-black">
                    Manage your restaurant details
                </p>
            </div >

            <RestaurantProfileForm restaurant={restaurantRes.data} />
        </div>
    );
}