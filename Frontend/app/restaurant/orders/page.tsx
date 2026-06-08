"use client";



import React, { useState } from 'react';

import { Clock, ChevronRight, MoreVertical } from 'lucide-react';





interface Order {

  id: string;

  items: string;

  time: string;

  status: 'received' | 'preparing' | 'completed';

  customer: string;

}



const KitchenKanban = () => {

  /**

   * 2. Initialize state with the Order type

   */

  const [orders, setOrders] = useState<Order[]>([

    { id: '#1204', items: '2x Chicken Burger, 1x Coke', time: '5 mins ago', status: 'received', customer: 'Siddhartha B.' },

    { id: '#1205', items: '1x Margherita Pizza', time: '2 mins ago', status: 'received', customer: 'Anish M.' },

    { id: '#1202', items: '3x Veg MoMo', time: '12 mins ago', status: 'preparing', customer: 'Kiran K.' },

    { id: '#1198', items: '1x Paneer Butter Masala', time: '45 mins ago', status: 'completed', customer: 'Sujan P.' },

  ]);



  const columns: { title: string; id: Order['status']; color: string }[] = [

    { title: 'Order Received', id: 'received', color: 'bg-blue-500' },

    { title: 'Preparing', id: 'preparing', color: 'bg-orange-500' },

    { title: 'Completed', id: 'completed', color: 'bg-green-500' },

  ];



  return (

    <div className="h-full flex flex-col gap-6">

      {/* Dashboard Header Section */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Live Kitchen Queue</h1>

          <p className="text-gray-500 text-sm">Manage and track outgoing orders in real-time.</p>

        </div>

        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">

          Active Orders: <span className="font-bold text-[#A34F11]">{orders.filter(o => o.status !== 'completed').length}</span>

        </div>

      </div>



      {/* Kanban Board Grid */}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">

        {columns.map((column) => (

          <div

            key={column.id}

            className="flex flex-col bg-gray-100/40 rounded-3xl p-4 border border-gray-200/50"

          >

            {/* Column Header */}

            <div className="flex items-center justify-between mb-5 px-2">

              <div className="flex items-center gap-2">

                <div className={`w-2.5 h-2.5 rounded-full ${column.color} shadow-sm`} />

                <h3 className="font-bold text-gray-600 uppercase text-xs tracking-widest">

                  {column.title}

                </h3>

              </div>

              <span className="bg-white px-2.5 py-1 rounded-lg text-xs font-bold text-gray-400 border border-gray-100 shadow-sm">

                {orders.filter(o => o.status === column.id).length}

              </span>

            </div>



            {/* Column Content Area */}

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

              {orders

                .filter((order) => order.status === column.id)

                .map((order) => (

                  <OrderCard key={order.id} order={order} />

                ))}

             

              {/* Empty State */}

              {orders.filter(o => o.status === column.id).length === 0 && (

                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">

                  <p className="text-xs text-gray-400 font-medium italic">No orders in this stage</p>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};



/**

 * 3. Sub-component for individual cards with Typescript Props

 */

const OrderCard = ({ order }: { order: Order }) => (

  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#A34F11]/20 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2">

    <div className="flex justify-between items-start mb-3">

      <div>

        <span className="text-[10px] font-bold text-[#A34F11] uppercase tracking-wider bg-[#FFEDE1] px-2 py-0.5 rounded-md">

          {order.id}

        </span>

        <h4 className="text-sm font-bold text-gray-800 mt-1">{order.customer}</h4>

      </div>

      <button className="text-gray-300 hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-50">

        <MoreVertical size={18} />

      </button>

    </div>

   

    <p className="text-sm text-gray-600 mb-4 font-medium leading-relaxed">

      {order.items}

    </p>

   

    <div className="flex items-center justify-between pt-4 border-t border-gray-50">

      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-tight">

        <Clock size={14} className="text-gray-300" />

        {order.time}

      </div>

      <div className="flex items-center gap-1 text-[11px] font-bold text-[#A34F11] group-hover:translate-x-1 transition-transform">

        VIEW DETAILS

        <ChevronRight size={14} />

      </div>

    </div>

  </div>

);

export default KitchenKanban;