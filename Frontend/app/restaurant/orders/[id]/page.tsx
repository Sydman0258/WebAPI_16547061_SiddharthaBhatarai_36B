'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { handleGetOrderById } from '@/lib/actions/order_actions';
import UpdateStatusButton from './_component/UpdateStatusButton';

export default function RestaurantOrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        const result = await handleGetOrderById(id as string);
        setOrder(result.success ? result.data : null);
    };

    useEffect(() => {
        async function loadOrder() {
            setLoading(true);
            try {
                await fetchOrder();
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        }
        if (id) loadOrder();
    }, [id]);

    const refetch = async () => {
        await fetchOrder();
    };

    if (loading) return (
        <div className="text-center py-20 text-gray-400">
            <span className="text-4xl block mb-3 animate-pulse">📦</span>
            <p className="text-sm">Loading order...</p>
        </div>
    );

    if (!order) return (
        <div className="text-center py-20 text-gray-400">
            <span className="text-4xl block mb-3">⚠️</span>
            <p className="text-sm">Order not found.</p>
            <button onClick={() => router.push('/restaurant/orders')} className="mt-4 text-sm text-red-600 underline">
                Back to Orders
            </button>
        </div>
    );

    return (
        <div className="max-w-2xl space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center gap-4">
                <button onClick={() => router.push('/restaurant/orders')} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                    ← Back
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Order Detail</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {order.customerId?.fullname} · {new Date(order.placedAt).toLocaleString()}
                    </p>
                </div>
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

            <UpdateStatusButton orderId={order._id} currentStatus={order.status} onSuccess={refetch} />
        </div>
    );
}