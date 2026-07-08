import { z } from "zod";

export const SavedCardSchema = z.object({
  cardHolderName: z.string(),
  cardBrand: z.string(),
  lastFourDigits: z.string(),
  expiryMonth: z.number(),
  expiryYear: z.number(),
});

export const EsewaAccountSchema = z.object({
  accountName: z.string(),
  mobileNumber: z.string(),
});

export const PaymentSchema = z.object({
  userId: z.string(),

  paymentType: z.enum(["card", "esewa"]),

  card: SavedCardSchema.optional(),

  esewa: EsewaAccountSchema.optional(),

  isDefault: z.boolean().default(false),
});

export type SavedCardType = z.infer<typeof SavedCardSchema>;
export type EsewaAccountType = z.infer<typeof EsewaAccountSchema>;
export type PaymentType = z.infer<typeof PaymentSchema>;