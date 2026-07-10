import { chatRecommendation } from "../api/ollama";

export async function handlechatRecommendation(prompt: string) {

    try {
        const result = await chatRecommendation(prompt);
        if (result.success) {
            return {
                status: true,
                message: result.message,
                data: result.data
            }

        }
        return {
            status: false,
            message: result.message
        }
    } catch (error: any) {

        return {
            status: false,
            message: error.message
        }
    }
}