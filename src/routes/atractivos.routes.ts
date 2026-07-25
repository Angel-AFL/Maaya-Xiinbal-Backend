import { Router } from "express";
import { getAtractivos, getAtractivoById, addImagen } from "../controllers/atractivos.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAtractivos);
router.get("/:id", authenticate, getAtractivoById);
router.post("/:id/imagenes", authenticate, addImagen);

export default router;
