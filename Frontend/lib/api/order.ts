import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";

export const createOrder=async (data:any)=>{
    try {
        const response=await axiosInstance.post(API.ORDER.CREATE,data);
        return response.data;

    } catch (e:any) {
          const serverError = e?.response?.data?.message 
            || e?.response?.data?.error 
            || e?.message 
            || "Order Creation Failed";
            
        throw new Error(serverError);
        
    }
}

export const getMyOrder=async ()=>{
   try {
     const response =await axiosInstance.get(API.ORDER.GET_MY);
     return response.data;
   } catch (e:any) {
     const serverError = e?.response?.data?.message 
            || e?.response?.data?.error 
            || e?.message 
            || "Order Retrieval Failed";
            
        throw new Error(serverError);
   }
}
export const getOrderById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ORDER.GET_BY_ID(id));
        return response.data;
    } catch (e: any) {
        const serverError = e?.response?.data?.message
            || e?.response?.data?.error
            || e?.message
            || "Failed to fetch order";
        throw new Error(serverError);
    }
}