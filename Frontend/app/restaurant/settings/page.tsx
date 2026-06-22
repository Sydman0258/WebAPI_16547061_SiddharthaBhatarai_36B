import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import { notFound } from "next/navigation";
import SettingsForm from "./_components/SettingsForm";

async function getMyRestaurant(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.RESTAURANT.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json())?.data ?? null;
}

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const restaurant = await getMyRestaurant(token);
    if (!restaurant) notFound();

    return (
        <div className="max-w-xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your restaurant's availability</p>
            </div>
            <SettingsForm restaurant={restaurant} />
        </div>
    );
}