import { Request, Response } from "express";
import * as historialService from "../services/historial.service";
import { AppError } from "../errors/AppError";

export const getHistorialByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.user_id);
    const registros = await historialService.getByUserId(userId);

    return res.status(200).json({
      success: true,
      cantidad: registros.length,
      data: registros,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    console.error("Error al consultar historial:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor al obtener el historial",
      });
  }
};
