import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const UserUpdateSchema = z.object({
    fullname: z.string().optional(),
    password: z.string().refine((val) => val === "" || val.length >= 6, {
        message: "Password must be at least 6 characters long if changed",
    }),
    imageUrl: z.instanceof(File).optional().refine((file) => !file || file.size <= MAX_FILE_SIZE,
        { message: "Max File Size is 5MB" })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Image includes jpg, jpeg, png or webp" }),
    address: z.string().optional(),
});

export type UpdateFormType = z.infer<typeof UserUpdateSchema>;