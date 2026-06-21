import z from "zod";

export const OrderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),            
  quantity: z.number().int().positive(),
  unitPrice: z.number(),         
});

export type OrderItemType=z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  customerId: z.string(),
  restaurantId: z.string(),
  driverId: z.string().optional(), 
  items: z.array(OrderItemSchema),
  status: z.enum([
    "pending",       
    "confirmed",    
    "preparing",     
    "ready",        
    "picked_up",     
    "delivered",
    "cancelled",
  ]),
  deliveryAddress: z.string(),
  subtotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  notes: z.string().optional(),   
  placedAt: z.string(),
  estimatedDelivery: z.string().optional(),
});
export type OrderType=z.infer<typeof OrderSchema>;
