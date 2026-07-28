import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { connection } from "../database/connection";
import { users } from "../database/schema";
import { signToken } from "../utils/jwt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios: nombre, apellido, correo, contrasena",
      });
      return;
    }

    const existente = await connection
      .select()
      .from(users)
      .where(eq(users.correo, correo))
      .limit(1);

    if (existente.length > 0) {
      res.status(409).json({
        success: false,
        message: "El correo ya está registrado",
      });
      return;
    }

    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const [nuevoUsuario] = await connection
      .insert(users)
      .values({
        nombre,
        apellido,
        correo,
        contrasena: contrasenaHash,
      })
      .returning();

    if (!nuevoUsuario) {
      res.status(500).json({
        success: false,
        message: "Error al crear el usuario",
      });
      return;
    }

    const token = signToken({ id: nuevoUsuario.id, correo: nuevoUsuario.correo });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar usuario",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios",
      });
      return;
    }

    const [usuario] = await connection
      .select()
      .from(users)
      .where(eq(users.correo, correo))
      .limit(1);

    if (!usuario) {
      res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
      return;
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
      return;
    }

    const token = signToken({ id: usuario.id, correo: usuario.correo });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        lat: usuario.lat,
        long: usuario.long,
      },
    });
  } catch (error) {
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
      res.status(401).json({
        success: false,
        message: "No autenticado",
      });
      return;
    }

    const [usuario] = await connection
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        lat: usuario.lat,
        long: usuario.long,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener perfil",
    });
  }
};
