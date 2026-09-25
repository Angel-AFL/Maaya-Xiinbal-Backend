import { connection } from "../database/connection";
import {
  itinerario,
  detalle_itinerario,
  historial,
} from "../database/schema";
import { CreateItineraryInput } from "../types";
import { ValidationError } from "../errors/AppError";

export async function create(input: CreateItineraryInput) {
  const {
    user_id,
    punto_inicio,
    lat,
    long,
    atractivos = [],
    servicios_locales = [],
  } = input;

  if (!user_id || !punto_inicio) {
    throw new ValidationError(
      "Los campos user_id y punto_inicio son obligatorios"
    );
  }

  if (!Array.isArray(atractivos) || !Array.isArray(servicios_locales)) {
    throw new ValidationError(
      "atractivos y servicios_locales deben ser arreglos"
    );
  }

  const resultado = await connection.transaction(async (tx) => {
    const nuevoItinerarioResult = await tx
      .insert(itinerario)
      .values({
        user_id,
        punto_inicio,
        lat: lat?.toString(),
        long: long?.toString(),
      })
      .returning();

    const nuevoItinerario = nuevoItinerarioResult[0];

    if (!nuevoItinerario) {
      throw new Error("No se pudo crear el itinerario");
    }

    const detallesAtractivos = atractivos.map((idAtractivo: number) => ({
      id_itinerario: nuevoItinerario.id,
      id_cat_atractivos: idAtractivo,
      id_servicios_locales: null,
    }));

    const detallesServicios = servicios_locales.map((idServicio: number) => ({
      id_itinerario: nuevoItinerario.id,
      id_cat_atractivos: null,
      id_servicios_locales: idServicio,
    }));

    const detalles = [...detallesAtractivos, ...detallesServicios];

    let detallesCreados: any[] = [];

    if (detalles.length > 0) {
      detallesCreados = await tx
        .insert(detalle_itinerario)
        .values(detalles)
        .returning();
    }

    const historialResult = await tx
      .insert(historial)
      .values({
        id_itinerario: nuevoItinerario.id,
        id_detalle_itinerario: null,
      })
      .returning();

    return {
      itinerario: nuevoItinerario,
      detalles: detallesCreados,
      historial: historialResult[0],
    };
  });

  return resultado;
}
