"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/Navbar";
import { useCart } from "@/lib/context/CartContext";
import { handleCreateOrder } from "@/lib/actions/order_actions";
import { getPayments, initiateEsewaPayment } from "@/lib/actions/payment_actions";
import { postToEsewa } from "@/utils/esewa";
import { toast } from "react-toastify";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, clearCart } = useCart();

  const [deliveryNote, setDeliveryNote] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await getPayments();

        if (response?.success) {
          setPayments(response.data || []);

          const defaultPayment = response.data.find(
            (payment: any) => payment.isDefault
          );

          if (defaultPayment) {
            setSelectedPayment(defaultPayment._id);
          }
        }
      } catch (error) {
        console.error("Failed to load saved payment methods:", error);
      }
    }

    loadPayments();
  }, []);

  const deliveryFee = 2.5;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const grandTotal = subtotal + tax + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const restaurantId = cart[0]
      ? (cart[0] as any).restaurantId ||
        (cart[0] as any).restaurant?._id ||
        (cart[0] as any).restaurant_id
      : undefined;

    const restaurantIds = new Set(
      cart
        .map(
          (item) =>
            (item as any).restaurantId ||
            (item as any).restaurant?._id ||
            (item as any).restaurant_id
        )
        .filter(Boolean)
    );

    if (!restaurantId) {
      toast.error("Could not determine restaurant. Please clear your cart and try again.");
      return;
    }

    if (restaurantIds.size > 1) {
      toast.error("Your cart contains items from multiple restaurants. Please place separate orders.");
      return;
    }

    setIsSubmitting(true);

    const savedPayment = payments.find((p) => p._id === selectedPayment);

    // Determine actual payment type string for backend payload
    let computedPaymentMethod = "cash";
    if (selectedPayment === "esewa") {
      computedPaymentMethod = "esewa";
    } else if (selectedPayment !== "cash") {
      if (!savedPayment) {
        toast.error("Please select a valid payment method before placing the order.");
        setIsSubmitting(false);
        return;
      }
      computedPaymentMethod = savedPayment.paymentType || "card";
    }

    const orderPayload = {
      restaurantId,
      items: cart.map((item) => ({
        menuItemId: item._id || (item as any).id || (item as any).menuItemId,
        quantity: item.quantity,
      })),
      deliveryAddress: deliveryNote.trim() || "No specific directions provided.",
      notes: deliveryNote.trim() ? deliveryNote : undefined,
      paymentMethod: computedPaymentMethod,
    };

    try {
      const response = await handleCreateOrder(orderPayload);

      if (!response.success) {
        toast.error(response.message || "Failed to create order.");
        setIsSubmitting(false);
        return;
      }

const createdOrderId = response.data?._id || (response as any).orderId;
      // Handle eSewa Flow
      if (selectedPayment === "esewa") {
        toast.info("Preparing eSewa payment...");
        const esewaResponse = await initiateEsewaPayment(createdOrderId, grandTotal);

        if (esewaResponse.success && esewaResponse.payload) {
          clearCart();
          postToEsewa(esewaResponse.payload);
          return;
        } else {
          toast.error(esewaResponse.message || "Could not initialize eSewa checkout.");
          setIsSubmitting(false);
          return;
        }
      }

      // Cash / Saved Card Flow
      toast.success(response.message || "Order Placed Successfully!");
      clearCart();
      router.push("/customer/orders");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Your Basket 
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review your meal details and checkout seamlessly.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <span className="text-5xl block mb-4"></span>
            <h2 className="text-xl font-bold text-gray-800">Your cart is currently empty</h2>
            <p className="text-sm text-gray-400 mt-2 mb-6">
              Looks like you haven't added any dishes yet.
            </p>
            <button
              onClick={() => router.push("/customer/restaurants")}
              className="px-6 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">
                  Items From Your Order
                </h2>

                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="py-4 first:pt-0 last:pb-0 flex items-start gap-4"
                    >
                      <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                        {item.image || "🍔"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.name}
                        </h3>
                        {item.customNotes && (
                          <p className="text-xs text-orange-600 mt-0.5 italic font-medium">
                            ✏️ {item.customNotes}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Rs. {item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/60 px-3 py-1.5 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="text-gray-500 hover:text-red-600 font-bold px-1 transition-colors text-sm"
                          disabled={isSubmitting}
                        >
                          —
                        </button>
                        <span className="text-sm font-bold text-gray-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="text-gray-500 hover:text-orange-500 font-bold px-1 transition-colors text-sm"
                          disabled={isSubmitting}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right pl-2">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences & Payment Selection */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-base font-bold text-gray-900">Preferences</h2>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Drop off at gate, ring doorbell twice, leave with security..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Payment Method
                  </label>

                  <div className="space-y-3">
                    {/* Cash Option */}
                    <label
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                        selectedPayment === "cash"
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">💵 Cash on Delivery</h4>
                        <p className="text-sm text-gray-500">Pay when your food arrives.</p>
                      </div>
                      <input
                        type="radio"
                        checked={selectedPayment === "cash"}
                        onChange={() => setSelectedPayment("cash")}
                        disabled={isSubmitting}
                        className="h-4 w-4 accent-red-600"
                      />
                    </label>

                    {/* eSewa Option */}
                    <label
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                        selectedPayment === "esewa"
                          ? "border-[#60bb46] bg-green-50/60"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#60bb46] text-white rounded-lg flex items-center justify-center font-black text-xs shadow-sm">
                          e
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">eSewa Mobile Wallet</h4>
                          <p className="text-sm text-gray-500">Fast digital payment via eSewa portal</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedPayment === "esewa"}
                        onChange={() => setSelectedPayment("esewa")}
                        disabled={isSubmitting}
                        className="h-4 w-4 accent-[#60bb46]"
                      />
                    </label>

                    {/* Saved Payment Cards / Wallets */}
                    {payments.map((payment: any) => (
                      <label
                        key={payment._id}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                          selectedPayment === payment._id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <div>
                          {payment.paymentType === "card" ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">💳</span>
                                <h4 className="font-semibold">{payment.card.cardBrand}</h4>
                                {payment.isDefault && (
                                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                •••• •••• •••• {payment.card.lastFourDigits}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xl">👛</span>
                                <h4 className="font-semibold">Wallet</h4>
                                {payment.isDefault && (
                                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Saved payment method</p>
                            </>
                          )}
                        </div>

                        <input
                          type="radio"
                          checked={selectedPayment === payment._id}
                          onChange={() => setSelectedPayment(payment._id)}
                          disabled={isSubmitting}
                          className="h-4 w-4 accent-red-600"
                        />
                      </label>
                    ))}

                    <button
                      type="button"
                      onClick={() => router.push("/customer/profile")}
                      className="w-full border border-dashed border-red-300 rounded-xl py-3 text-red-600 font-medium hover:bg-red-50 transition"
                    >
                      + Manage Payment Methods
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>

              <div className="space-y-3 text-sm text-gray-600 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT / Service Tax (13%)</span>
                  <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 mb-6">
                <span className="text-base font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-red-600">
                  Rs. {grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="bg-orange-50/40 border border-dashed border-orange-200 rounded-xl p-3 text-center text-xs font-medium text-orange-800 mb-6">
                🎉 Awesome! You qualify for a free dessert reward voucher on your next checkout!
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full py-3.5 font-bold rounded-xl text-center shadow-md transition-all focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed ${
                  selectedPayment === "esewa"
                    ? "bg-[#60bb46] hover:bg-[#52a43b] text-white focus:ring-4 focus:ring-green-200"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-4 focus:ring-red-200"
                }`}
              >
                {isSubmitting
                  ? "Processing Order..."
                  : selectedPayment === "esewa"
                  ? `Pay with eSewa (Rs. ${grandTotal.toFixed(2)})`
                  : `Place Order (Rs. ${grandTotal.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}