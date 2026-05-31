import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const chat_ia = pgTable("chat_ia", {
  id: serial("id").primaryKey(),
  id_user: integer("id_user")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  mensaje: text("mensaje").notNull(),
  respuesta_ia: text("respuesta_ia").notNull(),
  lat: numeric("lat", { precision: 10, scale: 8 }),
  long: numeric("long", { precision: 11, scale: 8 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
