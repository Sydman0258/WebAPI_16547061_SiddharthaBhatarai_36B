import {z} from 'zod';

export const CustomerSchema=z.object({
  username:z.string(),
  fullname:z.string(),
  email:z.email(),
  role:z.enum(["customer","driver","restaurant"]),
  password:z.string().min(6)
});

export type CustomerType=z.infer<typeof CustomerSchema>;