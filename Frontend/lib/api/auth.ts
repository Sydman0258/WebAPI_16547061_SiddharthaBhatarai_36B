import  axiosInstance  from "./axiosinstance"
import { API } from "./endpoint"

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
       return  response.data;
    }
   catch (e: any) {

        const serverError = e?.response?.data?.message 
            || e?.response?.data?.error 
            || e?.message 
            || "Registration Failed";
            
        throw new Error(serverError);
    }}

export const login=async(data:any)=>{
    try{
        const response=await axiosInstance.post(API.AUTH.LOGIN,data);
        return response.data;
    }
   catch (e: any) {

        const serverError = e?.response?.data?.message 
            || e?.response?.data?.error 
            || e?.message 
            || "Login failed";
            
        throw new Error(serverError);
    }
}

export const getUser = async ()=>{
    try{
        const response = await axiosInstance.get(API.AUTH.GET_PROFILE);
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Fetch user info failed'
        );
    }


}

export const profileUpdate = async ( data: any) => {
    try{
        const response = await axiosInstance.put(
            API.AUTH.UPDATE, 
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // for multer
                }
            }
        );
        return response.data;
        // response.data -> response ko body
    }catch (error: any) {
        throw new Error(
            error?.response?.data?.message || 'Profile update failed'
        );
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
}