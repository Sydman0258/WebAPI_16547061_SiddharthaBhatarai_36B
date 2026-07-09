"use client";

import { useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { handleAddCard } from "@/lib/actions/payment_actions";

const CardSchema = z.object({
  cardHolderName: z.string().min(2, "Card holder name is required"),
  cardBrand: z.string().min(1, "Select a card brand"),
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits"),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  cvv: z.string().min(3).max(4),
});

type CardForm = z.infer<typeof CardSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCardModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CardForm>({
    resolver: zodResolver(CardSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (!open) return null;

  const submit = async (data: CardForm) => {
    try {
      const payload = {
        cardHolderName: data.cardHolderName,
        cardBrand: data.cardBrand,
        cardNumber: data.cardNumber,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
      };

      const response = await handleAddCard(payload);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Card added successfully");

      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <CreditCard className="text-red-600" />
            <h2 className="text-xl font-bold">
              Add New Card
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="p-6 space-y-5"
        >
          <div>
            <label className="text-sm font-semibold">
              Card Holder Name
            </label>

            <input
              {...register("cardHolderName")}
              className="mt-2 w-full border rounded-xl px-4 py-3"
              placeholder="John Doe"
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.cardHolderName?.message}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Card Brand
            </label>

            <select
              {...register("cardBrand")}
              className="mt-2 w-full border rounded-xl px-4 py-3"
            >
              <option value="">Select Brand</option>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
            </select>

            <p className="text-red-500 text-xs mt-1">
              {errors.cardBrand?.message}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Card Number
            </label>

            <input
              {...register("cardNumber")}
              placeholder="1234567812345678"
              className="mt-2 w-full border rounded-xl px-4 py-3"
            />

            <p className="text-red-500 text-xs mt-1">
              {errors.cardNumber?.message}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">

            <div>
              <label className="text-sm font-semibold">
                Month
              </label>

              <input
                type="number"
                {...register("expiryMonth")}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.expiryMonth?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Year
              </label>

              <input
                type="number"
                {...register("expiryYear")}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.expiryYear?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold">
                CVV
              </label>

              <input
                type="password"
                {...register("cvv")}
                className="mt-2 w-full border rounded-xl px-4 py-3"
              />

              <p className="text-red-500 text-xs mt-1">
                {errors.cvv?.message}
              </p>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border"
            >
              Cancel
            </button>

            <button
              disabled={isSubmitting}
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Save Card"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}