import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connection } from "../database/connection";
import { cat_atractivos } from "../database/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, history, userLat, userLng } = req.body;

    const atractivosDB = await connection.select().from(cat_atractivos);

    let contextoUbicacion = "";
    if (
      typeof userLat === "number" &&
      typeof userLng === "number" &&
      !isNaN(userLat) &&
      !isNaN(userLng)
    ) {
      const conDistancias = atractivosDB.map((a) => {
        const aLat = parseFloat(a.lat as unknown as string);
        const aLng = parseFloat(a.long as unknown as string);
        const dist =
          !isNaN(aLat) && !isNaN(aLng)
            ? haversineKm(userLat, userLng, aLat, aLng)
            : Infinity;
        return { ...a, _dist: dist };
      });

      conDistancias.sort((a, b) => a._dist - b._dist);

      const contextoUbicacion = `El usuario se encuentra en latitud ${userLat}, longitud ${userLng}. Los lugares ordenados del más cercano al más lejano son:\n`;
      const contexto = contextoUbicacion + conDistancias
        .map(
          (a) =>
            `- ${a.nombre} (${a.categoria}): ${a.descripcion} en ${a.municipio}, ${a.estado}. (${a._dist === Infinity ? "distancia desconocida" : a._dist.toFixed(1) + " km"})`,
        )
        .join("\n");

      const model = genAI.getGenerativeModel({
        model: "gemini-3.5-flash",
        systemInstruction: `Eres 'Mayita', una experta guía turística de la Península de Yucatán. 
        Tu objetivo es sugerir rutas, contar historia y recomendar lugares. 

        IDIOMA: Detecta el idioma en que el usuario escribe y responde SIEMPRE en ese mismo idioma. Los nombres propios de los lugares mantenlos en español.

        FORMATO: Usa markdown para dar estructura a tus respuestas (negritas, listas, encabezados). Ejemplo de buen formato:
        **Cenote Xlacah** - Ideal para nadar.
        * Horario: 9am-5pm
        * Precio: \$50 MXN

        MUY IMPORTANTE: Solo puedes recomendar los siguientes lugares de nuestra base de datos, ordenados del más cercano al más lejano desde la ubicación del usuario. Prioriza recomendar los lugares más cercanos.\n${contexto}\n
        Si te preguntan por un lugar que no está en la lista, recomienda amablemente uno de los nuestros.
        Sé concisa y aventurera. Máximo 50 palabras.`,
      });

      const chat = model.startChat({ history: history || [] });
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      return res.json({ success: true, response: responseText });
    }

    const contexto = atractivosDB
      .map(
        (a) =>
          `- ${a.nombre} (${a.categoria}): ${a.descripcion} en ${a.municipio}, ${a.estado}.`,
      )
      .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `Eres 'Mayita', una experta guía turística de la Península de Yucatán. 
      Tu objetivo es sugerir rutas, contar historia y recomendar lugares. 

      IDIOMA: Detecta el idioma en que el usuario escribe y responde SIEMPRE en ese mismo idioma. Los nombres propios de los lugares mantenlos en español.

      FORMATO: Usa markdown para dar estructura a tus respuestas (negritas, listas, encabezados). Ejemplo de buen formato:
      **Cenote Xlacah** - Ideal para nadar.
      * Horario: 9am-5pm
      * Precio: \$50 MXN

      MUY IMPORTANTE: Solo puedes recomendar los siguientes lugares de nuestra base de datos:\n${contexto}\n
      Si te preguntan por un lugar que no está en la lista, recomienda amablemente uno de los nuestros.
      Sé concisa y aventurera. Máximo 50 palabras.`,
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ success: true, response: responseText });
  } catch (error) {
    console.error("Error en el controlador de chat:", error);
    res
      .status(500)
      .json({ success: false, error: "El asistente no pudo responder." });
  }
};
