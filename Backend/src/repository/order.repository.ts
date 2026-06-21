// order.repository.ts
import mongoose from "mongoose";
import Order, { IOrder } from "../models/order.model";

export interface IOrderRepository {
    create(data: Partial<IOrder>): Promise<IOrder>;
    findById(id: string): Promise<IOrder | null>;
    findByCustomerId(customerId: string): Promise<IOrder[]>;
    findByRestaurantId(restaurantId: string): Promise<IOrder[]>;
    findByDriverId(driverId: string): Promise<IOrder[]>;
    findByStatus(status: IOrder["status"]): Promise<IOrder[]>;
    updateStatus(id: string, status: IOrder["status"]): Promise<IOrder | null>;
    assignDriver(id: string, driverId: string): Promise<IOrder | null>;
    update(id: string, data: Partial<IOrder>): Promise<IOrder | null>;
    delete(id: string): Promise<boolean>;
}

export class OrderMongoRepository implements IOrderRepository {
    async create(data: Partial<IOrder>): Promise<IOrder> {
        return await Order.create(data);
    }

    async findById(id: string): Promise<IOrder | null> {
        return await Order.findById(id)
            .populate("customerId")
            .populate("restaurantId")
            .populate("driverId");
    }

    async findByCustomerId(customerId: string): Promise<IOrder[]> {
        return await Order.find({ customerId } as any)
            .populate("restaurantId")
            .populate("driverId")
            .sort({ placedAt: -1 });
    }

    async findByRestaurantId(restaurantId: string): Promise<IOrder[]> {
        return await Order.find({ restaurantId } as any)
            .populate("customerId")
            .populate("driverId")
            .sort({ placedAt: -1 });
    }

    async findByDriverId(driverId: string): Promise<IOrder[]> {
        return await Order.find({ driverId } as any)
            .populate("customerId")
            .populate("restaurantId")
            .sort({ placedAt: -1 });
    }

    async findByStatus(status: IOrder["status"]): Promise<IOrder[]> {
        return await Order.find({ status })
            .populate("customerId")
            .populate("restaurantId")
            .populate("driverId");
    }

    async updateStatus(id: string, status: IOrder["status"]): Promise<IOrder | null> {
        return await Order.findByIdAndUpdate(
            id, { $set: { status } }, { new: true, runValidators: true }
        );
    }

    async assignDriver(id: string, driverId: string): Promise<IOrder | null> {
        return await Order.findByIdAndUpdate(
            id,
            { $set: { driverId: new mongoose.Types.ObjectId(driverId) } },
            { new: true, runValidators: true }
        );
    }

    async update(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
        return await Order.findByIdAndUpdate(
            id, { $set: data }, { new: true, runValidators: true }
        );
    }

    async delete(id: string): Promise<boolean> {
        const result = await Order.findByIdAndDelete(id);
        return !!result;
    }
}