import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { connection } from "../database/connection";
import { users } from "../database/schema";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput, UserPayload } from "../types";
import {
  ValidationError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/AppError";

const SALT_ROUNDS = 10;

function toUserPayload(user: typeof users.$inferSelect): UserPayload {
  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    telefono: user.telefono,
    lat: user.lat,
    long: user.long,
  };
}

export async function registerUser(input: RegisterInput) {
  const { nombre, apellido, correo, contrasena } = input;

  if (!nombre || !apellido || !correo || !contrasena) {
    throw new ValidationError(
      "Todos los campos son obligatorios: nombre, apellido, correo, contrasena"
    );
  }

  const existente = await connection
    .select()
    .from(users)
    .where(eq(users.correo, correo))
    .limit(1);

  if (existente.length > 0) {
    throw new ConflictError("El correo ya está registrado");
  }

  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const [nuevoUsuario] = await connection
    .insert(users)
    .values({ nombre, apellido, correo, contrasena: contrasenaHash })
    .returning();

  if (!nuevoUsuario) {
    throw new Error("Error al crear el usuario");
  }

  const token = signToken({ id: nuevoUsuario.id, correo: nuevoUsuario.correo });

  return {
    token,
    user: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo: nuevoUsuario.correo,
    } as UserPayload,
  };
}

export async function loginUser(input: LoginInput) {
  const { correo, contrasena } = input;

  if (!correo || !contrasena) {
    throw new ValidationError("Correo y contraseña son obligatorios");
  }

  const [usuario] = await connection
    .select()
    .from(users)
    .where(eq(users.correo, correo))
    .limit(1);

  if (!usuario) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!contrasenaValida) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const token = signToken({ id: usuario.id, correo: usuario.correo });

  return {
    token,
    user: toUserPayload(usuario),
  };
}

export async function getUserById(id: number) {
  const [usuario] = await connection
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!usuario) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return toUserPayload(usuario);
}
