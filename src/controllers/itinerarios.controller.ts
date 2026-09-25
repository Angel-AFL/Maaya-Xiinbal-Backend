import { Request, Response } from "express";
import * as itinerariosService from "../services/itinerarios.service";
import { AppError } from "../errors/AppError";

export const crearItinerario = async (req: Request, res: Response) => {
  try {
    const resultado = await itinerariosService.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Itinerario creado correctamente",
      data: resultado,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error al crear itinerario:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor al crear el itinerario",
      });
  }
};
