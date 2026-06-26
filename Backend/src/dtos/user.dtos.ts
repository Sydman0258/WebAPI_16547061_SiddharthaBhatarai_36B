import z from "zod";
import { UserSchema } from "../types/user.types";

export const createUserDTO = UserSchema.pick({
    username: true,
    fullname: true,
    email: true,
    role: true,
    password: true,
    phoneNumber: true
});

export type createUserDTO = z.infer<typeof createUserDTO>;


export const CreateUserDTOAdmin = UserSchema.pick({
    username: true,
    fullname: true,
    email: true,
    role: true,
    password: true,
    phoneNumber: true

});
export type CreateUserDTOAdmin = z.infer<typeof CreateUserDTOAdmin>;

export const loginUserDTO = UserSchema.pick({
    email: true,
    password: true
});

export type loginUserDTO = z.infer<typeof loginUserDTO>;


export const updateUserDTO = UserSchema.partial();
export type updateUserDTO = z.infer<typeof updateUserDTO>;

export const UpdatePasswordDTO = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters long"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"]
});
export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;