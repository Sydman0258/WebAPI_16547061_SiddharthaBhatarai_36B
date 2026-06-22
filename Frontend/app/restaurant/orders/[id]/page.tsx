import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { API } from "@/lib/api/endpoint";
import UpdateStatusButton from "./_component/UpdateStatusButton";

async function getOrder(id: string, token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API.ORDER.GET_BY_ID(id)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data ?? null;
}

export default async function RestaurantOrderDetailPage({ params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? "";
    const order = await getOrder(params.id, token);
    if (!order) notFound();

    return (
        <div className="max-w-2xl space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Order Detail</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {order.customerId?.fullname} · {new Date(order.placedAt).toLocaleString()}
                </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Items</h2>
                <div className="divide-y divide-gray-50">
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-3 text-sm">
                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            <span className="font-semibold text-gray-900">Rs. {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-base">
                    <span>Total</span>
                    <span className="text-red-600">Rs. {order.total?.toFixed(2)}</span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-2 text-sm">
                <p><span className="font-semibold text-gray-700">Address:</span> {order.deliveryAddress}</p>
                {order.notes && <p><span className="font-semibold text-gray-700">Notes:</span> {order.notes}</p>}
            </div>

            <UpdateStatusButton orderId={order._id} currentStatus={order.status} />
        </div>
    );
}