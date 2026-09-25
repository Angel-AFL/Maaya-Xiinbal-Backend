import { Router } from "express";
import authRoutes from "./auth.routes";
import atractivosRoutes from "./atractivos.routes";
import chatRoutes from "./chat.routes";
import historialRoutes from "./historial.routes";
import itinerariosRoutes from "./itinerarios.routes";
import serviciosLocalesRoutes from "./servicios_locales.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/atractivos", atractivosRoutes);
router.use("/chat", chatRoutes);
router.use("/historial", historialRoutes);
router.use("/itinerarios", itinerariosRoutes);
router.use("/servicios-locales", serviciosLocalesRoutes);

export default router;
