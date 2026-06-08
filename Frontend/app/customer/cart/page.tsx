'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../_components/Navbar';

// Initial food items mock state inside a cart
const initialCartItems = [
  { id: 'item-1', name: 'Spicy Tuna Crunch Roll', price: 14.99, quantity: 2, customNotes: 'Extra ginger, no wasabi', image: '🍣' },
  { id: 'item-2', name: 'Tonkotsu Ramen Special', price: 16.50, quantity: 1, customNotes: 'Add soft boiled egg', image: '🍜' },
  { id: 'item-3', name: 'Pork Gyoza (6pc)', price: 7.25, quantity: 1, customNotes: '', image: '🥟' },
];

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(initialCartItems);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Operational state functions
  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculations
  const deliveryFee = 2.50;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.13; // 13% standard tax rate
  const grandTotal = subtotal + tax + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order Placed Successfully! Heading over to track delivery status.');
    router.push('/customer/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page title */}
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Your Basket 🛒
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review your meal details and checkout seamlessly.</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <span className="text-5xl block mb-4">🛒</span>
            <h2 className="text-xl font-bold text-gray-800">Your cart is currently empty</h2>
            <p className="text-sm text-gray-400 mt-2 mb-6">Looks like you haven't added any dishes yet.</p>
            <button 
              onClick={() => router.push('/customer/restaurants')}
              className="px-6 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Columns: Cart list & Options */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Item List Container */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Items From Sushi Zen</h2>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      {/* Avatar item */}
                      <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                        {item.image}
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                        {item.customNotes && (
                          <p className="text-xs text-orange-600 mt-0.5 italic font-medium">✏️ {item.customNotes}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/60 px-3 py-1.5 rounded-xl">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-500 hover:text-red-600 font-bold px-1 transition-colors text-sm"
                        >
                          —
                        </button>
                        <span className="text-sm font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-500 hover:text-orange-500 font-bold px-1 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Pricing totals */}
                      <div className="text-right pl-2">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery and Preferences Configurations */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-base font-bold text-gray-900">Preferences</h2>
                
                {/* Note Field */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Drop off at gate, ring doorbell twice, leave with security..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                {/* Dropdown method select */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option>Cash on Delivery</option>
                    <option>Digital Wallet (eSewa / Khalti)</option>
                    <option>Credit / Debit Card</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary and Submission */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>
              
              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT / Service Tax (13%)</span>
                  <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row summary section */}
              <div className="flex justify-between items-baseline pt-4 mb-6">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-red-600">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Promo validation banner indicator */}
              <div className="bg-orange-50/40 border border-dashed border-orange-200 rounded-xl p-3 text-center text-xs font-medium text-orange-800 mb-6">
                🎉 Awesome! You qualify for a free dessert reward voucher on your next checkout!
              </div>

              {/* Main execution checkout system trigger */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl text-center shadow-md hover:bg-red-700 active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                Place Order (${grandTotal.toFixed(2)})
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}