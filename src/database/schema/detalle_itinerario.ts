import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { itinerario } from "./itinerario";
import { cat_atractivos } from "./cat_atractivos";
import { cat_servicios_locales } from "./cat_servicios_locales";

export const detalle_itinerario = pgTable("detalle_itinerario", {
  id: serial("id").primaryKey(),
  id_itinerario: integer("id_itinerario")
    .references(() => itinerario.id, { onDelete: "cascade" })
    .notNull(),
  id_cat_atractivos: integer("id_cat_atractivos").references(
    () => cat_atractivos.id,
    { onDelete: "set null" },
  ),
  id_servicios_locales: integer("id_servicios_locales").references(
    () => cat_servicios_locales.id,
    { onDelete: "set null" },
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  // Nota: Para que updated_at cambie automáticamente al editar, suele manejarse desde el controlador en Drizzle o con un trigger en PostgreSQL.
});
