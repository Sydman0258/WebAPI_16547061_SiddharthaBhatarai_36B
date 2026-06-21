// review.service.ts
import { HttpException } from "../exceptions/http-exceptions";
import { ReviewMongoRepository } from "../repository/review.repository";
import { OrderMongoRepository } from "../repository/order.repository";
import { DriverMongoRepository } from "../repository/driver.repository";
import { createReviewDTO, updateReviewDTO } from "../dtos/review.dtos";
import mongoose from "mongoose";

const reviewRepository = new ReviewMongoRepository();
const orderRepository = new OrderMongoRepository();
const driverRepository = new DriverMongoRepository();

export class ReviewService {
    async createReview(customerId: string, data: createReviewDTO) {
        const order = await orderRepository.findById(data.orderId);
        if (!order) throw new HttpException(404, "Order not found");
        if (order.status !== "delivered") throw new HttpException(400, "Can only review a delivered order");
        if (order.customerId.toString() !== customerId) throw new HttpException(403, "You can only review your own orders");

        const existing = await reviewRepository.findByOrderId(data.orderId);
        if (existing) throw new HttpException(400, "You have already reviewed this order");

const review = await reviewRepository.create({
    orderId: new mongoose.Types.ObjectId(data.orderId),
    restaurantId: data.restaurantId ? new mongoose.Types.ObjectId(data.restaurantId) : undefined,
    driverId: data.driverId ? new mongoose.Types.ObjectId(data.driverId) : undefined,
    customerId: new mongoose.Types.ObjectId(customerId),
    rating: data.rating,
    comment: data.comment,
});
        if (data.driverId) {
            const avg = await reviewRepository.getAverageRating(data.driverId, "driverId");
            await driverRepository.update(data.driverId, { ratings: avg });
        }

        return review;
    }

    async getReviewById(id: string) {
        const review = await reviewRepository.findById(id);
        if (!review) throw new HttpException(404, "Review not found");
        return review;
    }

    async getReviewsByRestaurant(restaurantId: string) {
        return await reviewRepository.findByRestaurantId(restaurantId);
    }

    async getReviewsByDriver(driverId: string) {
        return await reviewRepository.findByDriverId(driverId);
    }

    async getReviewsByCustomer(customerId: string) {
        return await reviewRepository.findByCustomerId(customerId);
    }

    async updateReview(id: string, customerId: string, data: updateReviewDTO) {
        const review = await reviewRepository.findById(id);
        if (!review) throw new HttpException(404, "Review not found");
        if (review.customerId.toString() !== customerId) throw new HttpException(403, "You can only edit your own reviews");

        const updated = await reviewRepository.update(id, data);

        if (data.rating && review.driverId) {
            const avg = await reviewRepository.getAverageRating(review.driverId.toString(), "driverId");
            await driverRepository.update(review.driverId.toString(), { ratings: avg });
        }

        return updated;
    }

    async deleteReview(id: string, customerId: string) {
        const review = await reviewRepository.findById(id);
        if (!review) throw new HttpException(404, "Review not found");
        if (review.customerId.toString() !== customerId) throw new HttpException(403, "You can only delete your own reviews");
        return await reviewRepository.delete(id);
    }
}