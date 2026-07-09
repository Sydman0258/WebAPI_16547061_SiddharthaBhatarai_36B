"use client";

import { useEffect } from "react";
import { X, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { handleAddEsewa } from "@/lib/actions/payment_actions";

const EsewaSchema = z.object({
  accountName: z.string().min(2, "Account name is required"),
  mobileNumber: z
    .string()
    .regex(/^9\d{9}$/, "Enter a valid 10-digit eSewa mobile number"),
});

type EsewaForm = z.infer<typeof EsewaSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEsewaModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EsewaForm>({
    resolver: zodResolver(EsewaSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (!open) return null;

  const submit = async (data: EsewaForm) => {
    try {
      const response = await handleAddEsewa({
        accountName: data.accountName,
        mobileNumber: data.mobileNumber,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("eSewa account added successfully");

      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <Smartphone className="text-green-600" />

            <h2 className="text-xl font-bold">
              Add eSewa Account
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
            <label className="block text-sm font-semibold">
              Account Name
            </label>

            <input
              {...register("accountName")}
              placeholder="John Doe"
              className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            {errors.accountName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.accountName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Mobile Number
            </label>

            <input
              {...register("mobileNumber")}
              placeholder="98XXXXXXXX"
              maxLength={10}
              className="mt-2 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
            />

            {errors.mobileNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Account"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}