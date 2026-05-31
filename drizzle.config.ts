import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Drizzle-kit se ejecuta en su propio proceso, por lo que necesita cargar el .env por su cuenta
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "⚠️ Faltan credenciales: La variable DATABASE_URL no está definida en el archivo .env",
  );
}

export default defineConfig({
  // 1. ¿Dónde están definidas tus tablas (esquemas)?
  schema: "./src/schema/*.ts",

  // 2. ¿Dónde quieres que Drizzle guarde el historial de migraciones SQL?
  out: "./drizzle",

  // 3. ¿Qué base de datos estás usando?
  dialect: "postgresql",

  // 4. ¿Cómo entro a la base de datos para aplicar los cambios?
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  // Opciones extra para que la consola te dé más detalles si algo falla
  verbose: true,
  strict: true,
});
