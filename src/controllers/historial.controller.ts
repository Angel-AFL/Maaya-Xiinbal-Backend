import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { connection } from "../database/connection";
import {
  historial,
  itinerario,
  detalle_itinerario,
  cat_atractivos,
  cat_servicios_locales,
} from "../database/schema";

export const getHistorialByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.user_id);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "El user_id es obligatorio",
      });
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
        eq(itinerario.id, detalle_itinerario.id_itinerario),
      )
      .leftJoin(
        cat_atractivos,
        eq(detalle_itinerario.id_cat_atractivos, cat_atractivos.id),
      )
      .leftJoin(
        cat_servicios_locales,
        eq(detalle_itinerario.id_servicios_locales, cat_servicios_locales.id),
      )
      .where(eq(itinerario.user_id, userId));

    return res.status(200).json({
      success: true,
      cantidad: registros.length,
      data: registros,
    });
  } catch (error) {
    console.error("Error al consultar historial:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener el historial",
    });
  }
};