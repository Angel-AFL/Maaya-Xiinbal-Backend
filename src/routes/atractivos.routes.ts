import { Router } from "express";
import { getAtractivos } from "../controllers/atractivos.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAtractivos);

export default router;
