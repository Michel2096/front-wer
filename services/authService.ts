import client, { clearSession } from "@/services/api";
import { ENDPOINTS } from "@/constants/config";
import { LoginPayload, RegisterPayload, SessionResponse, User } from "@/types/auth";
import { ApiEnvelope } from "@/types/api";
import { ApiUser, mapRegisterPayloadToApi, mapUserFromApi } from "@/services/userMapper";

interface ApiSessionResponse {
  authenticated: boolean;
  user?: ApiUser;
}

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    const { data } = await client.post<ApiEnvelope<ApiUser>>(ENDPOINTS.login, payload);
    return mapUserFromApi(data.data);
  },

  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await client.post<ApiEnvelope<ApiUser>>(ENDPOINTS.register, mapRegisterPayloadToApi(payload));
    return mapUserFromApi(data.data);
  },

  async logout(): Promise<void> {
    await client.post(ENDPOINTS.logout);
    clearSession();
  },

  async session(): Promise<SessionResponse> {
    const { data } = await client.get<ApiEnvelope<ApiSessionResponse>>(ENDPOINTS.session);
    return {
      authenticated: data.data.authenticated,
      user: data.data.user ? mapUserFromApi(data.data.user) : undefined,
    };
  },
};
