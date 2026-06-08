'use client';

import { useState } from 'react';
import Navbar from '../_components/Navbar';

// Structured mock data grouped by delivery status categories
const mockOrders = {
  current: [
    {
      id: '#ORD-8839',
      restaurant: 'Sushi Zen',
      date: 'Today, 8:45 PM',
      total: '$41.24',
      items: '2x Spicy Tuna Crunch Roll, 1x Pork Gyoza',
      status: 'In the Kitchen',
      statusColor: 'text-orange-500 bg-orange-50 border-orange-100',
    },
    {
      id: '#ORD-8832',
      restaurant: 'Burger & Co.',
      date: 'Today, 8:15 PM',
      total: '$15.50',
      items: '1x Classic Smash Burger, 1x Large Fries',
      status: 'Driver Picking Up',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-100',
    }
  ],
  past: [
    {
      id: '#ORD-8720',
      restaurant: 'Wok Express',
      date: 'May 24, 2026',
      total: '$24.50',
      items: '1x Pad Thai, 1x Spring Rolls',
      status: 'Delivered',
    },
    {
      id: '#ORD-8511',
      restaurant: 'Pizza Paradise',
      date: 'May 18, 2026',
      total: '$32.00',
      items: '1x Large Pepperoni Pizza, 1x Garlic Knots',
      status: 'Delivered',
    }
  ],
  cancelled: [
    {
      id: '#ORD-8104',
      restaurant: 'Tokyo Ramen Hub',
      date: 'May 10, 2026',
      total: '$16.50',
      items: '1x Tonkotsu Ramen Special',
      reason: 'Restaurant ran out of ingredients',
    }
  ]
};

type TabType = 'current' | 'past' | 'cancelled';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('current');

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My Orders 📝
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track live meals or review your complete order culinary history.
          </p>
        </div>

        {/* Tab Selection Filter Controls */}
        <div className="border-b border-gray-100 mb-8 flex space-x-6 overflow-x-auto scrollbar-none">
          {(['current', 'past', 'cancelled'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              current: 'Active Orders',
              past: 'Past Orders',
              cancelled: 'Cancelled'
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all capitalize focus:outline-none ${
                  isActive
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body Renderings */}
        <div className="space-y-4">
          
          {/* Active Orders view */}
          {activeTab === 'current' && (
            mockOrders.current.length === 0 ? (
              <EmptyState message="No ongoing deliveries right now." description="Hungry? Head back to the store to order something fresh." />
            ) : (
              mockOrders.current.map((order) => (
                <div key={order.id} className="border border-orange-100 rounded-2xl p-6 shadow-sm bg-white relative">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.restaurant}</h3>
                      <p className="text-xs text-gray-400 font-medium">{order.date} &bull; <span className="font-bold text-gray-700">{order.total}</span></p>
                    </div>
                    {/* Status badge flashing animation effect */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border animate-pulse ${order.statusColor}`}>
                      • {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 border-t border-gray-50 pt-3">{order.items}</p>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors">
                      Track Live Map
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Past Orders view */}
          {activeTab === 'past' && (
            mockOrders.past.length === 0 ? (
              <EmptyState message="No previous orders found." description="Your past successful deliveries will register automatically here." />
            ) : (
              mockOrders.past.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-6 shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.restaurant}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date} &bull; {order.id}</p>
                    <p className="text-sm text-gray-600 mt-2">{order.items}</p>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                    <span className="text-base font-black text-gray-900">{order.total}</span>
                    {/* Action Reorder Button (Primary Red) */}
                    <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap">
                      Order Again
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* Cancelled Orders view */}
          {activeTab === 'cancelled' && (
            mockOrders.cancelled.length === 0 ? (
              <EmptyState message="No cancelled orders." description="Everything looks clean! Safe deliveries all around." />
            ) : (
              mockOrders.cancelled.map((order) => (
                <div key={order.id} className="border border-red-50 rounded-2xl p-6 shadow-sm bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-400 line-through">{order.restaurant}</h3>
                      <p className="text-xs text-gray-400">{order.date} &bull; <span className="font-medium text-gray-500">{order.total}</span></p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                      Cancelled
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{order.items}</p>
                  <div className="bg-red-50/40 rounded-xl p-3 text-xs text-red-700 font-medium">
                    ⚠️ <span className="font-bold">Cancellation Reason:</span> {order.reason}
                  </div>
                </div>
              ))
            )
          )}

        </div>
      </main>
    </div>
  );
}

function EmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
      <span className="text-3xl block mb-2">📋</span>
      <h3 className="font-bold text-gray-700">{message}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}