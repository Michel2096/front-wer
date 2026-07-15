import client from "@/services/api";
import { ENDPOINTS } from "@/constants/config";
import { User } from "@/types/auth";
import { ApiEnvelope } from "@/types/api";
import { ApiUser, mapProfileUpdateToApi, mapUserFromApi } from "@/services/userMapper";

export const profileService = {
  async get(): Promise<User> {
    const { data } = await client.get<ApiEnvelope<ApiUser>>(ENDPOINTS.profile);
    return mapUserFromApi(data.data);
  },

  async update(payload: Partial<User>): Promise<User> {
    const { data } = await client.put<ApiEnvelope<ApiUser>>(ENDPOINTS.profile, mapProfileUpdateToApi(payload));
    return mapUserFromApi(data.data);
  },
};
