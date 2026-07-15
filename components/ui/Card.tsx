import React, { PropsWithChildren } from "react";
import { View, ViewStyle } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { radius, spacing, cardShadow } from "@/constants/theme";

interface CardProps {
  style?: ViewStyle;
  bordered?: boolean;
}

export function Card({ children, style, bordered = true }: PropsWithChildren<CardProps>) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: bordered ? 1 : 0,
          borderColor: theme.border,
          ...cardShadow(theme),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
