import { Request, Response } from "express";
import { connection } from "../database/connection";
import { cat_atractivos, cat_imagenes } from "../database/schema";
import { eq } from "drizzle-orm";

export const getAtractivos = async (req: Request, res: Response) => {
  try {
    const rows = await connection
      .select()
      .from(cat_atractivos)
      .leftJoin(cat_imagenes, eq(cat_atractivos.id, cat_imagenes.id_cat_atractivo));

    const atractivosMap = new Map<number, any>();
    for (const row of rows) {
      const a = row.cat_atractivos;
      const img = row.cat_imagenes;
      if (!atractivosMap.has(a.id)) {
        atractivosMap.set(a.id, { ...a, imagenes: [] });
      }
      if (img?.url) {
        atractivosMap.get(a.id).imagenes.push(img.url);
      }
    }

    const data = Array.from(atractivosMap.values());

    res.status(200).json({
      success: true,
      cantidad: data.length,
      data,
    });
  } catch (error) {
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
    const rows = await connection
      .select()
      .from(cat_atractivos)
      .leftJoin(cat_imagenes, eq(cat_atractivos.id, cat_imagenes.id_cat_atractivo))
      .where(eq(cat_atractivos.id, parseInt(id as string)));

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: "Atractivo no encontrado" });
      return;
    }

    const a = rows[0]!.cat_atractivos;
    const imagenes = rows
      .filter((r) => r.cat_imagenes?.url)
      .map((r) => r.cat_imagenes!.url!);

    res.status(200).json({
      success: true,
      data: { ...a, imagenes },
    });
  } catch (error) {
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

    if (!url) {
      res.status(400).json({ success: false, message: "La URL es requerida" });
      return;
    }

    const [imagen] = await connection
      .insert(cat_imagenes)
      .values({ id_cat_atractivo: parseInt(id as string), url })
      .returning();

    res.status(201).json({ success: true, data: imagen });
  } catch (error) {
    console.error("Error al agregar imagen:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al agregar la imagen",
    });
  }
};
