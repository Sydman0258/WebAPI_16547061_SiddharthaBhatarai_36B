"use server";

import { LoginFormData, RegisterFormData } from "@/app/(auth)/_component/login_register_schema";
import { getUser, login, profileUpdate, register, requestPasswordReset, resetPassword } from "@/lib/api/auth";
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

        // Ensure both success flag AND required payload exist
        if (res?.success && res?.data?.token) {
            const token = res.data.token;
            console.log("Received token:", token);

            // Run cookie writes in parallel to save execution time
            await Promise.all([
                setCookieToken(token),
                res.data.user ? storeUserData(res.data.user) : Promise.resolve()
            ]);
           
            return {
                success: true,
                data: res.data,
                message: "Login successful"
            };
        }

        return { 
            success: false, 
            message: res?.message || "Invalid credentials or missing token from server." 
        };
    } catch (err: any) {
        console.error("loginUser Server Action Error:", err);
        return { 
            success: false, 
            message: err?.message || "An unexpected error occurred during login." 
        };
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




export async function handleRequestPasswordReset(
    email: string
) {
    try {
        const result =
            await requestPasswordReset(email);

        return {
            success: result.success,
            message:
                result.message ||
                "Password reset email sent",
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.message ||
                "Password reset request failed",
        };
    }
}

export async function handleResetPassword(
    token: string,
    newPassword: string
) {
    try {
        const result =
            await resetPassword(
                token,
                newPassword
            );

        return {
            success: result.success,
            message:
                result.message ||
                "Password reset successful",
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.message ||
                "Password reset failed",
        };
    }
}