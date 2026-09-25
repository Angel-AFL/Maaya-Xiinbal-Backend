import { Request, Response } from "express";
import * as serviciosLocalesService from "../services/servicios_locales.service";
import { AppError } from "../errors/AppError";

export const getServiciosLocales = async (req: Request, res: Response) => {
  try {
    const serviciosLocales = await serviciosLocalesService.getAll();
    res.status(200).json({
      success: true,
      cantidad: serviciosLocales.length,
      data: serviciosLocales,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al consultar servicios locales:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor al obtener los servicios locales",
      });
  }
};
