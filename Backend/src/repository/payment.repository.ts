// payment.repository.ts

import mongoose from "mongoose";
import Payment, { IPayment } from "../models/payment.models";

export interface IPaymentRepository {
    create(data: Partial<IPayment>): Promise<IPayment>;

    findById(id: string): Promise<IPayment | null>;

    findByUserId(userId: string): Promise<IPayment[]>;

    findDefault(userId: string): Promise<IPayment | null>;

    update(id: string, data: Partial<IPayment>): Promise<IPayment | null>;

    setDefault(id: string, userId: string): Promise<IPayment | null>;

    delete(id: string): Promise<boolean>;
}

export class PaymentMongoRepository implements IPaymentRepository {

    async create(data: Partial<IPayment>): Promise<IPayment> {
        return await Payment.create(data);
    }

    async findById(id: string): Promise<IPayment | null> {
        return await Payment.findById(id)
            .populate("userId");
    }

    async findByUserId(userId: string): Promise<IPayment[]> {
        return await Payment.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).sort({ createdAt: -1 });
    }

    async findDefault(userId: string): Promise<IPayment | null> {
        return await Payment.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            isDefault: true,
        });
    }

    async update(id: string, data: Partial<IPayment>): Promise<IPayment | null> {
        return await Payment.findByIdAndUpdate(
            id,
            { $set: data },
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async setDefault(id: string, userId: string): Promise<IPayment | null> {

        await Payment.updateMany(
            {
                userId: new mongoose.Types.ObjectId(userId),
            },
            {
                $set: {
                    isDefault: false,
                },
            }
        );

        return await Payment.findByIdAndUpdate(
            id,
            {
                $set: {
                    isDefault: true,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );
    }

    async delete(id: string): Promise<boolean> {
        const result = await Payment.findByIdAndDelete(id);
        return !!result;
    }
}