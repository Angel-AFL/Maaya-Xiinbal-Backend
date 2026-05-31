import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const pagos = pgTable("pagos", {
  id: serial("id").primaryKey(),
  id_user: integer("id_user")
    .references(() => users.id, { onDelete: "restrict" }) // "restrict" evita borrar a un usuario si tiene pagos registrados (por temas contables)
    .notNull(),
  monto: numeric("monto", { precision: 10, scale: 2 }).notNull(),
  concepto: varchar("concepto", { length: 255 }).notNull(),
  metodo: varchar("metodo", { length: 50 }).notNull(), // Ej: 'tarjeta', 'transferencia', 'efectivo'
  status: varchar("status", { length: 50 }).notNull(), // Ej: 'pendiente', 'completado', 'fallido'
  created_at: timestamp("created_at").defaultNow().notNull(),
});
