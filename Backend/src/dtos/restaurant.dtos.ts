import z from "zod";
import { RestaurantSchema } from "../types/restaurant.types";

export const createRestaurantDTO=RestaurantSchema.pick({
    restaurantName:true,
    description:true,
    location:true,
    status:true,
    openingHours:true,
    foodTypes:true,
}).extend({
  userId: z.string(),
});

export type createRestaurantDTO=z.infer<typeof createRestaurantDTO>;

export const updateRestaurantDTO = createRestaurantDTO.partial();
export type UpdateRestaurantDTO = z.infer<typeof updateRestaurantDTO>;
