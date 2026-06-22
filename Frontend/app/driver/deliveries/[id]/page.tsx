import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { API } from "@/lib/api/endpoint";
import UpdateDeliveryStatus from "./_components/UpdateDeliveryStatus";
import DeliveryMap from "./_components/DeliveryMap";

async function getOrder(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_ID(id)}`, {
        headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json())?.data ?? null;
}

export default async function DeliveryDetailPage({ params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const order = await getOrder(params.id, token);
    if (!order) notFound();

    return (
        <div className="max-w-2xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Delivery Detail</h1>
                <p className="text-sm text-gray-400 mt-1">{new Date(order.placedAt).toLocaleString()}</p>
            </div>

            <DeliveryMap address={order.deliveryAddress} />

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 text-sm">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Delivery Info</h2>
                <p><span className="font-semibold text-gray-700">Customer:</span> {order.customerId?.fullname}</p>
                <p><span className="font-semibold text-gray-700">Address:</span> {order.deliveryAddress}</p>
                <p><span className="font-semibold text-gray-700">Restaurant:</span> {order.restaurantId?.restaurantName}</p>
                {order.notes && <p><span className="font-semibold text-gray-700">Notes:</span> {order.notes}</p>}
                <p><span className="font-semibold text-gray-700">Total:</span> Rs. {order.total?.toFixed(2)}</p>
            </div>

            <UpdateDeliveryStatus orderId={order._id} currentStatus={order.status} />
        </div>
    );
}