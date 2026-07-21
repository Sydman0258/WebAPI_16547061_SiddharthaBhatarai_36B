import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

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