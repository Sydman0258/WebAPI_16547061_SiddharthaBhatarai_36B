"use server";

import { LoginFormData, RegisterFormData } from "@/app/(auth)/_component/login_register_schema";
import { getUser, login, profileUpdate, register } from "@/lib/api/auth";
import {  setCookieToken, storeUserData } from "../cookies";
import { revalidatePath } from "next/cache";


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
            await storeUserData(res.data.user);
           
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

export async function getUserData() {
    try {
        const result = await getUser();
        // how to send data to component
        if (result.success) {
            return {
                success: true, data: result.data,
                message: result.message || 'Fetch user info successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Fetch user info failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Fetch user info failed' };
    }
}

export async function handleUpdateProfile(data: FormData) {
    try {
        const result = await profileUpdate(data);
        if (result.success) {
            revalidatePath("/customer/profile"); // update data
            return {
                success: true, data: result.data,
                message: result.message || 'Profile update successful'
            };
        }
        return {
            success: false, message: result.message
                || 'Profile update failed'
        };
    } catch (error: any) {
        return { success: false, message: error.message || 'Profile update failed' };
    }
} 