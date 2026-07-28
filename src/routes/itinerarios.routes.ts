import { Router } from "express";
import { crearItinerario } from "../controllers/itinerarios.controller";

const router = Router();

router.post("/", crearItinerario);

export default router;