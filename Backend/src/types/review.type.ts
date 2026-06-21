import z from "zod";

export const ReviewSchema = z.object({
  orderId: z.string(),
  customerId: z.string(),
  restaurantId: z.string().optional(),
  driverId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type ReviewType=z.infer<typeof ReviewSchema>;