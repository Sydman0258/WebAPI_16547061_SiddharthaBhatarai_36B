"use server";

import {
    getMyRestaurant as fetchMyRestaurant,
    createRestaurant as apiCreateRestaurant,
    getAllRestaurants as fetchAllRestaurants,
    getRestaurantById as fetchRestaurantById,
    updateRestaurant as apiUpdateRestaurant,
    deleteRestaurant as apiDeleteRestaurant,
    getRestaurantOrders,
} from "@/lib/api/restaurant";
import { revalidatePath } from "next/cache";


export async function getMyRestaurant() {
    try {
        const result = await fetchMyRestaurant();
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurant fetched successfully",
            };
        }
        return { success: false, message: result.message || "Failed to fetch restaurant" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch restaurant" };
    }
}

export async function getAllRestaurants() {
    try {
        const result = await fetchAllRestaurants();
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurants fetched successfully",
            };
        }
        return { success: false, message: result.message || "Failed to fetch restaurants" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch restaurants" };
    }
}

export async function getRestaurantById(id: string) {
    try {
        const result = await fetchRestaurantById(id);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurant fetched successfully",
            };
        }
        return { success: false, message: result.message || "Failed to fetch restaurant" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch restaurant" };
    }
}

export async function handleCreateRestaurant(data: FormData) {
    try {
        const result = await apiCreateRestaurant(data);
        if (result.success) {
            revalidatePath("/restaurant");
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurant created successfully",
            };
        }
        return { success: false, message: result.message || "Failed to create restaurant" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create restaurant" };
    }
}

export async function handleUpdateRestaurant(id: string, data: FormData) {
    try {
        const result = await apiUpdateRestaurant(id, data);
        if (result.success) {
            revalidatePath("/restaurant/profile");
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurant updated successfully",
            };
        }
        return { success: false, message: result.message || "Failed to update restaurant" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update restaurant" };
    }
}

export async function handleDeleteRestaurant(id: string) {
    try {
        const result = await apiDeleteRestaurant(id);
        if (result.success) {
            revalidatePath("/restaurant");
            return {
                success: true,
                data: result.data,
                message: result.message || "Restaurant deleted successfully",
            };
        }
        return { success: false, message: result.message || "Failed to delete restaurant" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete restaurant" };
    }
}
export async function handleGetRestaurantOrders(restaurantId: string) {
    try {
        const result = await getRestaurantOrders(restaurantId);
        if (result.success) return { success: true, data: result.data };
        return { success: false, data: [], message: result.message };
    } catch (error: any) {
        return { success: false, data: [], message: error.message };
    }
}