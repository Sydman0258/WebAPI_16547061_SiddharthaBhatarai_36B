'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { handleGetOrderById } from "@/lib/actions/order_actions";
import OrderTimeline from './_components/OrderTimeline';
import OrderItems from './_components/OrderItems';
import Navbar from '../../_components/Navbar';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchOrder() {
            const result = await handleGetOrderById(id as string);
            if (result.success) {
                setOrder(result.data);
            } else {
                setError(result.message || 'Order not found');
            }
            setLoading(false);
        }
        if (id) fetchOrder();
    }, [id]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.push('/customer/orders')}
                        className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        ← Back to Orders
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4 animate-pulse">📦</span>
                        <p className="text-gray-400 text-sm">Loading order details...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">⚠️</span>
                        <h2 className="text-xl font-bold text-gray-800">Something went wrong</h2>
                        <p className="text-sm text-gray-400 mt-2">{error}</p>
                    </div>
                ) : order ? (
                    <>
                        <div className="mb-6 border-b border-gray-100 pb-5">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                Order Details 
                            </h1>
                            <p className="text-xs text-gray-400 mt-1 font-mono">#{order._id}</p>
                        </div>

                        <OrderTimeline status={order.status?.toLowerCase()} />
                        <OrderItems order={order} />
                    </>
                ) : null}

            </main>
        </div>
    );
}