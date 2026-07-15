import { Platform } from "react-native";
import client from "@/services/api";
import { ENDPOINTS } from "@/constants/config";
import { ApiDeviceKind, LinkedDevice, QrResponse } from "@/types/device";
import { ApiEnvelope } from "@/types/api";

// La API Flask devuelve dispositivos y el QR en snake_case y con forma
// plana (ver health_api/models/device.py y health_api/services/qr_service.py);
// aquí se traduce al formato que consume la app, igual que en userMapper.ts.
interface ApiDevice {
  id: string;
  device_name: string | null;
  device_type: ApiDeviceKind;
  status: "pending" | "connected" | "disconnected";
  created_at: string;
  connected_at: string | null;
}

interface ApiQrResponse {
  qr_token: string;
  pairing_code: string;
  qr_image_base64: string;
  expires_at: string;
  expires_in_seconds: number;
}

function mapDeviceFromApi(d: ApiDevice): LinkedDevice {
  return {
    id: d.id,
    type: d.device_type,
    name: d.device_name ?? "Dispositivo",
    connected: d.status === "connected",
    linkedAt: d.connected_at ?? d.created_at,
  };
}

export const deviceService = {
  async connectPhone(): Promise<LinkedDevice> {
    // El backend valida { device_type: "watch"|"phone"|"wearable", device_name }
    // (ver validate_device_connect_payload en health_api/utils/validators.py).
    const { data } = await client.post<ApiEnvelope<ApiDevice>>(ENDPOINTS.deviceConnect, {
      device_type: "phone",
      device_name: Platform.OS === "ios" ? "iPhone" : "Teléfono Android",
    });
    return mapDeviceFromApi(data.data);
  },

  async list(): Promise<LinkedDevice[]> {
    // GET /device/list devuelve un arreglo plano, no { devices: [...] }.
    const { data } = await client.get<ApiEnvelope<ApiDevice[]>>(ENDPOINTS.deviceList);
    return data.data.map(mapDeviceFromApi);
  },

  async disconnect(deviceId: string): Promise<void> {
    await client.post(ENDPOINTS.deviceDisconnect, { device_id: deviceId });
  },

  async qr(): Promise<QrResponse> {
    const { data } = await client.get<ApiEnvelope<ApiQrResponse>>(ENDPOINTS.deviceQr);
    const apiData = data.data;
    return {
      // El reloj escanea este deep link y extrae el token (ver redeem_qr_token en qr_service.py)
      qrPayload: `healthmonitor://device-pair?token=${apiData.qr_token}`,
      qrImageBase64: apiData.qr_image_base64,
      // Alternativa al escaneo: se escribe a mano en /watch-scan.
      pairingCode: apiData.pairing_code,
      expiresAt: apiData.expires_at,
      expiresInSeconds: apiData.expires_in_seconds,
    };
  },
};
