import { notFound } from "next/navigation";
import { API } from "@/lib/api/endpoint";
import RestaurantHeader from "./_components/RestaurantHeader";
import MenuList from "./_components/MenuList";

async function getRestaurant(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_BY_ID(id)}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? null;
}

async function getMenu(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.MENU.GET_AVAILABLE(id)}`, {
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
}

export default async function RestaurantDetailPage({ params }: { params: { id: string } }) {
    const [restaurant, menu] = await Promise.all([
        getRestaurant(params.id),
        getMenu(params.id),
    ]);

    if (!restaurant) notFound();

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <RestaurantHeader restaurant={restaurant} />
                <MenuList items={menu} restaurantId={params.id} />
            </main>
        </div>
    );
}