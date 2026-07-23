import { createOrder, getMyOrder, getOrderById } from "../api/order";

export async function handleCreateOrder(orderdata: any) {
    try {

        const result = await createOrder(orderdata);
        if (result.success) {
            return {
                success: true,
                data: result.data,
                message: result.message || "Order Created successfully",
            };
        }
        return { success: false, message: result.message || "Failed to create order" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create order" };

    }
}
export async function handleGetMyOrders() {
    try {
        const result = await getMyOrder();
        
        if (result.success) {
            return {
                success: true,
                data: result.data, 
                message: result.message || "Orders fetched successfully",
            };
        }
        return { success: false, data: [], message: result.message || "Failed to fetch orders" };
    } catch (error: any) {
        return { success: false, data: [], message: error.message || "Failed to fetch orders" };
    }
}

export async function handleGetOrderById(id: string) {
    try {
        const result = await getOrderById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, data: null, message: result.message || "Failed to fetch order" };
    } catch (error: any) {
        return { success: false, data: null, message: error.message || "Failed to fetch order" };
    }
}