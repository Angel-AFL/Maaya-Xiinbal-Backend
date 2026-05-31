import { Router } from "express";
import { getAtractivos } from "../controllers/atractivos.controller";

const router = Router();

router.get("/", getAtractivos);

export default router;
