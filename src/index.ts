import express from "express";
import cors from "cors";
import { env } from "./config/env";
import apiRoutes from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Api estática",
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
