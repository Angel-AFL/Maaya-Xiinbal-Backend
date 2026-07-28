import { Request, Response } from "express";
import { connection } from "../database/connection";
import {
  itinerario,
  detalle_itinerario,
  historial,
} from "../database/schema";

export const crearItinerario = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      punto_inicio,
      lat,
      long,
      atractivos = [],
      servicios_locales = [],
    } = req.body;

    if (!user_id || !punto_inicio) {
      return res.status(400).json({
        success: false,
        message: "Los campos user_id y punto_inicio son obligatorios",
      });
    }

    if (!Array.isArray(atractivos) || !Array.isArray(servicios_locales)) {
      return res.status(400).json({
        success: false,
        message: "atractivos y servicios_locales deben ser arreglos",
      });
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

      const historialCreado = historialResult[0];

      return {
        itinerario: nuevoItinerario,
        detalles: detallesCreados,
        historial: historialCreado,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Itinerario creado correctamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al crear itinerario:", error);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al crear el itinerario",
    });
  }
};