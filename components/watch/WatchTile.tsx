import React from "react";
import { Text, View } from "react-native";
import { RingProgress } from "@/components/metrics/RingProgress";
import { watchTheme } from "@/constants/theme";

interface WatchTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  progress: number;
  colors: readonly [string, string];
  size?: number;
}

// Complicación circular estilo Huawei Watch (icono + valor + anillo de progreso).
export function WatchTile({ icon, label, value, progress, colors, size = 104 }: WatchTileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: watchTheme.face,
        borderWidth: 1,
        borderColor: watchTheme.border,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
        <RingProgress progress={progress} colors={colors} trackColor={watchTheme.ringTrack} size={size - 8} strokeWidth={6} />
      </View>
      {icon}
      <Text style={{ color: watchTheme.text, fontSize: 15, fontWeight: "800", marginTop: 4 }} numberOfLines={1}>
        {value}
      </Text>
      <Text style={{ color: watchTheme.textMuted, fontSize: 9, fontWeight: "600", marginTop: 1 }}>{label}</Text>
    </View>
  );
}
