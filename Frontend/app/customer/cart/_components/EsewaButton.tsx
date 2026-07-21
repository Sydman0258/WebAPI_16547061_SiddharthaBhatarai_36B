// app/customer/cart/_components/EsewaButton.tsx
"use client";

import React, { useState } from "react";
import { initiateEsewaPayment } from "@/lib/actions/payment_actions";
import { postToEsewa } from "@/utils/esewa";

interface EsewaButtonProps {
  orderId: string;
  amount: number;
}

export const EsewaButton: React.FC<EsewaButtonProps> = ({ orderId, amount }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const result = await initiateEsewaPayment(orderId, amount);

    if (result.success && result.payload) {
      postToEsewa(result.payload);
    } else {
      alert(result.message || "Failed to start payment.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[#60bb46] hover:bg-[#52a43b] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "Redirecting to eSewa..." : "Pay with eSewa"}
    </button>
  );
};