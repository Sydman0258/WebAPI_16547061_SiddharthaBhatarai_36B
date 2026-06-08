import z from "zod";
import { CustomerSchema } from "../types/customer.types";

export const createCustomerDtos = CustomerSchema.pick({
    username: true,
    fullname: true,
    email: true,
    role: true,
    password: true
});

export type createCustomerDtos = z.infer<typeof createCustomerDtos>;

export const loginCustomerDtos = CustomerSchema.pick({
    email: true,
    password: true
});

export type loginCustomerDtos = z.infer<typeof loginCustomerDtos>;