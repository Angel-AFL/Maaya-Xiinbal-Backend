import { Request, Response } from "express";
import { connection } from "../database/connection";
import { cat_servicios_locales } from "../database/schema";

export const getServiciosLocales = async (req: Request, res: Response) => {
  try {
    const serviciosLocales = await connection.select().from(cat_servicios_locales);

    res.status(200).json({
      success: true,
      cantidad: serviciosLocales.length,
      data: serviciosLocales,
    });
  } catch (error) {
    console.error("Error al consultar servicios locales:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los servicios locales",
    });
  }
};