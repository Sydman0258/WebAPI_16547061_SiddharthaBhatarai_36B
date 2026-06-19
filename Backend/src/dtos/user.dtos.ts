import z from "zod";
import { UserSchema } from "../types/user.types";

export const createUserDTO = UserSchema.pick({
    username: true,
    fullname: true,
    email: true,
    role: true,
    password: true,
    phoneNumber:true
});

export type createUserDTO = z.infer<typeof createUserDTO>;

export const loginUserDTO = UserSchema.pick({
    email: true,
    password: true
});

export type loginUserDTO = z.infer<typeof loginUserDTO>;


export const updateUserDTO = UserSchema.partial();
export type updateUserDTO = z.infer<typeof updateUserDTO>;