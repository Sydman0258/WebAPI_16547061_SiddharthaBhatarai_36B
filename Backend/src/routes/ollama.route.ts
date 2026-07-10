import { Router } from "express";
import { generateResponse } from "../controllers/ollama.controller";

const router = Router();

router.post("/chat", generateResponse);

export default router;