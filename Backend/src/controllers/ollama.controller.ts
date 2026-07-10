import { Request, Response } from "express";
import { askOllama } from "../services/ollama.service";

export const generateResponse = async (
    req: Request,
    res: Response
) => {
    try {
        const { prompt } = req.body;

        const answer = await askOllama(prompt);

        res.json({
            success: true,
            data: answer,
            message: "Response generated successfully",
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message ?? "Failed to generate response",
        });
    }
};