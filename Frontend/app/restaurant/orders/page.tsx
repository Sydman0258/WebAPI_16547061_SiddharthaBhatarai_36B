'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/api/axiosinstance';
import { API } from '@/lib/api/endpoint';
import OrderTable from './_components/OrderTable';

export default function RestaurantOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                // First get the restaurant
                const restaurantRes = await axiosInstance.get(API.RESTAURANT.GET_MY);
                const restaurant = restaurantRes.data?.data;
                if (!restaurant) return;

                // Then get its orders
                const ordersRes = await axiosInstance.get(API.ORDER.GET_BY_RESTAURANT(restaurant._id));
                setOrders(ordersRes.data?.data ?? []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {loading ? 'Loading...' : `${orders.length} total orders`}
                </p>
            </div>
            {loading ? (
                <div className="text-center py-16 text-gray-400">
                    <span className="text-4xl block mb-3 animate-pulse"></span>
                    <p className="text-sm font-medium">Loading orders...</p>
                </div>
            ) : (
                <OrderTable orders={orders} />
            )}
        </div>
    );
}