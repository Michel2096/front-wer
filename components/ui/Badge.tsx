import React from "react";
import { Text, ViewStyle } from "react-native";

interface BadgeProps {
  label: string;
  color: string;
  style?: ViewStyle;
}

export function Badge({ label, color, style }: BadgeProps) {
  return (
    <Text
      style={[
        {
          alignSelf: "flex-start",
          color,
          backgroundColor: `${color}22`,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          fontSize: 11,
          fontWeight: "700",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {label}
    </Text>
  );
}
