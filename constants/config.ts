export const DEFAULT_API_HOST = "192.168.100.51";
export const DEFAULT_API_PORT = "5000";

export const STORAGE_KEYS = {
  API_BASE_URL: "rita_api_base_url",
  THEME_PREFERENCE: "rita_theme_preference",
  ONBOARDING_DEVICE: "rita_onboarding_device",
  // A qué registro de /device/list corresponde ESTE aparato físico. Se
  // guarda solo local (nunca se sincroniza), por eso dos celulares con la
  // misma sesión pueden mostrar vistas distintas (reloj vs. teléfono).
  MY_DEVICE_ID: "rita_my_device_id",
};

export const ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  session: "/auth/session",
  profile: "/profile",
  healthCurrent: "/health/current",
  healthHistory: "/health/history",
  healthStatistics: "/health/statistics",
  deviceConnect: "/device/connect",
  deviceList: "/device/list",
  deviceDisconnect: "/device/disconnect",
  deviceQr: "/device/qr",
  dashboard: "/dashboard",
};

export const SOCKET_EVENTS = {
  healthUpdate: "health_update",
  deviceConnected: "device_connected",
  deviceDisconnected: "device_disconnected",
};
