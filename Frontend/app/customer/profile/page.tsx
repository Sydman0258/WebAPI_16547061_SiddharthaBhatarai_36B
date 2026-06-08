'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../_components/Navbar';

export default function ProfilePage() {
  const router = useRouter();

  // User details state variables
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+977 9841234567',
  });

  // Saved addresses state array
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home 🏠', details: '123 Gourmet Way, Apartment 4B, Kathmandu' },
    { id: 2, type: 'Office 💼', details: 'Block C, Softwarica IT Park, Dillibazar' },
  ]);

  // Saved payment methods state array
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Digital Wallet 📱', name: 'eSewa Wallet', identifier: '9841***567', isDefault: true },
    { id: 2, type: 'Credit Card 💳', name: 'Nabil Bank Visa', identifier: '•••• •••• •••• 4321', isDefault: false },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  // Handle personal info saving
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Notification Alert */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-xl text-center shadow-sm animate-fade-in">
            ✅ {message}
          </div>
        )}

        {/* Profile Card Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Side: Avatar Panel & App Stats */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm flex flex-col items-center">
              {/* Profile Pic Placeholder Accentuated with Red-to-Orange gradient border */}
              <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full p-1 shadow-md mb-4">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-xs text-orange-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-full mt-1.5">
                Foodie Level 4
              </p>
            </div>

            {/* Quick Metrics Tracking */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm grid grid-cols-2 gap-2 text-center">
              <div className="border-r border-gray-50 py-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Orders</p>
                <p className="text-xl font-black text-gray-800 mt-0.5">26</p>
              </div>
              <div className="py-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Saved Places</p>
                <p className="text-xl font-black text-gray-800 mt-0.5">{addresses.length}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Inputs, Addresses & Payments */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Account Details Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors focus:outline-none"
                >
                  {isEditing ? 'Cancel' : 'Edit Information'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50/70 border border-gray-200 disabled:opacity-70 disabled:bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50/70 border border-gray-200 disabled:opacity-70 disabled:bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full bg-gray-100 border border-gray-200 opacity-60 rounded-xl p-3 text-sm cursor-not-allowed"
                  />
                  <p className="text-2xs text-gray-400 mt-1.5">Email updates require security authentication verification keys.</p>
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 shadow-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Food Drop-off Addresses Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>
                <button 
                  onClick={() => alert('Address addition form trigger')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-xl transition-all"
                >
                  + Add New
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-orange-100 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{address.type}</h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{address.details}</p>
                    </div>
                    <button 
                      onClick={() => setAddresses(addresses.filter(a => a.id !== address.id))}
                      className="text-xs font-medium text-gray-400 hover:text-red-600 transition-colors pt-0.5"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW: Payment Methods Information Box */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Payment Info</h3>
                <button 
                  onClick={() => alert('Payment method addition trigger')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-xl transition-all"
                >
                  + Link Method
                </button>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id} 
                    className="border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-orange-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-800">{method.name}</h4>
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold bg-red-50 text-red-600 border border-red-100">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{method.type} &bull; {method.identifier}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPaymentMethods(paymentMethods.filter(p => p.id !== method.id))}
                      className="text-xs font-medium text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}