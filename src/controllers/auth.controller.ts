import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../errors/AppError";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar usuario",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al iniciar sesión",
    });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "No autenticado" });
      return;
    }

    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener perfil",
    });
  }
};
