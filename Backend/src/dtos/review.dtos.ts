import z from "zod";

export const createReviewDTO = z.object({
    orderId: z.string().min(1),
    restaurantId: z.string().optional(),
    driverId: z.string().optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
}).refine(
    (data) => data.restaurantId || data.driverId,
    { message: "Review must target either a restaurant or a driver" }
);

export type createReviewDTO = z.infer<typeof createReviewDTO>;

export const updateReviewDTO = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(500).optional(),
});

export type updateReviewDTO = z.infer<typeof updateReviewDTO>;