import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { itinerario } from "./itinerario";
import { detalle_itinerario } from "./detalle_itinerario";

export const historial = pgTable("historial", {
  id: serial("id").primaryKey(),
  id_itinerario: integer("id_itinerario")
    .references(() => itinerario.id, { onDelete: "cascade" })
    .notNull(),
  id_detalle_itinerario: integer("id_detalle_itinerario")
    .references(() => detalle_itinerario.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
