import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { AppError } from "../errors/AppError";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const responseText = await chatService.handleChat(req.body);
    res.json({ success: true, response: responseText });
  } catch (error) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.error("Error en el controlador de chat:", error);
    res
      .status(500)
      .json({ success: false, error: "El asistente no pudo responder." });
  }
};
