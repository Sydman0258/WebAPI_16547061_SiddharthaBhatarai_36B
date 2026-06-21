import z from "zod";

export const createMenuItemDTO = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().default(true),
    preparationTime: z.number().int().positive(),
});

export type createMenuItemDTO = z.infer<typeof createMenuItemDTO>;

export const updateMenuItemDTO = createMenuItemDTO.partial();
export type updateMenuItemDTO = z.infer<typeof updateMenuItemDTO>;