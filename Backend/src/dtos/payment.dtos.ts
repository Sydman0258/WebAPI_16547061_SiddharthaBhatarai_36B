import z from "zod";

export const createCardDTO = z.object({
    cardHolderName: z.string().min(1),
    cardBrand: z.string().min(1),
    cardNumber: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    isDefault: z.boolean().optional(),
});
    
export type createCardDTO = z.infer<typeof createCardDTO>;

export const createEsewaDTO = z.object({
    accountName: z.string().min(1),
    mobileNumber: z.string().min(10).max(10),
    isDefault: z.boolean().optional(),
});

export type createEsewaDTO = z.infer<typeof createEsewaDTO>;

export const updatePaymentDTO = z.object({
    cardHolderName: z.string().min(1).optional(),
    cardBrand: z.string().min(1).optional(),
    cardNumber: z.string(),
   expiryMonth: z.string(),
    expiryYear: z.string(),

    accountName: z.string().min(1).optional(),
    mobileNumber: z.string().min(10).max(10).optional(),

    isDefault: z.boolean().optional(),
});

export type updatePaymentDTO = z.infer<typeof updatePaymentDTO>;

export const setDefaultPaymentDTO = z.object({
    paymentId: z.string().min(1),
});

export type setDefaultPaymentDTO = z.infer<typeof setDefaultPaymentDTO>;
export const initiateEsewaDTO = z.object({
    orderId: z.string().min(1),
});

export type initiateEsewaDTO = z.infer<typeof initiateEsewaDTO>;

export const verifyEsewaDTO = z.object({
    transactionUuid: z.string().min(1),
    transactionCode: z.string().min(1),
    status: z.string().min(1),
    totalAmount: z.number(),
});

export type verifyEsewaDTO = z.infer<typeof verifyEsewaDTO>;