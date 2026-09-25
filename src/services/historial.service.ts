import { eq } from "drizzle-orm";
import { connection } from "../database/connection";
import {
  historial,
  itinerario,
  detalle_itinerario,
  cat_atractivos,
  cat_servicios_locales,
} from "../database/schema";
import { ValidationError } from "../errors/AppError";

export async function getByUserId(userId: number) {
  if (!userId || isNaN(userId)) {
    throw new ValidationError("El user_id es obligatorio");
  }

  const registros = await connection
    .select({
      historial_id: historial.id,
      historial_created_at: historial.created_at,

      itinerario_id: itinerario.id,
      user_id: itinerario.user_id,
      punto_inicio: itinerario.punto_inicio,
      lat: itinerario.lat,
      long: itinerario.long,
      itinerario_created_at: itinerario.created_at,

      detalle_id: detalle_itinerario.id,

      atractivo_id: cat_atractivos.id,
      atractivo_nombre: cat_atractivos.nombre,
      atractivo_categoria: cat_atractivos.categoria,

      servicio_id: cat_servicios_locales.id,
      servicio_nombre: cat_servicios_locales.nombre,
      servicio_categoria: cat_servicios_locales.categoria,
    })
    .from(historial)
    .innerJoin(itinerario, eq(historial.id_itinerario, itinerario.id))
    .leftJoin(
      detalle_itinerario,
      eq(itinerario.id, detalle_itinerario.id_itinerario)
    )
    .leftJoin(
      cat_atractivos,
      eq(detalle_itinerario.id_cat_atractivos, cat_atractivos.id)
    )
    .leftJoin(
      cat_servicios_locales,
      eq(detalle_itinerario.id_servicios_locales, cat_servicios_locales.id)
    )
    .where(eq(itinerario.user_id, userId));

  return registros;
}
