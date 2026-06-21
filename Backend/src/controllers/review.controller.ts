import z from "zod";
import { createReviewDTO, updateReviewDTO } from "../dtos/review.dtos";
import { HttpException } from "../exceptions/http-exceptions";
import { ReviewService } from "../services/review.service";
import { ApiResponseHelper } from "../utils/api-response";
import { Response, Request } from "express";

const reviewService = new ReviewService();

export class ReviewController {

    async createReview(req: Request, res: Response) {
        try {
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            const parseResult = createReviewDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const review = await reviewService.createReview(customerId, parseResult.data);
            return ApiResponseHelper.success(res, review, true, 201, "Review created");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to create review", err?.status || 500);
        }
    }

    async getReviewById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const review = await reviewService.getReviewById(id);
            return ApiResponseHelper.success(res, review, true, 200, "Review retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get review", err?.status || 500);
        }
    }

    async getReviewsByRestaurant(req: Request, res: Response) {
        try {
            const { restaurantId } = req.params as { restaurantId: string };
            const reviews = await reviewService.getReviewsByRestaurant(restaurantId);
            return ApiResponseHelper.success(res, reviews, true, 200, "Restaurant reviews retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get reviews", err?.status || 500);
        }
    }

    async getReviewsByDriver(req: Request, res: Response) {
        try {
            const { driverId } = req.params as { driverId: string };
            const reviews = await reviewService.getReviewsByDriver(driverId);
            return ApiResponseHelper.success(res, reviews, true, 200, "Driver reviews retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get reviews", err?.status || 500);
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            const reviews = await reviewService.getReviewsByCustomer(customerId);
            return ApiResponseHelper.success(res, reviews, true, 200, "Your reviews retrieved");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to get reviews", err?.status || 500);
        }
    }

    async updateReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            const parseResult = updateReviewDTO.safeParse(req.body);
            if (!parseResult.success) {
                throw new HttpException(400, z.prettifyError(parseResult.error));
            }
            const updated = await reviewService.updateReview(id, customerId, parseResult.data);
            return ApiResponseHelper.success(res, updated, true, 200, "Review updated");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to update review", err?.status || 500);
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const customerId = req.user?._id;
            if (!customerId) throw new HttpException(401, "Unauthorized");

            await reviewService.deleteReview(id, customerId);
            return ApiResponseHelper.success(res, null, true, 200, "Review deleted");
        } catch (err: any) {
            return ApiResponseHelper.error(res, err?.message || "Failed to delete review", err?.status || 500);
        }
    }
}