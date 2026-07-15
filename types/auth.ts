export type Sex = "masculino" | "femenino" | "otro";

export interface User {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  sex: Sex;
  weightKg: number;
  heightCm: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  sex: Sex;
  weightKg: number;
  heightCm: number;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}

export interface ApiErrorShape {
  message: string;
  errors?: Record<string, string[]>;
}
