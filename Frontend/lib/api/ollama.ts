import axios from "axios";
import axiosInstance from "./axiosinstance";
import { API } from "./endpoint";



export const chatRecommendation = async (data: string) => {
    try {
        const response = await axiosInstance.post(
            API.OLLAMA.ASK_AI,
         { prompt: data }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ??
                error.message
            );
        }

        throw error;
    }
};