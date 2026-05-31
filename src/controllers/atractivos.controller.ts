import { Request, Response } from "express";
import { connection } from "../database/connection";
import { cat_atractivos } from "../database/schema";

export const getAtractivos = async (req: Request, res: Response) => {
  try {
    const atractivos = await connection.select().from(cat_atractivos);
    res.status(200).json({
      success: true,
      cantidad: atractivos.length,
      data: atractivos,
    });
  } catch (error) {
    console.error("Error al consultar atractivos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los atractivos",
    });
  }
};
