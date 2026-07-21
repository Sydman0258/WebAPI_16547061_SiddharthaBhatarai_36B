"use server";

import {
    addCard as apiAddCard,
    getPayments as fetchPayments,
    getPaymentById as fetchPaymentById,
    updatePayment as apiUpdatePayment,
    setDefaultPayment as apiSetDefaultPayment,
    deletePayment as apiDeletePayment,
    initiateEsewaPaymentApi, verifyEsewaPaymentApi
} from "@/lib/api/payment";

import { revalidatePath } from "next/cache";

export async function getPayments() {
    try {
        const result = await fetchPayments();

        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Payments fetched successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to fetch payments",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch payments",
        };
    }
}

export async function getPaymentById(id: string) {
    try {
        const result = await fetchPaymentById(id);

        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Payment fetched successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to fetch payment",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to fetch payment",
        };
    }
}

export async function handleAddCard(data: any) {
    try {
        const result = await apiAddCard(data);

        if (result.success) {
            revalidatePath("/payments");

            return {
                success: true,
                data: result.data,
                message: result.message || "Card added successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to add card",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to add card",
        };
    }
}

export async function handleUpdatePayment(id: string, data: any) {
    try {
        const result = await apiUpdatePayment(id, data);

        if (result.success) {
            revalidatePath("/payments");

            return {
                success: true,
                data: result.data,
                message: result.message || "Payment updated successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to update payment",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to update payment",
        };
    }
}

export async function handleSetDefaultPayment(id: string) {
    try {
        const result = await apiSetDefaultPayment(id);

        if (result.success) {
            revalidatePath("/payments");

            return {
                success: true,
                data: result.data,
                message: result.message || "Default payment updated successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to set default payment",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to set default payment",
        };
    }
}

export async function handleDeletePayment(id: string) {
    try {
        const result = await apiDeletePayment(id);

        if (result.success) {
            revalidatePath("/payments");

            return {
                success: true,
                data: result.data,
                message: result.message || "Payment deleted successfully",
            };
        }

        return {
            success: false,
            message: result.message || "Failed to delete payment",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to delete payment",
        };
    }
}
export const initiateEsewaPayment = async (orderId: string, amount: number) => {
  try {
    const data = await initiateEsewaPaymentApi(orderId, amount);
    return { success: true, payload: data.payload };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to initiate payment",
    };
  }
};

export const verifyEsewaPayment = async (encodedData: string) => {
  try {
    const data = await verifyEsewaPaymentApi(encodedData);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Payment verification failed",
    };
  }
};