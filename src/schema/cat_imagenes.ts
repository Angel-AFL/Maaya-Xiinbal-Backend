import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { cat_atractivos } from "./cat_atractivos"; // Importamos la tabla a relacionar

export const cat_imagenes = pgTable("cat_imagenes", {
  id: serial("id").primaryKey(),

  // Relación: Esta columna debe coincidir con un id existente en cat_atractivos
  id_cat_atractivo: integer("id_cat_atractivo")
    .references(() => cat_atractivos.id, { onDelete: "cascade" }) // Si borras el atractivo, se borran sus imágenes
    .notNull(),

  url: text("url").notNull(),
});
