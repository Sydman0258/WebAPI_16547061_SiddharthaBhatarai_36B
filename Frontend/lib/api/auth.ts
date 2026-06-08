import { axiosInstance } from "./axiosinstance"
import { API } from "./endpoint"

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
       return  response.data;
    }
    catch (e: any) {
        throw new Error(
            e?.response?.data?.message || "Registration Failed"
        );
    }
}

export const login=async(data:any)=>{
    try{
        const response=await axiosInstance.post(API.AUTH.LOGIN,data);
        return response.data;
    }
    catch(e:any){
throw new Error(
    e?.response?.data?.message 
    || "Login failed"
);
    }
}