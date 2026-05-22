import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email("Enter a Valid Email Address"),
    password: z.string().min(7, "Password must be at least 7 characters long")
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string().max(10),
    firstName: z.string(),
    lastname: z.string(),
    email: z.email("Enter a valid email"),
    password: z.string().min(7, "Password must be atlesast 7 characters"),
    confirmpassword: z.string().min(7)
}).refine((data) => data.password === data.confirmpassword, {
    message: "Password donot match",
    path: ["confirmpassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;