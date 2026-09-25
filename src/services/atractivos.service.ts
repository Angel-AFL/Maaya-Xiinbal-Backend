import { eq } from "drizzle-orm";
import { connection } from "../database/connection";
import { cat_atractivos, cat_imagenes } from "../database/schema";
import { AttractionData } from "../types";
import { ValidationError, NotFoundError } from "../errors/AppError";

function aggregateImages(
  rows: { cat_atractivos: typeof cat_atractivos.$inferSelect; cat_imagenes: typeof cat_imagenes.$inferSelect | null }[]
): AttractionData[] {
  const atractivosMap = new Map<number, AttractionData>();

  for (const row of rows) {
    const a = row.cat_atractivos;
    const img = row.cat_imagenes;

    if (!atractivosMap.has(a.id)) {
      atractivosMap.set(a.id, {
        id: a.id,
        nombre: a.nombre,
        descripcion: a.descripcion,
        categoria: a.categoria,
        municipio: a.municipio,
        estado: a.estado,
        direccion: a.direccion,
        precio: a.precio,
        hora_apertura: a.hora_apertura,
        hora_cierre: a.hora_cierre,
        lat: a.lat,
        long: a.long,
        imagenes: [],
      });
    }

    if (img?.url) {
      atractivosMap.get(a.id)!.imagenes!.push(img.url);
    }
  }

  return Array.from(atractivosMap.values());
}

export async function getAll() {
  const rows = await connection
    .select()
    .from(cat_atractivos)
    .leftJoin(cat_imagenes, eq(cat_atractivos.id, cat_imagenes.id_cat_atractivo));

  return aggregateImages(rows);
}

export async function getById(id: number) {
  const rows = await connection
    .select()
    .from(cat_atractivos)
    .leftJoin(cat_imagenes, eq(cat_atractivos.id, cat_imagenes.id_cat_atractivo))
    .where(eq(cat_atractivos.id, id));

  if (rows.length === 0 || !rows[0]) {
    throw new NotFoundError("Atractivo no encontrado");
  }

  const [attraction] = aggregateImages(rows);
  return attraction;
}

export async function addImage(attractionId: number, url: string) {
  if (!url) {
    throw new ValidationError("La URL es requerida");
  }

  const [imagen] = await connection
    .insert(cat_imagenes)
    .values({ id_cat_atractivo: attractionId, url })
    .returning();

  return imagen;
}
