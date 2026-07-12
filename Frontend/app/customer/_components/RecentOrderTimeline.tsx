'use client';

import { useEffect, useState } from 'react';
import { handleGetOrderById } from "@/lib/actions/order_actions";
import OrderTimeline from '../orders/[id]/_components/OrderTimeline';

export default function RecentOrderTimeline({ orderId }: { orderId: string }) {
    const [status, setStatus] = useState<string | null>(null);
    const [debug, setDebug] = useState<string>('');

    useEffect(() => {
        console.log('[RecentOrderTimeline] orderId prop:', orderId);
        async function fetchOrder() {
            const result = await handleGetOrderById(orderId);
            console.log('[RecentOrderTimeline] fetch result:', result);
            if (result.success) {
                setStatus(result.data.status?.toLowerCase());
            } else {
                setDebug(result.message || 'fetch failed');
            }
        }
        if (orderId) {
            fetchOrder();
        } else {
            setDebug('no orderId passed in');
        }
    }, [orderId]);

    if (!status) {
        return debug ? (
            <p className="text-[10px] text-red-400 mt-2">Debug: {debug}</p>
        ) : null;
    }

    return <OrderTimeline status={status} />;
}