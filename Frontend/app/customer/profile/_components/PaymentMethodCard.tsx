"use client";

import { CreditCard, Smartphone, Star, Trash2 } from "lucide-react";

interface PaymentMethodCardProps {
  payment: any;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function PaymentMethodCard({
  payment,
  onDelete,
  onSetDefault,
}: PaymentMethodCardProps) {
  const isCard = payment.paymentType === "card";

  return (
    <div className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCard
                ? "bg-blue-50 text-blue-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {isCard ? (
              <CreditCard size={22} />
            ) : (
              <Smartphone size={22} />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {isCard
                ? payment.card.cardBrand
                : "eSewa"}
            </h3>

            {isCard ? (
              <>
                <p className="text-sm text-gray-500">
                  •••• •••• •••• {payment.card.lastFourDigits}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {payment.card.cardHolderName}
                </p>

                <p className="text-xs text-gray-400">
                  Expires {payment.card.expiryMonth}/
                  {payment.card.expiryYear}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  {payment.esewa.mobileNumber}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {payment.esewa.accountName}
                </p>
              </>
            )}
          </div>
        </div>

        {payment.isDefault && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
            <Star size={12} fill="currentColor" />
            Default
          </span>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        {!payment.isDefault && (
          <button
            onClick={() => onSetDefault(payment._id)}
            className="px-4 py-2 rounded-xl border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            Set Default
          </button>
        )}

        <button
          onClick={() => onDelete(payment._id)}
          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}