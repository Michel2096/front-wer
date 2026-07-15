import React, { useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import { radius, statusColors } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? statusColors.alerta : focused ? theme.accent : "transparent";

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600", marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={theme.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            backgroundColor: theme.surface,
            borderRadius: radius.md,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: theme.text,
            fontSize: 16,
            borderWidth: 1.5,
            borderColor,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={{ color: statusColors.alerta, fontSize: 12, marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}
