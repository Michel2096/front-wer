import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { RingProgress } from "@/components/metrics/RingProgress";
import { WatchTile } from "@/components/watch/WatchTile";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useHealthStatistics } from "@/hooks/useHealth";
import { useWatchMode } from "@/hooks/useWatchMode";
import { useUiStore } from "@/store/uiStore";
import { metricColors, statusColors, watchTheme } from "@/constants/theme";
import { MetricStatistic } from "@/types/health";

const trendIcon: Record<MetricStatistic["trend"], { name: keyof typeof Feather.glyphMap; color: string }> = {
  up: { name: "trending-up", color: statusColors.normal },
  down: { name: "trending-down", color: statusColors.alerta },
  stable: { name: "minus", color: "#7C8B96" },
};

function StatRow({
  title,
  stat,
  unit,
  gradient,
}: {
  title: string;
  stat: MetricStatistic;
  unit: string;
  gradient: readonly [string, string];
}) {
  const theme = useAppTheme();
  const trend = trendIcon[stat.trend];
  const progress = stat.max > 0 ? stat.average / stat.max : 0;

  return (
    <Card style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <RingProgress progress={progress} colors={gradient} trackColor={theme.surfaceAlt} size={56} strokeWidth={6} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}>{title}</Text>
          <Feather name={trend.name} size={14} color={trend.color} />
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
          Prom {stat.average}{unit} · Máx {stat.max}{unit} · Mín {stat.min}{unit}
        </Text>
      </View>
    </Card>
  );
}

const statList: {
  title: string;
  label: string;
  key: keyof typeof metricColors;
  unit: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { title: "Frecuencia cardíaca", label: "FC", key: "heartRate", unit: " bpm", icon: "heart" },
  { title: "Oxígeno (SpO2)", label: "SpO2", key: "spo2", unit: "%", icon: "wind" },
  { title: "Pasos", label: "Pasos", key: "steps", unit: "", icon: "activity" },
  { title: "Calorías", label: "Kcal", key: "calories", unit: " kcal", icon: "zap" },
  { title: "Distancia", label: "Km", key: "distance", unit: " km", icon: "map-pin" },
  { title: "Sueño", label: "Sueño", key: "sleep", unit: " h", icon: "moon" },
  { title: "Estrés", label: "Estrés", key: "stress", unit: "%", icon: "wind" },
  { title: "Temperatura", label: "Temp", key: "temperature", unit: "°C", icon: "thermometer" },
];

export default function Statistics() {
  const theme = useAppTheme();
  const isWatchMode = useWatchMode();
  const historyRange = useUiStore((s) => s.historyRange);
  const { data, isLoading } = useHealthStatistics(historyRange);

  if (isWatchMode) {
    return (
      <View style={{ flex: 1, backgroundColor: watchTheme.background }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Feather name="watch" size={16} color={watchTheme.textMuted} />
              <Text style={{ color: watchTheme.text, fontSize: 24, fontWeight: "800" }}>Estadísticas</Text>
            </View>
            <Text style={{ color: watchTheme.textMuted, fontSize: 13, marginBottom: 20 }}>
              Promedios del periodo seleccionado, como en las complicaciones del reloj
            </Text>

            {isLoading || !data ? (
              <ActivityIndicator color={watchTheme.text} style={{ marginTop: 40 }} />
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
                {statList.map((m) => {
                  const stat = data[m.key];
                  const progress = stat.max > 0 ? stat.average / stat.max : 0;
                  return (
                    <WatchTile
                      key={m.key}
                      icon={<Feather name={m.icon} size={14} color={metricColors[m.key].solid} />}
                      label={m.label}
                      value={`${stat.average}${m.unit}`}
                      progress={progress}
                      colors={metricColors[m.key].gradient}
                    />
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ color: theme.text, fontSize: 26, fontWeight: "800", marginBottom: 4 }}>Estadísticas</Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 20 }}>
            Promedios, máximos, mínimos y tendencias del periodo seleccionado
          </Text>

          {isLoading || !data ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 40 }} />
          ) : (
            <View>
              <StatRow title="Frecuencia cardíaca" stat={data.heartRate} unit=" bpm" gradient={metricColors.heartRate.gradient} />
              <StatRow title="Oxígeno (SpO2)" stat={data.spo2} unit="%" gradient={metricColors.spo2.gradient} />
              <StatRow title="Pasos" stat={data.steps} unit="" gradient={metricColors.steps.gradient} />
              <StatRow title="Calorías" stat={data.calories} unit=" kcal" gradient={metricColors.calories.gradient} />
              <StatRow title="Distancia" stat={data.distance} unit=" km" gradient={metricColors.distance.gradient} />
              <StatRow title="Sueño" stat={data.sleep} unit=" h" gradient={metricColors.sleep.gradient} />
              <StatRow title="Estrés" stat={data.stress} unit="%" gradient={metricColors.stress.gradient} />
              <StatRow title="Temperatura" stat={data.temperature} unit="°C" gradient={metricColors.temperature.gradient} />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
