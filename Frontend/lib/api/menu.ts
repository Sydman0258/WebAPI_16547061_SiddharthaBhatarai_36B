import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

export const createMenu = async (id:string,data:any) => {
    try {
        const response = await axiosInstance.post(API.MENU.CREATE(id),data);
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) return { success: false, data: null };
        throw new Error(error?.response?.data?.message || 'Failed to create  menu');
    }
}

export const getRestaurantMenu = async (restaurantId: string) => {
    try {
        const response = await axiosInstance.get(
            API.MENU.GET_BY_RESTAURANT(restaurantId)
        );

        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return {
                success: false,
                data: [],
                message: "Menu not found",
            };
        }

        throw new Error(
            error?.response?.data?.message ||
            "Failed to fetch menu"
        );
    }
};