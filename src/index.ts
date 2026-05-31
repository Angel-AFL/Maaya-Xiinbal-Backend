import express from "express";
import cors from "cors";
import { sql } from "drizzle-orm"; // Importamos sql para consultas crudas de prueba
import { connection } from "./database/connection";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/ping", async (req, res) => {
  try {
    const result = await connection.execute(sql`SELECT current_database()`);
    res.json({
      status: "success",
      message: "¡Conexión exitosa a PostgreSQL!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({
      status: "error",
      message: "Fallo al conectar a la base de datos",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
