import { RegisterPayload, Sex, User } from "@/types/auth";

/**
 * La API Flask usa snake_case y valores en inglés para "gender";
 * la app usa camelCase y "sex" en español. Este módulo traduce
 * entre ambos formatos en el borde de la red.
 */

const SEX_TO_GENDER: Record<Sex, string> = {
  masculino: "male",
  femenino: "female",
  otro: "other",
};

const GENDER_TO_SEX: Record<string, Sex> = {
  male: "masculino",
  female: "femenino",
  other: "otro",
};

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  birth_date: string | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
}

export function mapUserFromApi(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    fullName: apiUser.name,
    email: apiUser.email,
    birthDate: apiUser.birth_date ?? "",
    sex: GENDER_TO_SEX[apiUser.gender ?? ""] ?? "otro",
    weightKg: apiUser.weight ?? 0,
    heightCm: apiUser.height ?? 0,
  };
}

export function mapRegisterPayloadToApi(payload: RegisterPayload) {
  return {
    name: payload.fullName,
    email: payload.email,
    password: payload.password,
    birth_date: payload.birthDate,
    gender: SEX_TO_GENDER[payload.sex],
    weight: payload.weightKg,
    height: payload.heightCm,
  };
}

export function mapProfileUpdateToApi(payload: Partial<User>) {
  const out: Record<string, unknown> = {};
  if (payload.fullName !== undefined) out.name = payload.fullName;
  if (payload.birthDate !== undefined) out.birth_date = payload.birthDate;
  if (payload.sex !== undefined) out.gender = SEX_TO_GENDER[payload.sex];
  if (payload.weightKg !== undefined) out.weight = payload.weightKg;
  if (payload.heightCm !== undefined) out.height = payload.heightCm;
  return out;
}
