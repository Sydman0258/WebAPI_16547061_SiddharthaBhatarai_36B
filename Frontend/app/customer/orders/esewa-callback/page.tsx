"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEsewaPayment } from "@/lib/actions/payment_actions";

function EsewaCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<
    "loading" | "success" | "failed"
  >("loading");

  const verifiedRef = useRef(false);

  useEffect(() => {
    if (verifiedRef.current) return;

    const encodedData = searchParams.get("data");
    const failureStatus = searchParams.get("status");

    if (failureStatus === "failed" || !encodedData) {
      setStatus("failed");
      return;
    }

    verifiedRef.current = true;

    verifyEsewaPayment(encodedData)
      .then((res) => {
        if (res.success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/customer/orders");
          }, 2000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => {
        setStatus("failed");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md text-center">
        {status === "loading" && (
          <div className="space-y-2">
            <p className="text-gray-600 font-medium animate-pulse">
              Verifying payment with eSewa...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600 font-semibold space-y-2">
            <p className="text-xl">Payment Successful!</p>
            <p className="text-sm text-gray-500">
              Redirecting to your orders...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="text-red-600 font-semibold space-y-4">
            <p className="text-xl">Payment Failed or Cancelled</p>
            <p className="text-sm text-gray-500 font-normal">
              We couldn't process your payment. If any amount was deducted, it
              will be refunded automatically.
            </p>

            <button
              onClick={() => router.push("/customer/cart")}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md text-sm transition-colors"
            >
              Return to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EsewaCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Verifying payment...
        </div>
      }
    >
      <EsewaCallbackContent />
    </Suspense>
  );
}