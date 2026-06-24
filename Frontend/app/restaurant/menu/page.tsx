import { notFound } from "next/navigation";
import { getMyRestaurant } from "@/lib/actions/restaurant_actions";
import { getMenuByRestaurant } from "@/lib/actions/menu_actions"; 
import MenuTable from "./_component/MenuTable";

export default async function MenuPage() {
    const restaurantRes = await getMyRestaurant();

    if (!restaurantRes.success) {
        throw new Error(
            restaurantRes.message || "Failed to fetch restaurant data"
        );
    }

    if (!restaurantRes.data) {
        notFound();
    }

    const menuRes = await getMenuByRestaurant(restaurantRes.data._id);

    if (!menuRes.success) {
        throw new Error(
            menuRes.message || "Failed to fetch menu data"
        );
    }

    const menu = menuRes.data ?? [];

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">Menu</h1>
                    <p className="text-sm text-black mt-1">{menu.length} items</p>
                </div>
            </div>
            <MenuTable items={menu} restaurantId={restaurantRes.data._id} />
        </div>
    );
}