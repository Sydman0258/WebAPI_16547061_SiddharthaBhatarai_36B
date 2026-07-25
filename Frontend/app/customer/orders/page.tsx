'use client';  

import { useEffect, useState } from 'react';
import { handleGetMyOrders } from "@/lib/actions/order_actions";
import OrderCard from "./_components/OrderCard";
import Navbar from "../_components/Navbar";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            const result = await handleGetMyOrders();
            if (result.success) {
                setOrders(result.data);
            }
            setLoading(false);
        }
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 border-b border-gray-100 pb-5">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Orders </h1>
                    <p className="mt-2 text-sm text-gray-500">Track your current and past orders</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4 animate-pulse"></span>
                        <p className="text-gray-400 text-sm">Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4"></span>
                        <h2 className="text-xl font-bold text-gray-800">No orders yet</h2>
                        <p className="text-sm text-gray-400 mt-2">Your order history will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}