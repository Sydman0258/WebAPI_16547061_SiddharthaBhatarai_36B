import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import DeliverySummary from "./_components/DeliverySummary";
import RatingSummary from "./_components/RatingSummary";

async function getDriverProfile(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.DRIVER.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json())?.data ?? null;
}

async function getMyDeliveries(driverId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_DRIVER(driverId)}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json())?.data ?? [];
}

export default async function DriverDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const driver = await getDriverProfile(token);
    const deliveries = driver ? await getMyDeliveries(driver._id, token) : [];

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-100 pb-5">
                <h1 className="text-3xl font-extrabold text-gray-900">Dashboard 🚗</h1>
                <p className="text-sm text-gray-400 mt-1">Your delivery overview</p>
            </div>
            <DeliverySummary deliveries={deliveries} />
            <RatingSummary driver={driver} />
        </div>
    );
}