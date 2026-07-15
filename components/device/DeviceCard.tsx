import React from "react";
import { Image, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";

interface DeviceCardProps {
  title: string;
  description: string;
  imageUri: string;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
}

export function DeviceCard({
  title,
  description,
  imageUri,
  actionLabel,
  actionIcon,
  onPress,
  loading,
}: DeviceCardProps) {
  const theme = useAppTheme();
  return (
    <Card style={{ alignItems: "center", paddingVertical: 28, paddingHorizontal: 20 }}>
      <View
        style={{
          width: 128,
          height: 128,
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 18,
          backgroundColor: theme.surfaceAlt,
        }}
      >
        <Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
      </View>
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>{title}</Text>
      <Text
        style={{
          color: theme.textMuted,
          fontSize: 13,
          lineHeight: 19,
          textAlign: "center",
          marginTop: 6,
          marginBottom: 22,
          maxWidth: 260,
        }}
      >
        {description}
      </Text>
      <Button label={actionLabel} icon={actionIcon} onPress={onPress} loading={loading} style={{ width: "100%" }} />
    </Card>
  );
}
