import z from "zod";
import { createOrderDTO, updateOrderDTO, updateOrderStatusDTO, assignDriverDTO } from "../dtos/order.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { OrderService } from "../services/order.service";
import { ApiResponseHelper } from "../utils/api-response";
import { Response, Request } from "express";

const orderService = new OrderService();

export class OrderController {

    async createOrder(req: Request, res: Response) {
        try {
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            const parseResult = createOrderDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const order = await orderService.createOrder(customerId, parseResult.data);
            return ApiResponseHelper.success(res, order, true, 201, "Order placed successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to create order", err?.status || 500);
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const order = await orderService.getOrderById(id);
            return ApiResponseHelper.success(res, order, true, 200, "Order retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get order", err?.status || 500);
        }
    }

    async getMyOrders(req: Request, res: Response) {
        try {
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            const orders = await orderService.getOrdersByCustomer(customerId);
            return ApiResponseHelper.success(res, orders, true, 200, "Orders retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get orders", err?.status || 500);
        }
    }

    async getOrdersByRestaurant(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params as { restaurantId: string };
            const orders = await orderService.getOrdersByRestaurant(restaurantId);
            return ApiResponseHelper.success(res, orders, true, 200, "Restaurant orders retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get restaurant orders", err?.status || 500);
        }
    }

    async getOrdersByDriver(req: Request, res: Response) {
        try {
            const { driverId } = req.params as { driverId: string };
            const orders = await orderService.getOrdersByDriver(driverId);
            return ApiResponseHelper.success(res, orders, true, 200, "Driver orders retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get driver orders", err?.status || 500);
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const parseResult = updateOrderStatusDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const updated = await orderService.updateOrderStatus(id, parseResult.data);
            return ApiResponseHelper.success(res, updated, true, 200, "Order status updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to update order status", err?.status || 500);
        }
    }

    async assignDriver(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const parseResult = assignDriverDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const updated = await orderService.assignDriver(id, parseResult.data);
            return ApiResponseHelper.success(res, updated, true, 200, "Driver assigned successfully");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to assign driver", err?.status || 500);
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const parseResult = updateOrderDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const updated = await orderService.updateOrder(id, parseResult.data);
            return ApiResponseHelper.success(res, updated, true, 200, "Order updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to update order", err?.status || 500);
        }
    }

    async cancelOrder(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const cancelled = await orderService.cancelOrder(id);
            return ApiResponseHelper.success(res, cancelled, true, 200, "Order cancelled");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to cancel order", err?.status || 500);
        }
    }
async getAvailableOrders(req: Request, res: Response) {
    try {
        const orders = await orderService.getAvailableOrders();
        return ApiResponseHelper.success(res, orders, true, 200, "Available orders retrieved");
    } catch (err: any) {
        return ApiResponseHelper.error(res, err?.message || "Failed to get available orders", err?.status || 500);
    }
}
}