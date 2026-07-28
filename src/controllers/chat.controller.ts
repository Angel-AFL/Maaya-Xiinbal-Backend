import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connection } from "../database/connection"; // Ajusta esto según cómo exportes tu conexión
import { cat_atractivos } from "../database/schema"; // Importa tu esquema

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    // 1. Obtenemos los atractivos reales de tu base de datos con Drizzle
    const atractivosDB = await connection.select().from(cat_atractivos);

    // 2. Formateamos los datos para que Gemini los entienda fácilmente
    const contextoAtractivos = atractivosDB
      .map(
        (a) =>
          `- ${a.nombre} (${a.categoria}): ${a.descripcion} en ${a.municipio}, ${a.estado}.`,
      )
      .join("\n");

    // 3. Configuramos el modelo con personalidad y contexto real
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `Eres 'Mayita', una experta guía turística de la Península de Yucatán. 
      Tu objetivo es sugerir rutas, contar historia y recomendar lugares. 

      IDIOMA: Detecta el idioma en que el usuario escribe y responde SIEMPRE en ese mismo idioma. Los nombres propios de los lugares mantenlos en español.

      FORMATO: Usa markdown para dar estructura a tus respuestas (negritas, listas, encabezados). Ejemplo de buen formato:
      **Cenote Xlacah** - Ideal para nadar.
      * Horario: 9am-5pm
      * Precio: \$50 MXN

      MUY IMPORTANTE: Solo puedes recomendar los siguientes lugares de nuestra base de datos:\n${contextoAtractivos}\n
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
