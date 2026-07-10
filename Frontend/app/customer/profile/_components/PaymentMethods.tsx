"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { toast } from "react-toastify";

import PaymentMethodCard from "./PaymentMethodCard";
import AddCardModal from "./AddCardModal";
import AddEsewaModal from "./AddEsewaModal";
import DeleteModal from "../../../_component/DeleteModel";

import {
  getPayments,
  handleDeletePayment,
  handleSetDefaultPayment,
} from "@/lib/actions/payment_actions";

export default function PaymentMethods() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCardModal, setShowCardModal] = useState(false);
  const [showEsewaModal, setShowEsewaModal] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadInFlightRef = useRef(false);

  const loadPayments = async () => {
    if (loadInFlightRef.current) {
      return;
    }

    loadInFlightRef.current = true;

    try {
      setLoading(true);

      const response = await getPayments();

      if (response.success) {
        setPayments(response.data || []);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      loadInFlightRef.current = false;
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const requestDeletePayment = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeletePayment = async () => {
    if (!deleteTargetId) return;

    const response = await handleDeletePayment(deleteTargetId);

    if (response.success) {
      toast.success(response.message);
      loadPayments();
    } else {
      toast.error(response.message);
    }

    setDeleteTargetId(null);
  };

  const setDefault = async (id: string) => {
    const response = await handleSetDefaultPayment(id);

    if (response.success) {
      toast.success(response.message);
      loadPayments();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <div className="mt-10 border-t border-gray-100 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Payment Methods
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your saved cards and eSewa accounts.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">
            Loading payment methods...
          </div>
        ) : payments.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <Wallet
              className="mx-auto text-gray-400 mb-3"
              size={40}
            />

            <p className="text-gray-600">
              No payment methods added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <PaymentMethodCard
                key={payment._id}
                payment={payment}
                onDelete={requestDeletePayment}
                onSetDefault={setDefault}
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setShowCardModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <CreditCard size={18} />
            Add Card
          </button>

          <button
            onClick={() => setShowEsewaModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
          >
            <Wallet size={18} />
            Add eSewa
          </button>
        </div>
      </div>

      <AddCardModal
        open={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSuccess={loadPayments}
      />

      <AddEsewaModal
        open={showEsewaModal}
        onClose={() => setShowEsewaModal(false)}
        onSuccess={loadPayments}
      />

      <DeleteModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeletePayment}
        title="Delete payment method?"
        description="This will permanently remove this payment method from your account. This action can't be undone."
      />
    </>
  );
}