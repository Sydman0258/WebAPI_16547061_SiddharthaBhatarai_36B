import { notFound, redirect } from "next/navigation";
import { getMyRestaurant } from "@/lib/actions/restaurant_actions";
import SettingsForm from "./_components/SettingsForm";

export const dynamic = "force-dynamic";
export default async function SettingsPage() {
    const restaurantRes = await getMyRestaurant();

    // Catch expired JWT or unauthenticated states cleanly
    if (!restaurantRes?.success) {
        if (restaurantRes?.message?.includes("jwt") || restaurantRes?.message?.includes("expired")) {
            redirect("/login?callbackUrl=/restaurant/settings");
        }

        // Generic fallback for actual server/database errors
        throw new Error(
            restaurantRes?.message || "Failed to fetch restaurant settings"
        );
    }

    if (!restaurantRes?.data) {
        notFound();
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-black">
                    Account Settings
                </h1>
                <p className="text-sm text-gray-500">
                    Control your availability and operation hours
                </p>
            </div>

            <SettingsForm restaurant={restaurantRes.data} />
        </div>
    );
}