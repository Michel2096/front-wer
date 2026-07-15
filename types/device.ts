// Selección local durante el onboarding (no se envía tal cual al backend)
export type DeviceType = "smartwatch" | "smartphone";

export type DeviceConnectionState =
  | "esperando"
  | "escaneando"
  | "conectado"
  | "error";

// Tipo real de dispositivo tal como lo modela el backend
// (ver health_api/models/device.py)
export type ApiDeviceKind = "watch" | "phone" | "wearable";

export interface LinkedDevice {
  id: string;
  type: ApiDeviceKind;
  name: string;
  connected: boolean;
  linkedAt: string;
}

export interface QrResponse {
  qrPayload: string;
  qrImageBase64: string;
  pairingCode: string;
  expiresAt: string;
  expiresInSeconds: number;
}
