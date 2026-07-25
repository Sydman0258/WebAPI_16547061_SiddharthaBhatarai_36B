import axiosInstance from "../api/axiosinstance";
import { API } from "../api/endpoint";


export const createMenu = async (restaurantId: string, data: any) => {
    try {
        const response = await axiosInstance.post(API.MENU.CREATE(restaurantId), data);
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null };
        throw new Error(error?.response?.data?.message || "Failed to create menu");
    }
};


export const getRestaurantMenu = async (restaurantId: string) => {
    try {
        const response = await axiosInstance.get(API.MENU.GET_BY_RESTAURANT(restaurantId));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: [], message: "Menu not found" };
        throw new Error(error?.response?.data?.message || "Failed to fetch menu");
    }
};

export const getAvailableMenu = async (restaurantId: string) => {
    try {
        const response = await axiosInstance.get(API.MENU.GET_AVAILABLE(restaurantId));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: [], message: "No available items found" };
        throw new Error(error?.response?.data?.message || "Failed to fetch available menu");
    }
};

export const getMenuByCategory = async (restaurantId: string, category: string) => {
    try {
        const response = await axiosInstance.get(API.MENU.GET_BY_CATEGORY(restaurantId, category));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: [], message: "Category not found" };
        throw new Error(error?.response?.data?.message || "Failed to fetch menu by category");
    }
};

export const getMenuById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.MENU.GET_BY_ID(id));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null, message: "Menu item not found" };
        throw new Error(error?.response?.data?.message || "Failed to fetch menu item");
    }
};


export const updateMenu = async (id: string,    restaurantId: string,
 data: any) => {
    try {
        const response = await axiosInstance.put(API.MENU.UPDATE(id), data);
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null, message: "Menu item not found" };
        throw new Error(error?.response?.data?.message || "Failed to update menu item");
    }
};

export const toggleMenuAvailability = async (id: string) => {
    try {
        const response = await axiosInstance.patch(API.MENU.TOGGLE(id));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null, message: "Menu item not found" };
        throw new Error(error?.response?.data?.message || "Failed to toggle menu availability");
    }
};


export const deleteMenu = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.MENU.DELETE(id));
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null, message: "Menu item not found" };
        throw new Error(error?.response?.data?.message || "Failed to delete menu item");
    }
};