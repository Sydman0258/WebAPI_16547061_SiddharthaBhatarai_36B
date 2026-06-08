'use client';

import React from 'react';
import Navbar from './_components/Navbar';

const customerData = {
  name: 'Alex',
  savedAddress: '123 Gourmet Way, Apartment 4B',
  activeDelivery: {
    restaurant: 'Burger & Co.',
    status: 'Driver is picking up your food',
    estimatedArrival: '12:45 PM',
    progressPercent: 75,
  },
  favorites: [
    { name: 'Taco Loco', cuisine: 'Mexican', rating: 4.8, image: '🌮' },
    { name: 'Sushi Zen', cuisine: 'Japanese', rating: 4.9, image: '🍣' },
    { name: 'Pizza Paradise', cuisine: 'Italian', rating: 4.6, image: '🍕' },
  ],
  pastOrders: [
    { id: '#FD-8831', restaurant: 'Wok Express', date: 'Yesterday', total: '$24.50', items: '1x Pad Thai, 1x Spring Rolls' },
    { id: '#FD-8720', restaurant: 'Green Garden Salad', date: 'May 22, 2026', total: '$18.00', items: '1x Caesar Salad, 1x Kombucha' },
  ],
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Section */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Hungry, {customerData.name}? 🍕
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Delivering to: <span className="font-semibold text-gray-700">{customerData.savedAddress}</span>
          </p>
        </div>

        {/* Live Order Tracker */}
        {customerData.activeDelivery && (
          <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6 mb-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 animate-pulse mb-2">
                  Live Order Track
                </span>
                <h2 className="text-xl font-bold text-gray-900">{customerData.activeDelivery.restaurant}</h2>
                <p className="text-sm text-gray-600 mt-1">{customerData.activeDelivery.status}</p>
              </div>
              <div className="mt-4 sm:mt-0 text-left sm:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Estimated Delivery</p>
                <p className="text-2xl font-black text-red-600">{customerData.activeDelivery.estimatedArrival}</p>
              </div>
            </div>
            
            {/* Progress Bar (Orange track indicating journey) */}
            <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-2 transition-all duration-500" 
                style={{ width: `${customerData.activeDelivery.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Reorder & Favorites */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Reorder Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Order It Again</h3>
              <div className="divide-y divide-gray-100">
                {customerData.pastOrders.map((order) => (
                  <div key={order.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.restaurant}</h4>
                      <p className="text-xs text-gray-400 mb-1">{order.date} &bull; {order.total}</p>
                      <p className="text-sm text-gray-600 truncate max-w-sm sm:max-w-md">{order.items}</p>
                    </div>
                    {/* Primary Action Button (Red) */}
                    <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors">
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Restaurants */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Your Favorites</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {customerData.favorites.map((fav, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors cursor-pointer text-center sm:text-left">
                    <span className="text-3xl block sm:inline-block mb-2 sm:mb-0" role="img" aria-label={fav.name}>
                      {fav.image}
                    </span>
                    <h4 className="font-bold text-gray-900 sm:mt-2">{fav.name}</h4>
                    <div className="flex items-center justify-center sm:justify-start text-xs text-gray-500 mt-1 space-x-2">
                      <span>{fav.cuisine}</span>
                      <span>&bull;</span>
                      <span className="text-orange-500 font-medium">⭐ {fav.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Search Promo & Coupons */}
          <div className="space-y-6">
            
            {/* Search Banner (Red to Orange Gradient) */}
            <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-black mb-2">Craving something else?</h3>
              <p className="text-red-50 text-sm mb-4">Explore thousands of local restaurants delivering near you right now.</p>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search dishes or restaurants..." 
                  className="w-full pl-4 pr-10 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-inner"
                />
                <span className="absolute right-3 top-3.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Offers/Coupons Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-md font-bold text-gray-900 mb-3">Available Promos</h3>
              <div className="border-2 border-dashed border-orange-200 rounded-xl p-3 bg-orange-50/30 flex justify-between items-center">
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">Code: CRISPY20</p>
                  <p className="text-sm font-bold text-gray-800">20% off your next chicken order</p>
                </div>
                <span className="text-2xl">🍗</span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}