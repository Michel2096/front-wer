import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface SettingsState {
  themeMode: ThemeMode;
  apiHost: string;
  apiPort: string;
  setThemeMode: (mode: ThemeMode) => void;
  setApiConfig: (host: string, port: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: "light",
  apiHost: "192.168.1.100",
  apiPort: "5000",
  setThemeMode: (themeMode) => set({ themeMode }),
  setApiConfig: (apiHost, apiPort) => set({ apiHost, apiPort }),
}));
