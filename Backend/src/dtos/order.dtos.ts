import z from "zod";

const orderItemDTO = z.object({
    menuItemId: z.string().min(1),
    quantity: z.number().int().positive(),
});

export const createOrderDTO = z.object({
    restaurantId: z.string().min(1),
    items: z.array(orderItemDTO).min(1),
    deliveryAddress: z.string().min(1),
    notes: z.string().optional(),

    paymentMethod: z.enum([
        "cash",
        "card",
        "esewa",
    ]),
});
export type createOrderDTO = z.infer<typeof createOrderDTO>;

// only fields a customer can change before confirmed
export const updateOrderDTO = z.object({
    deliveryAddress: z.string().min(1).optional(),
    notes: z.string().optional(),
});

export type updateOrderDTO = z.infer<typeof updateOrderDTO>;

export const updateOrderStatusDTO = z.object({
    status: z.enum([
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "delivered",
        "cancelled",
    ]),
});

export type updateOrderStatusDTO = z.infer<typeof updateOrderStatusDTO>;

export const assignDriverDTO = z.object({
    driverId: z.string().min(1),
});

export type assignDriverDTO = z.infer<typeof assignDriverDTO>;