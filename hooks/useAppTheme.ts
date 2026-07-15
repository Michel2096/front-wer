import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useSettingsStore } from "@/store/settingsStore";

export function useAppTheme() {
  const system = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const resolved = themeMode === "system" ? system ?? "light" : themeMode;
  return resolved === "dark" ? darkTheme : lightTheme;
}
