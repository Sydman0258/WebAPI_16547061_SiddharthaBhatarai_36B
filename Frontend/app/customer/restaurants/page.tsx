'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../_components/Navbar';

const mockRestaurants = [
  {
    id: '1',
    name: 'Sushi Zen',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '20-30 min',
    deliveryFee: '$1.99',
    priceTier: '$$$',
    isOpen: true,
    image: '',
    tagline: 'Authentic premium sushi & fresh sashimi rolls.',
  },
  {
    id: '2',
    name: 'Pizza Paradise',
    cuisine: 'Italian',
    rating: 4.6,
    deliveryTime: '30-45 min',
    deliveryFee: 'Free',
    priceTier: '$$',
    isOpen: true,
    image: '',
    tagline: 'Wood-fired brick oven pizzas made with love.',
  },
  {
    id: '3',
    name: 'Burger & Co.',
    cuisine: 'American',
    rating: 4.4,
    deliveryTime: '15-25 min',
    deliveryFee: '$2.50',
    priceTier: '$',
    isOpen: false,
    image: '',
    tagline: 'Smash burgers, crispy golden fries, and thick shakes.',
  },
  {
    id: '4',
    name: 'Tokyo Ramen Hub',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '25-35 min',
    deliveryFee: '$0.99',
    priceTier: '$$',
    isOpen: true,
    image: '',
    tagline: 'Rich, 12-hour slow-simmered tonkotsu broth.',
  },
];

export default function RestaurantsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [sort, setSort] = useState('Top Rated');
  const [openOnly, setOpenOnly] = useState(false);

  const filteredRestaurants = mockRestaurants
    .filter((r) => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchesCuisine = activeCuisine === 'All' || r.cuisine === activeCuisine;
      const matchesOpenStatus = !openOnly || r.isOpen;
      return matchesSearch && matchesCuisine && matchesOpenStatus;
    })
    .sort((a, b) => {
      if (sort === 'Top Rated') return b.rating - a.rating;
      if (sort === 'Fastest') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (sort === 'Price: Low') return a.priceTier.length - b.priceTier.length;
      if (sort === 'Price: High') return b.priceTier.length - a.priceTier.length;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Explore Restaurants 🍽️
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Discover the best food and flavors in your local neighborhood area.
          </p>
        </div>

        {/* Search and Core Filter Bar */}
        <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row md:items-center gap-4">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes or restaurants..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
          </div>

          {/* Right-Aligned Dropdown controls */}
          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option>Top Rated</option>
                <option>Fastest</option>
                <option>Price: Low</option>
                <option>Price: High</option>
              </select>
              <span className="absolute right-3 top-3.5 pointer-events-none text-xs text-gray-400">▼</span>
            </div>

            {/* Toggle Switch styling for Open Only */}
            <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4 border-gray-300"
              />
              <span>Open Now</span>
            </label>
          </div>
        </section>

        {/* Cuisine Pills Navigation */}
        <section className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex gap-2">
            {['All', 'Japanese', 'Italian', 'American'].map((c) => {
              const isActive = activeCuisine === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCuisine(isActive ? 'All' : c)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </section>

        {/* Dynamic Search Results */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Available Kitchens ({filteredRestaurants.length})
            </h2>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
              <span className="text-4xl block mb-2">😕</span>
              <h3 className="font-bold text-gray-800">No restaurants match your filters</h3>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => router.push(`/customer/restaurants/${restaurant.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
                >
                  {/* Card Banner Concept */}
                  <div className="bg-gray-50 h-32 flex items-center justify-center text-5xl relative group-hover:bg-orange-50/40 transition-colors">
                    {restaurant.image}
                    
                    {/* Status Absolute Pill */}
                    <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                      restaurant.isOpen 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>

                  {/* Card Metadata Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center text-sm font-bold text-orange-500">
                          <span>⭐ {restaurant.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs font-semibold text-orange-600 tracking-wide uppercase mb-2">
                        {restaurant.cuisine} &bull; {restaurant.priceTier}
                      </p>
                      
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {restaurant.tagline}
                      </p>
                    </div>

                    {/* Operational Delivery Stats */}
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-700">Fee:</span>
                        <span className={restaurant.deliveryFee === 'Free' ? 'text-emerald-600 font-bold' : ''}>
                          {restaurant.deliveryFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}