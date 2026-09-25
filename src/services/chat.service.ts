import { GoogleGenerativeAI } from "@google/generative-ai";
import { connection } from "../database/connection";
import { cat_atractivos } from "../database/schema";
import { ChatInput } from "../types";
import { env } from "../config/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildBasicContext(
  atractivosDb: (typeof cat_atractivos.$inferSelect)[],
): string {
  return atractivosDb
    .map(
      (a) =>
        `- ${a.nombre} (${a.categoria}): ${a.descripcion} en ${a.municipio}, ${a.estado}.`,
    )
    .join("\n");
}

function buildLocationContext(
  atractivosDb: (typeof cat_atractivos.$inferSelect)[],
  userLat: number,
  userLng: number,
): string {
  const conDistancias = atractivosDb.map((a) => {
    const aLat = parseFloat(a.lat as unknown as string);
    const aLng = parseFloat(a.long as unknown as string);
    const dist =
      !isNaN(aLat) && !isNaN(aLng)
        ? haversineKm(userLat, userLng, aLat, aLng)
        : Infinity;
    return { ...a, _dist: dist };
  });

  conDistancias.sort((a, b) => a._dist - b._dist);

  const header = `El usuario se encuentra en latitud ${userLat}, longitud ${userLng}. Los lugares ordenados del más cercano al más lejano son:\n`;

  return (
    header +
    conDistancias
      .map(
        (a) =>
          `- ${a.nombre} (${a.categoria}): ${a.descripcion} en ${a.municipio}, ${a.estado}. (${a._dist === Infinity ? "distancia desconocida" : a._dist.toFixed(1) + " km"})`,
      )
      .join("\n")
  );
}

function createSystemInstruction(contexto: string): string {
  return `Eres 'Mayita', una experta guía turística de la Península de Yucatán. 
Tu objetivo es sugerir rutas, contar historia y recomendar lugares. 

IDIOMA: Detecta el idioma en que el usuario escribe y responde SIEMPRE en ese mismo idioma. Los nombres propios de los lugares mantenlos en español.

FORMATO: Usa markdown para dar estructura a tus respuestas (negritas, listas, encabezados). Ejemplo de buen formato:
**Cenote Xlacah** - Ideal para nadar.
* Horario: 9am-5pm
* Precio: \$50 MXN

MUY IMPORTANTE: Solo puedes recomendar los siguientes lugares de nuestra base de datos:\n${contexto}\n
Si te preguntan por un lugar que no está en la lista, recomienda amablemente uno de los nuestros.
Sé concisa y aventurera. Máximo 50 palabras.`;
}

export async function handleChat(input: ChatInput): Promise<string> {
  const { message, history, userLat, userLng } = input;

  const atractivosDB = await connection.select().from(cat_atractivos);

  let contexto: string;

  if (
    typeof userLat === "number" &&
    typeof userLng === "number" &&
    !isNaN(userLat) &&
    !isNaN(userLng)
  ) {
    contexto = buildLocationContext(atractivosDB, userLat, userLng);
  } else {
    contexto = buildBasicContext(atractivosDB);
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: createSystemInstruction(contexto),
  });

  const chat = model.startChat({ history: history || [] });
  const result = await chat.sendMessage(message);
  return result.response.text();
}
