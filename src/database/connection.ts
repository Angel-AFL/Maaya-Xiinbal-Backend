import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";

if (!env.DATABASE_URL) {
  throw new Error(
    "⚠️ Faltan credenciales: La variable DATABASE_URL no está definida en el archivo .env",
  );
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const connection = drizzle(pool);
