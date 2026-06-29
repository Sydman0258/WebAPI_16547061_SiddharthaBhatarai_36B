import { notFound } from "next/navigation";
import { getRestaurantById } from "@/lib/actions/restaurant_actions";
import { getAvailableMenu } from "@/lib/actions/menu_actions";
import RestaurantHeader from "./_components/RestaurantHeader";
import MenuList from "./_components/MenuList";
import Navbar from "../../_components/Navbar";

export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [restaurantRes, menuRes] = await Promise.all([
        getRestaurantById(id),
        getAvailableMenu(id),
    ]);

    const restaurant = restaurantRes?.data;
    const menu = menuRes?.data ?? [];

    if (!restaurant) notFound();

    return (
     
        <div className="min-h-screen bg-white">
               <Navbar/>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RestaurantHeader restaurant={restaurant} />
                <MenuList items={menu} restaurantId={id} />
            </main>
        </div>
    );
}