import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  const theme = useAppTheme();

  if (!label) {
    return <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 24 }} />;
  }

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 12,
        }}
      >
        <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700" }}>{label}</Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
    </View>
  );
}
