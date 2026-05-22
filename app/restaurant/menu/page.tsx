"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  available: boolean;
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: "Chicken Burger",
      category: "Burger",
      price: "$12.99",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
      available: true,
    },
    {
      id: 2,
      name: "Margherita Pizza",
      category: "Pizza",
      price: "$18.50",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop",
      available: true,
    },
    {
      id: 3,
      name: "Veg MoMo",
      category: "Nepali",
      price: "$9.99",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
      available: false,
    },
    {
      id: 4,
      name: "Fish & Chips",
      category: "Seafood",
      price: "$15.99",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1576777647209-e8733d7b851d?q=80&w=1200&auto=format&fit=crop",
      available: true,
    },
  ]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Navigation / Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Restaurant Menu
          </h1>

          <p className="text-sm text-gray-500">
            Manage your dishes, pricing, and availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search menu..."
              className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#A34F11]/20 w-[260px]"
            />
          </div>

          {/* Add Button */}
          <button className="bg-[#A34F11] hover:bg-[#8B420E] transition-all text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md shadow-[#A34F11]/20 font-semibold text-sm active:scale-[0.98]">
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
            Total Items
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {menuItems.length}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
            Available
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {menuItems.filter((item) => item.available).length}
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
            Out of Stock
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {menuItems.filter((item) => !item.available).length}
          </h2>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#A34F11]/20 transition-all group"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#A34F11] font-bold mb-1">
                    {item.category}
                  </p>

                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>
                </div>

                <h2 className="text-lg font-bold text-[#A34F11]">
                  {item.price}
                </h2>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-5">
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="text-sm font-semibold text-gray-700">
                  {item.rating}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-[#FFEDE1] text-[#A34F11] py-3 rounded-2xl font-semibold text-sm hover:bg-[#ffdcca] transition-colors flex items-center justify-center gap-2">
                  <Pencil size={16} />
                  Edit
                </button>

                <button className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl font-semibold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;