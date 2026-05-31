import { pgTable, serial, varchar, text, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  correo: varchar("correo", { length: 255 }).notNull().unique(),
  contrasena: text("contrasena").notNull(), // Sin 'ñ' en el nombre de la columna
  telefono: varchar("telefono", { length: 20 }),
  lat: numeric("lat", { precision: 10, scale: 8 }),
  long: numeric("long", { precision: 11, scale: 8 }),
});
