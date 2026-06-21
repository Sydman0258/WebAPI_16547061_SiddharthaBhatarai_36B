import z from "zod";

export const MenuItemSchema = z.object({
  restaurantId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),          
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number(),   
});

export type MenuItemType=z.infer<typeof MenuItemSchema>;