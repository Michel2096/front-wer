import React, { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/hooks/useAppTheme";

export function GradientBackground({ children }: PropsWithChildren) {
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={theme.backgroundGradient as [string, string]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
