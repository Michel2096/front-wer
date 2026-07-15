import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { TrendChart } from "@/components/charts/TrendChart";
import { WatchPageDots } from "@/components/watch/WatchPageDots";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useHealthHistory } from "@/hooks/useHealth";
import { useWatchMode } from "@/hooks/useWatchMode";
import { useWatchSwipe } from "@/hooks/useWatchSwipe";
import { useUiStore } from "@/store/uiStore";
import { HistoryRange } from "@/types/health";
import { metricColors, watchTheme } from "@/constants/theme";
import { formatShortDate } from "@/utils/formatters";

const ranges: { label: string; value: HistoryRange }[] = [
  { label: "Día", value: "daily" },
  { label: "Semana", value: "weekly" },
  { label: "Mes", value: "monthly" },
];

export default function History() {
  const theme = useAppTheme();
  const isWatchMode = useWatchMode();
  const watchSwipe = useWatchSwipe();
  const historyRange = useUiStore((s) => s.historyRange);
  const setHistoryRange = useUiStore((s) => s.setHistoryRange);
  const { data, isLoading } = useHealthHistory(historyRange);

  const points = data?.points ?? [];

  if (isWatchMode) {
    return (
      <View style={{ flex: 1, backgroundColor: watchTheme.background }} {...watchSwipe.panHandlers}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Feather name="watch" size={16} color={watchTheme.textMuted} />
              <Text style={{ color: watchTheme.text, fontSize: 24, fontWeight: "800" }}>Historial</Text>
            </View>

            <WatchPageDots count={watchSwipe.pageCount} current={watchSwipe.currentIndex} onSelect={watchSwipe.goToIndex} />

            <View
              style={{
                flexDirection: "row",
                backgroundColor: watchTheme.face,
                borderWidth: 1,
                borderColor: watchTheme.border,
                borderRadius: 999,
                padding: 4,
                marginBottom: 20,
              }}
            >
              {ranges.map((r) => (
                <Pressable
                  key={r.value}
                  onPress={() => setHistoryRange(r.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 999,
                    alignItems: "center",
                    backgroundColor: historyRange === r.value ? watchTheme.text : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: historyRange === r.value ? "#FFFFFF" : watchTheme.textMuted,
                      fontWeight: "700",
                      fontSize: 13,
                    }}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {isLoading ? (
              <ActivityIndicator color={watchTheme.text} style={{ marginTop: 40 }} />
            ) : points.length === 0 ? (
              <Text style={{ color: watchTheme.textMuted, textAlign: "center", marginTop: 40 }}>
                Sin registros para este periodo todavía.
              </Text>
            ) : (
              <View style={{ gap: 16 }}>
                {[
                  { title: "Frecuencia cardíaca", key: "heartRate" as const, unit: "bpm" },
                  { title: "Pasos", key: "steps" as const, unit: "pasos" },
                  { title: "Sueño", key: "sleep" as const, unit: "horas" },
                  { title: "Estrés", key: "stress" as const, unit: "%" },
                ].map((m) => (
                  <View
                    key={m.key}
                    style={{
                      backgroundColor: watchTheme.face,
                      borderWidth: 1,
                      borderColor: watchTheme.border,
                      borderRadius: 28,
                      padding: 16,
                    }}
                  >
                    <TrendChart
                      title={m.title}
                      data={points.map((p) => p[m.key])}
                      color={metricColors[m.key].solid}
                      unit={m.unit}
                      textColor={watchTheme.text}
                      mutedColor={watchTheme.textMuted}
                      gridColor={watchTheme.border}
                    />
                  </View>
                ))}
                <Text style={{ color: watchTheme.textMuted, fontSize: 12, textAlign: "center" }}>
                  {formatShortDate(points[0]?.timestamp)} — {formatShortDate(points[points.length - 1]?.timestamp)}
                </Text>
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
          <Text style={{ color: theme.text, fontSize: 26, fontWeight: "800", marginBottom: 16 }}>Historial</Text>

          <View style={{ flexDirection: "row", backgroundColor: theme.surfaceAlt, borderRadius: 999, padding: 4, marginBottom: 20 }}>
            {ranges.map((r) => (
              <Pressable
                key={r.value}
                onPress={() => setHistoryRange(r.value)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 999,
                  alignItems: "center",
                  backgroundColor: historyRange === r.value ? theme.accent : "transparent",
                }}
              >
                <Text style={{ color: historyRange === r.value ? "#FFF" : theme.textMuted, fontWeight: "700", fontSize: 13 }}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {isLoading ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 40 }} />
          ) : points.length === 0 ? (
            <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>
              Sin registros para este periodo todavía.
            </Text>
          ) : (
            <View style={{ gap: 16 }}>
              <Card>
                <TrendChart title="Frecuencia cardíaca" data={points.map((p) => p.heartRate)} color={metricColors.heartRate.solid} unit="bpm" />
              </Card>
              <Card>
                <TrendChart title="Pasos" data={points.map((p) => p.steps)} color={metricColors.steps.solid} unit="pasos" />
              </Card>
              <Card>
                <TrendChart title="Sueño" data={points.map((p) => p.sleep)} color={metricColors.sleep.solid} unit="horas" />
              </Card>
              <Card>
                <TrendChart title="Estrés" data={points.map((p) => p.stress)} color={metricColors.stress.solid} unit="%" />
              </Card>
              <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center" }}>
                {formatShortDate(points[0]?.timestamp)} — {formatShortDate(points[points.length - 1]?.timestamp)}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
