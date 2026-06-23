import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

export const getMyRestaurant = async () => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_MY);
        return response.data;
    } catch (error: any) {
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

export const getAllRestaurants = async () => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_ALL);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Failed to fetch restaurants'
        );
    }
}

export const getRestaurantById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.RESTAURANT.GET_BY_ID(id));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null };
        throw new Error(
            error?.response?.data?.message || 'Failed to fetch restaurant'
        );
    }
}

export const updateRestaurant = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(API.RESTAURANT.UPDATE(id), data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Failed to update restaurant'
        );
    }
}

export const deleteRestaurant = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.RESTAURANT.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Failed to delete restaurant'
        );
    }
}