import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "⚠️ Faltan credenciales: La variable DATABASE_URL no está definida en el archivo .env",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connection = drizzle(pool);
