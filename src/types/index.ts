export interface UserPayload {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string | null;
  lat?: string | null;
  long?: string | null;
}

export interface RegisterInput {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
}

export interface LoginInput {
  correo: string;
  contrasena: string;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatInput {
  message: string;
  history?: ChatMessage[];
  userLat?: number;
  userLng?: number;
}

export interface CreateItineraryInput {
  user_id: number;
  punto_inicio: string;
  lat?: number;
  long?: number;
  atractivos?: number[];
  servicios_locales?: number[];
}

export interface AttractionData {
  id: number;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  municipio?: string | null;
  estado?: string | null;
  direccion?: string | null;
  precio?: string | null;
  hora_apertura?: string | null;
  hora_cierre?: string | null;
  lat?: string | null;
  long?: string | null;
  imagenes?: string[];
}
