"use client";

import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const DashboardSummary = () => {
  return (
    <div className="h-full flex flex-col gap-8 pb-8">
      {/* 1. Welcome & Date */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Good Morning, Admin</h1>
        <p className="text-gray-500 text-sm font-medium">Here's what's happening with your store today.</p>
      </div>

      {/* 2. Key Metrics Pulse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="Rs. 42,500" change="+12.5%" icon={<DollarSign size={20}/>} isUp={true} />
        <StatCard title="Total Orders" value="156" change="+5.2%" icon={<ShoppingBag size={20}/>} isUp={true} />
        <StatCard title="New Customers" value="42" change="-2.4%" icon={<Users size={20}/>} isUp={false} />
        <StatCard title="Avg. Order Value" value="Rs. 272" change="+8.1%" icon={<TrendingUp size={20}/>} isUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Performance Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm min-h-[350px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Sales Overview</h3>
            <select className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-lg outline-none cursor-pointer border-transparent focus:border-[#A34F11]/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex-1 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
             <p className="text-gray-400 text-sm italic">Chart showing sales trends goes here</p>
          </div>
        </div>

        {/* 4. Top Selling Items */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Top Selling Items</h3>
          <div className="flex flex-col gap-5">
            <TopItem name="Chicken MoMo" sales="124" price="Rs. 150" image="🥟" />
            <TopItem name="Margherita Pizza" sales="82" price="Rs. 650" image="🍕" />
            <TopItem name="Double Patty Burger" sales="65" price="Rs. 350" image="🍔" />
            <TopItem name="Iced Americano" sales="48" price="Rs. 180" image="☕" />
          </div>
          <button className="mt-auto w-full py-3 text-sm font-bold text-[#A34F11] bg-[#FFEDE1] rounded-xl hover:bg-[#A34F11] hover:text-white transition-all">
            View All Menu
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Metric Card Sub-component
 */
const StatCard = ({ title, value, change, icon, isUp }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 rounded-2xl text-[#A34F11] border border-gray-100">
        {icon}
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
        {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {change}
      </div>
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{value}</h2>
  </div>
);

/**
 * Top Item Sub-component
 */
const TopItem = ({ name, sales, price, image }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100 group-hover:bg-[#FFEDE1] transition-colors">
        {image}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{name}</h4>
        <p className="text-[11px] text-gray-400 font-bold">{sales} sales this week</p>
      </div>
    </div>
    <span className="text-sm font-bold text-gray-600">{price}</span>
  </div>
);

export default DashboardSummary;