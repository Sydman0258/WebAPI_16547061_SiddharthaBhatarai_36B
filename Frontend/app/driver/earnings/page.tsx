import { cookies } from "next/headers";
import { API } from "@/lib/api/endpoint";
import EarningsSummary from "./_components/EarningsSummary";
import EarningsChart from "./_components/EarningsChart";

async function getDriver(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.DRIVER.GET_MY}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    return (await res.json())?.data ?? null;
}

async function getDeliveries(driverId: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_DRIVER(driverId)}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    return (await res.json())?.data ?? [];
}

export default async function EarningsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const driver = await getDriver(token);
    const deliveries = driver ? await getDeliveries(driver._id, token) : [];
    const completed = deliveries.filter((d: any) => d.status === "delivered");

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Earnings 💰</h1>
                <p className="text-sm text-gray-400 mt-1">Based on completed deliveries</p>
            </div>
            <EarningsSummary deliveries={completed} />
            <EarningsChart deliveries={completed} />
        </div>
    );
}