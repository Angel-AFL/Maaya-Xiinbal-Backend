import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  time,
} from "drizzle-orm/pg-core";

export const cat_servicios_locales = pgTable("cat_servicios_locales", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  categoria: varchar("categoria", { length: 100 }),
  municipio: varchar("municipio", { length: 100 }),
  estado: varchar("estado", { length: 100 }),
  direccion: text("direccion"),
  precio: numeric("precio", { precision: 10, scale: 2 }),
  hora_apertura: time("hora_apertura"),
  hora_cierre: time("hora_cierre"),
  lat: numeric("lat", { precision: 10, scale: 8 }),
  long: numeric("long", { precision: 11, scale: 8 }),
});
