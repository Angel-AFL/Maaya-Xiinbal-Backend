import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const itinerario = pgTable("itinerario", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  punto_inicio: varchar("punto_inicio", { length: 255 }).notNull(),
  lat: numeric("lat", { precision: 10, scale: 8 }),
  long: numeric("long", { precision: 11, scale: 8 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
