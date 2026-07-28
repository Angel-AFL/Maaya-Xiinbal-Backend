import { Router } from "express";
import { getServiciosLocales } from "../controllers/servicios_locales.controller";

const router = Router();

router.get("/", getServiciosLocales);

export default router;