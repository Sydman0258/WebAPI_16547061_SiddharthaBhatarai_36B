// review.repository.ts
import mongoose from "mongoose";
import Review, { IReview } from "../models/review.model";

export interface IReviewRepository {
    create(data: Partial<IReview>): Promise<IReview>;
    findById(id: string): Promise<IReview | null>;
    findByOrderId(orderId: string): Promise<IReview | null>;
    findByCustomerId(customerId: string): Promise<IReview[]>;
    findByRestaurantId(restaurantId: string): Promise<IReview[]>;
    findByDriverId(driverId: string): Promise<IReview[]>;
    getAverageRating(targetId: string, field: "restaurantId" | "driverId"): Promise<number>;
    update(id: string, data: Partial<IReview>): Promise<IReview | null>;
    delete(id: string): Promise<boolean>;
}

export class ReviewMongoRepository implements IReviewRepository {
    async create(data: Partial<IReview>): Promise<IReview> {
        return await Review.create(data);
    }
    async findById(id: string): Promise<IReview | null> {
        return await Review.findById(id).populate("customerId");
    }
    async findByOrderId(orderId: string): Promise<IReview | null> {
        return await Review.findOne({
            orderId: new mongoose.Types.ObjectId(orderId)
        });
    }
    async findByCustomerId(customerId: string): Promise<IReview[]> {
        return await Review.find({
            customerId: new mongoose.Types.ObjectId(customerId)
        }).sort({ createdAt: -1 });
    }
    async findByRestaurantId(restaurantId: string): Promise<IReview[]> {
        return await Review.find({
            restaurantId: new mongoose.Types.ObjectId(restaurantId)
        }).populate("customerId").sort({ createdAt: -1 });
    }
    async findByDriverId(driverId: string): Promise<IReview[]> {
        return await Review.find({
            driverId: new mongoose.Types.ObjectId(driverId)
        }).populate("customerId").sort({ createdAt: -1 });
    }
    async getAverageRating(targetId: string, field: "restaurantId" | "driverId"): Promise<number> {
        const result = await Review.aggregate([
            { $match: { [field]: new mongoose.Types.ObjectId(targetId) } },
            { $group: { _id: null, avg: { $avg: "$rating" } } }
        ]);
        return result[0]?.avg ?? 0;
    }
    async update(id: string, data: Partial<IReview>): Promise<IReview | null> {
        return await Review.findByIdAndUpdate(
            id, { $set: data }, { new: true, runValidators: true }
        );
    }
    async delete(id: string): Promise<boolean> {
        const result = await Review.findByIdAndDelete(id);
        return !!result;
    }
}