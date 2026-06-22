import { z } from "zod";

export const MenuItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    price: z.number().positive("Price must be positive"),
    preparationTime: z.number().int().positive("Prep time must be positive"),
    imageUrl: z.any().optional(),
});

export type MenuItemFormType = z.infer<typeof MenuItemSchema>;