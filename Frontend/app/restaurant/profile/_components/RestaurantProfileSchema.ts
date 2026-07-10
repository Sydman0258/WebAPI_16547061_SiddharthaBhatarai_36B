import { z } from "zod";

export const RestaurantProfileSchema = z.object({
    restaurantName: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    openingHours: z.string().min(1, "Opening hours required"),
    status: z.boolean( "Status is required"),
    restaurantImage: z.instanceof(File).optional(),
});

export type RestaurantProfileFormType = z.infer<typeof RestaurantProfileSchema>;