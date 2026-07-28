import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import atractivosRoutes from "./routes/atractivos.routes";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";
import historialRoutes from "./routes/historial.routes";
import serviciosLocalesRoutes from "./routes/servicios_locales.routes";
import itinerariosRoutes from "./routes/itinerarios.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/historial", historialRoutes);
app.use("/api/itinerarios", itinerariosRoutes);
app.use("/api/servicios-locales", serviciosLocalesRoutes);
app.use("/api/atractivos", atractivosRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Api estática",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
