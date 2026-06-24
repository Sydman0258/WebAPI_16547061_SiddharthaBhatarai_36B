import { createMenu, getRestaurantMenu } from "@/lib/api/menu";
import { revalidatePath } from "next/cache";
export async function CreateMenu(id: string,data:FormData) {
     console.log("Restaurant ID:", id);

    try {
        const result = await createMenu(id,data);
        if (result.success) {
       
            return {
                success: true,
                data: result.data,
                message: result.message || "Menu created successfully",
            };
        }
        return { success: false, message: result.message || "Failed to create Menu" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create Menu" };
    }
}

export async function getMenuByRestaurant(
    restaurantId: string
) {
    try {
        const result = await getRestaurantMenu(restaurantId);

        return {
            success: true,  
            data: result.data,
            message: result.message,
        };
    } catch (error: any) {
        return {
            success: false,
            data: [],
            message:
                error.message || "Failed to fetch menu",
        };
    }
}