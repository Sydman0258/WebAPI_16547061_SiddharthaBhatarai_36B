import{ z} from "zod";

export const RestaurantSchema=z.object({
userId:z.string(),
restaurantName:z.string(),
description:z.string(),
location:z.string(),
status:z.string(),
openingHours:z.string(),
restaurantImage:z.string(),
foodTypes:z.array(z.string()).default([]),
});

export type RestaurantType=z.infer<typeof RestaurantSchema>;