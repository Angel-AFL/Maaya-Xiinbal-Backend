import { Router } from "express";
import { getHistorialByUser } from "../controllers/historial.controller";

const router = Router();

router.get("/usuario/:user_id", getHistorialByUser);

export default router;