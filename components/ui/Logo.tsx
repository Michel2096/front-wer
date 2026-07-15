import React from "react";
import { Image, Text, View, ViewStyle } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

// Metro requiere rutas estáticas: no se puede interpolar el nombre del asset.
const MARKS = {
  color: require("@/assets/werable2.png"), // turquesa — uso universal (funciona sobre navy y sobre blanco suave)
  light: require("@/assets/werable3.png"), // trazo claro — para fondos navy profundos (hero del splash)
  dark: require("@/assets/werable1.png"), // trazo oscuro — para fondos blancos puros
};

interface LogoProps {
  size?: number;
  tone?: keyof typeof MARKS;
  showWordmark?: boolean;
  wordmarkColor?: string;
  direction?: "row" | "column";
  style?: ViewStyle;
}

export function Logo({
  size = 48,
  tone = "color",
  showWordmark = true,
  wordmarkColor,
  direction = "row",
  style,
}: LogoProps) {
  const theme = useAppTheme();
  const textColor = wordmarkColor ?? theme.text;

  return (
    <View
      style={[
        {
          flexDirection: direction,
          alignItems: "center",
          gap: direction === "row" ? 10 : 6,
        },
        style,
      ]}
    >
      <Image source={MARKS[tone]} style={{ width: size, height: size }} resizeMode="contain" />
      {showWordmark ? (
        <Text
          style={{
            color: textColor,
            fontSize: size * 0.42,
            fontWeight: "800",
            letterSpacing: 0.2,
          }}
        >
          Vitta
        </Text>
      ) : null}
    </View>
  );
}
