import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import MenuTable from "./_component/MenuTable";

async function getRestaurant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json())?.data ?? null;
}

async function getMenu(restaurantId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.MENU.GET_BY_RESTAURANT(restaurantId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json())?.data ?? [];
}

export default async function MenuPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const restaurant = await getRestaurant(token);
    const menu = restaurant ? await getMenu(restaurant._id, token) : [];

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Menu</h1>
                    <p className="text-sm text-gray-400 mt-1">{menu.length} items</p>
                </div>
            </div>
            <MenuTable items={menu} restaurantId={restaurant?._id} />
        </div>
    );
}