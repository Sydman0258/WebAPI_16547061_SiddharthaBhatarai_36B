import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

export const getMyRestaurant = async () => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_MY);
        return response.data;
    } catch (error: any) {
        // 404 means no restaurant found, not a crash
        if (error?.response?.status === 404) return { success: false, data: null };
        throw new Error(error?.response?.data?.message || 'Failed to fetch restaurant');
    }
}

export const createRestaurant = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.RESTAURANT.CREATE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Failed to create restaurant'
        );
    }
}