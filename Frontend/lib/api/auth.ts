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