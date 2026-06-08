"use server";

import { LoginFormData, RegisterFormData } from "@/app/(auth)/_component/login_register_schema";
import { login, register } from "@/lib/api/auth";
import { getTokenCookie, setCookieToken, storeUserData } from "../cookies";


export async function registerUser(data: RegisterFormData) {
    try {
        const result = await register(data);
        if (result.success) {
            return {
                success: true, data: result.data,
                message: result.message || 'Registration successful'
            };
        }
        return { success: false, message: result.message || 'Registration failed' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Registration failed' };
    }


}


export async function loginUser(data: LoginFormData) {
    try {
        const res = await login(data);
        if (res.success) {
            const token = res.data.token;
            console.log("Received token:", token);

            await setCookieToken(token);
            // backend returns the created customer under `customer`, not `user`
            await storeUserData(res.data.customer);
           
            return {
                success: true,
                data: res.data,
                message: "Login successful"
            };
        }
        return { success: false, message: res.message || "Login failed" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Login failed" };
    }
}