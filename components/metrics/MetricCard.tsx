import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RingProgress } from "@/components/metrics/RingProgress";
import { useAppTheme } from "@/hooks/useAppTheme";
import { MetricReading, MetricStatus } from "@/types/health";
import { formatMetric, formatUpdatedAt } from "@/utils/formatters";
import { statusColors } from "@/constants/theme";

interface MetricCardProps {
  title: string;
  reading: MetricReading;
  colors: readonly [string, string];
  progress: number; // 0..1, relative to a healthy target range
  icon: React.ReactNode;
}

const statusLabel: Record<MetricStatus, string> = {
  normal: "Normal",
  atencion: "Atención",
  alerta: "Alerta",
};

export function MetricCard({ title, reading, colors, progress, icon }: MetricCardProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(0.98);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 300 });
  }, [reading.value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={[{ flex: 1 }, animatedStyle]}>
      <Card style={{ minHeight: 150 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {icon}
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600" }}>{title}</Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 26, fontWeight: "800", marginTop: 8 }}>
              {formatMetric(reading.value, ` ${reading.unit}`)}
            </Text>
            <Badge label={statusLabel[reading.status]} color={statusColors[reading.status]} style={{ marginTop: 8 }} />
          </View>
          <RingProgress progress={progress} colors={colors} trackColor={theme.surfaceAlt} size={56} strokeWidth={6} />
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 12 }}>
          Actualizado {formatUpdatedAt(reading.updatedAt)}
        </Text>
      </Card>
    </Animated.View>
  );
}
