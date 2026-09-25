import { connection } from "../database/connection";
import { cat_servicios_locales } from "../database/schema";

export async function getAll() {
  const serviciosLocales = await connection.select().from(cat_servicios_locales);
  return serviciosLocales;
}
