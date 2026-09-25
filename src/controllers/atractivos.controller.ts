import { Request, Response } from "express";
import * as atractivosService from "../services/atractivos.service";
import { AppError } from "../errors/AppError";

export const getAtractivos = async (req: Request, res: Response) => {
  try {
    const data = await atractivosService.getAll();
    res.status(200).json({ success: true, cantidad: data.length, data });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al consultar atractivos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los atractivos",
    });
  }
};

export const getAtractivoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await atractivosService.getById(parseInt(id as string));
    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al consultar atractivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener el atractivo",
    });
  }
};

export const addImagen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { url } = req.body;
    const imagen = await atractivosService.addImage(
      parseInt(id as string),
      url,
    );
    res.status(201).json({ success: true, data: imagen });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al agregar imagen:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al agregar la imagen",
    });
  }
};
