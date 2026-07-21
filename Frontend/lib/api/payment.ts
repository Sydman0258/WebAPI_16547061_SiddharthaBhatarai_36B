import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

interface EsewaCheckoutPayload {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  esewa_payment_url: string;
}
export const addCard = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.PAYMENT.ADD_CARD, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to add card");
    }
};

export const getPayments = async () => {
    try {
        const response = await axiosInstance.get(API.PAYMENT.GET_ALL);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch payment methods");
    }
};

export const getPaymentById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.PAYMENT.GET_BY_ID(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch payment method");
    }
};

export const updatePayment = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(API.PAYMENT.UPDATE(id), data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update payment method");
    }
};

export const setDefaultPayment = async (id: string) => {
    try {
        const response = await axiosInstance.patch(API.PAYMENT.SET_DEFAULT(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to set default payment method");
    }
};

export const deletePayment = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.PAYMENT.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete payment method");
    }
};
export const initiateEsewaPaymentApi = async (orderId: string, amount: number) => {
  const response = await axiosInstance.post<{ payload: EsewaCheckoutPayload }>(
    API.PAYMENT.INITIATE_ESEWA,
    { orderId, amount }
  );
  return response.data;
};

export const verifyEsewaPaymentApi = async (encodedData: string) => {
  const response = await axiosInstance.post(API.PAYMENT.VERIFY_ESEWA, {
    data: encodedData,
  });
  return response.data;
};