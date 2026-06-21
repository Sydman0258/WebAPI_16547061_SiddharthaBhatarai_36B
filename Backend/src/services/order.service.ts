// order.service.ts
import mongoose from "mongoose";
import { HttpException } from "../exceptions/http-exceptions";
import { OrderMongoRepository } from "../repository/order.repository";
import { MenuItemMongoRepository } from "../repository/menu.repository";
import { DriverMongoRepository } from "../repository/driver.repository";
import { createOrderDTO, updateOrderDTO, updateOrderStatusDTO, assignDriverDTO } from "../dtos/order.dtos";

const orderRepository = new OrderMongoRepository();
const menuItemRepository = new MenuItemMongoRepository();
const driverRepository = new DriverMongoRepository();

const DELIVERY_FEE = 50;

const STATUS_TRANSITIONS: Record<string, string[]> = {
    pending:   ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready"],
    ready:     ["picked_up"],
    picked_up: ["delivered"],
    delivered: [],
    cancelled: [],
};

export class OrderService {
    async createOrder(customerId: string, data: createOrderDTO) {
        const resolvedItems = await Promise.all(
            data.items.map(async (item) => {
                const menuItem = await menuItemRepository.findById(item.menuItemId);
                if (!menuItem) throw new HttpException(404, `Menu item ${item.menuItemId} not found`);
                if (!menuItem.isAvailable) throw new HttpException(400, `"${menuItem.name}" is not available`);
                return {
                    menuItemId: menuItem._id,
                    name: menuItem.name,
                    unitPrice: menuItem.price,
                    quantity: item.quantity,
                };
            })
        );

        const subtotal = resolvedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        return await orderRepository.create({
            customerId: new mongoose.Types.ObjectId(customerId),
            restaurantId: new mongoose.Types.ObjectId(data.restaurantId),
            items: resolvedItems as any,
            deliveryAddress: data.deliveryAddress,
            notes: data.notes,
            subtotal,
            deliveryFee: DELIVERY_FEE,
            total: subtotal + DELIVERY_FEE,
            status: "pending",
            placedAt: new Date(),
        });
    }

    async getOrderById(id: string) {
        const order = await orderRepository.findById(id);
        if (!order) throw new HttpException(404, "Order not found");
        return order;
    }

    async getOrdersByCustomer(customerId: string) {
        return await orderRepository.findByCustomerId(customerId);
    }

    async getOrdersByRestaurant(restaurantId: string) {
        return await orderRepository.findByRestaurantId(restaurantId);
    }

    async getOrdersByDriver(driverId: string) {
        return await orderRepository.findByDriverId(driverId);
    }

    async updateOrderStatus(id: string, data: updateOrderStatusDTO) {
        const order = await orderRepository.findById(id);
        if (!order) throw new HttpException(404, "Order not found");

        if (!STATUS_TRANSITIONS[order.status].includes(data.status)) {
            throw new HttpException(400, `Cannot transition from "${order.status}" to "${data.status}"`);
        }
        return await orderRepository.updateStatus(id, data.status);
    }

    async assignDriver(id: string, data: assignDriverDTO) {
        const order = await orderRepository.findById(id);
        if (!order) throw new HttpException(404, "Order not found");
        if (order.status !== "ready") throw new HttpException(400, "Driver can only be assigned when order is ready");

        const driver = await driverRepository.findById(data.driverId);
        if (!driver) throw new HttpException(404, "Driver not found");
        if (!driver.isAvailable) throw new HttpException(400, "Driver is not available");

        const updated = await orderRepository.assignDriver(id, data.driverId);
        await driverRepository.update(data.driverId, { isAvailable: false });
        return updated;
    }

    async updateOrder(id: string, data: updateOrderDTO) {
        const order = await orderRepository.findById(id);
        if (!order) throw new HttpException(404, "Order not found");
        if (order.status !== "pending") throw new HttpException(400, "Order can only be updated while pending");
        return await orderRepository.update(id, data);
    }

    async cancelOrder(id: string) {
        const order = await orderRepository.findById(id);
        if (!order) throw new HttpException(404, "Order not found");
        if (["delivered", "cancelled"].includes(order.status)) {
            throw new HttpException(400, `Order is already ${order.status}`);
        }
        return await orderRepository.updateStatus(id, "cancelled");
    }
}