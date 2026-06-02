import { Router } from "express";
import { handleChat } from "../controllers/chat.controller";

const router = Router();

// El endpoint será invocado desde el frontend
router.post("/", handleChat);

export default router;
