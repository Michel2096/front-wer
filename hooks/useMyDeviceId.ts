import { QueryClient, useQuery } from "@tanstack/react-query";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/config";

const QUERY_KEY = ["my-device-id"];

// Qué registro de /device/list corresponde a ESTE aparato físico (no a la
// cuenta). Vive solo en el almacenamiento local del dispositivo, así que
// vincular un reloj en un celular no afecta lo que ve otro celular con la
// misma sesión (ver useWatchMode).
export function useMyDeviceId() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => storage.get(STORAGE_KEYS.MY_DEVICE_ID),
  });
}

export async function rememberMyDeviceId(queryClient: QueryClient, deviceId: string): Promise<void> {
  await storage.set(STORAGE_KEYS.MY_DEVICE_ID, deviceId);
  queryClient.setQueryData(QUERY_KEY, deviceId);
}

export async function forgetMyDeviceId(queryClient: QueryClient): Promise<void> {
  await storage.remove(STORAGE_KEYS.MY_DEVICE_ID);
  queryClient.setQueryData(QUERY_KEY, null);
}
