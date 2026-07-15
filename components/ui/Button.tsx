import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/hooks/useAppTheme";
import { radius, cardShadow } from "@/constants/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  style,
}: ButtonProps) {
  const theme = useAppTheme();
  const isDisabled = disabled || loading;
  const [hovered, setHovered] = useState(false);

  const content = (color: string) =>
    loading ? (
      <ActivityIndicator color={color} />
    ) : (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <Text style={{ color, fontWeight: "700", fontSize: 16 }}>{label}</Text>
      </View>
    );

  if (variant === "primary") {
    const shadow = cardShadow(theme);
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        disabled={isDisabled}
        style={({ pressed }) => [
          {
            opacity: isDisabled ? 0.6 : pressed ? 0.88 : 1,
            transform: [
              { scale: pressed ? 0.98 : hovered ? 1.015 : 1 },
              { translateY: hovered && !pressed ? -1 : 0 },
            ],
          },
          style,
        ]}
      >
        <LinearGradient
          colors={theme.accentGradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 16,
            borderRadius: radius.pill,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: hovered ? 1 : 0,
            borderColor: "#FFFFFF50",
            ...shadow,
            shadowOpacity: hovered ? Math.min(shadow.shadowOpacity * 1.6, 1) : shadow.shadowOpacity,
          }}
        >
          {content("#FFFFFF")}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === "secondary") {
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        disabled={isDisabled}
        style={({ pressed }) => [
          {
            paddingVertical: 16,
            borderRadius: radius.pill,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.surfaceSage,
            opacity: isDisabled ? 0.6 : pressed ? 0.85 : hovered ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          style,
        ]}
      >
        {content(theme.onSurfaceSage)}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      disabled={isDisabled}
      style={({ pressed }) => [
        { paddingVertical: 12, opacity: isDisabled ? 0.6 : pressed ? 0.6 : hovered ? 0.8 : 1 },
        style,
      ]}
    >
      <Text
        style={{
          color: theme.accent,
          fontWeight: "600",
          fontSize: 15,
          textAlign: "center",
          textDecorationLine: hovered ? "underline" : "none",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
