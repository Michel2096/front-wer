import React from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/metrics/MetricCard";
import { RingProgress } from "@/components/metrics/RingProgress";
import { WatchFace } from "@/components/watch/WatchFace";
import { WatchTile } from "@/components/watch/WatchTile";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDashboard } from "@/hooks/useDashboard";
import { useWatchMode } from "@/hooks/useWatchMode";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { metricColors, palette, radius, statusColors, watchTheme, cardShadow } from "@/constants/theme";
import { MetricReading, MetricStatus } from "@/types/health";
import { formatMetric } from "@/utils/formatters";

// Rangos de referencia aproximados usados solo para dibujar el anillo (0..1)
function ratio(value: number, target: number) {
  return Math.min(value / target, 1);
}

const overallCopy: Record<MetricStatus, { label: string; icon: keyof typeof Feather.glyphMap }> = {
  normal: { label: "Todo en orden", icon: "check-circle" },
  atencion: { label: "Revisa tus métricas", icon: "alert-circle" },
  alerta: { label: "Atención requerida", icon: "alert-triangle" },
};

function worstStatus(readings: MetricReading[]): MetricStatus {
  if (readings.some((r) => r.status === "alerta")) return "alerta";
  if (readings.some((r) => r.status === "atencion")) return "atencion";
  return "normal";
}

export default function Dashboard() {
  const theme = useAppTheme();
  const { data, isLoading, isFetching, refetch } = useDashboard();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const isWatchMode = useWatchMode();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace("/(auth)/login");
  };

  const overall = data
    ? worstStatus([data.heartRate, data.spo2, data.steps, data.calories, data.distance, data.sleep, data.stress, data.temperature])
    : "normal";

  if (isWatchMode) {
    return (
      <View style={{ flex: 1, backgroundColor: watchTheme.background }}>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40, alignItems: "center" }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={watchTheme.text} />
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name="watch" size={15} color={watchTheme.textMuted} />
                <Text style={{ color: watchTheme.textMuted, fontSize: 12, fontWeight: "700" }}>Smartwatch conectado</Text>
              </View>
              <Pressable
                onPress={handleLogout}
                hitSlop={12}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: watchTheme.face,
                  borderWidth: 1,
                  borderColor: watchTheme.border,
                }}
              >
                <Feather name="log-out" size={14} color={watchTheme.textMuted} />
              </Pressable>
            </View>

            <Text style={{ color: watchTheme.textMuted, fontSize: 13, alignSelf: "flex-start" }}>Hola,</Text>
            <Text
              style={{
                color: watchTheme.text,
                fontSize: 22,
                fontWeight: "800",
                alignSelf: "flex-start",
                marginBottom: 14,
              }}
            >
              {user?.fullName?.split(" ")[0] ?? "Bienvenido"}
            </Text>

            {isLoading || !data ? (
              <ActivityIndicator color={watchTheme.text} style={{ marginTop: 60 }} />
            ) : (
              <>
                <WatchFace heartRate={data.heartRate.value} heartRateRatio={ratio(data.heartRate.value, 180)} connected />

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 14,
                    marginTop: 28,
                  }}
                >
                  <WatchTile
                    icon={<Feather name="wind" size={14} color={metricColors.spo2.solid} />}
                    label="SpO2"
                    value={formatMetric(data.spo2.value, "%")}
                    progress={ratio(data.spo2.value, 100)}
                    colors={metricColors.spo2.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="activity" size={14} color={metricColors.steps.solid} />}
                    label="Pasos"
                    value={formatMetric(data.steps.value, "")}
                    progress={ratio(data.steps.value, 10000)}
                    colors={metricColors.steps.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="zap" size={14} color={metricColors.calories.solid} />}
                    label="Kcal"
                    value={formatMetric(data.calories.value, "")}
                    progress={ratio(data.calories.value, 700)}
                    colors={metricColors.calories.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="map-pin" size={14} color={metricColors.distance.solid} />}
                    label="Km"
                    value={formatMetric(data.distance.value, "")}
                    progress={ratio(data.distance.value, 8)}
                    colors={metricColors.distance.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="moon" size={14} color={metricColors.sleep.solid} />}
                    label="Sueño h"
                    value={formatMetric(data.sleep.value, "")}
                    progress={ratio(data.sleep.value, 8)}
                    colors={metricColors.sleep.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="wind" size={14} color={metricColors.stress.solid} />}
                    label="Estrés"
                    value={formatMetric(data.stress.value, "%")}
                    progress={ratio(data.stress.value, 100)}
                    colors={metricColors.stress.gradient}
                  />
                  <WatchTile
                    icon={<Feather name="thermometer" size={14} color={metricColors.temperature.solid} />}
                    label="Temp °C"
                    value={formatMetric(data.temperature.value, "")}
                    progress={ratio(data.temperature.value, 40)}
                    colors={metricColors.temperature.gradient}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} tintColor={theme.accent} />}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <Logo size={26} tone="color" />
            <Pressable
              onPress={handleLogout}
              hitSlop={12}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Feather name="log-out" size={16} color={theme.textMuted} />
            </Pressable>
          </View>

          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Hola,</Text>
          <Text style={{ color: theme.text, fontSize: 26, fontWeight: "800", marginBottom: 18 }}>
            {user?.fullName?.split(" ")[0] ?? "Bienvenido"}
          </Text>

          {isLoading || !data ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 60 }} />
          ) : (
            <>
              {/* Hero: estado general + frecuencia cardíaca, el centro visual del dashboard */}
              <LinearGradient
                colors={theme.brandGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radius.xl,
                  padding: 22,
                  marginBottom: 16,
                  ...cardShadow(theme),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Badge
                      label={overallCopy[overall].label}
                      color={overall === "normal" ? palette.turquoiseLight : statusColors[overall]}
                      style={{ backgroundColor: `${overall === "normal" ? palette.turquoiseLight : statusColors[overall]}26` }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14 }}>
                      <Feather name="heart" size={16} color={metricColors.heartRate.solid} />
                      <Text style={{ color: "#C6D3DA", fontSize: 13, fontWeight: "600" }}>Frecuencia cardíaca</Text>
                    </View>
                    <Text style={{ color: palette.softWhite, fontSize: 40, fontWeight: "800", marginTop: 4 }}>
                      {formatMetric(data.heartRate.value, ` ${data.heartRate.unit}`)}
                    </Text>
                  </View>
                  <RingProgress
                    progress={ratio(data.heartRate.value, 180)}
                    colors={metricColors.heartRate.gradient}
                    trackColor="rgba(255,255,255,0.15)"
                    size={84}
                    strokeWidth={9}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 20,
                    paddingTop: 16,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.12)",
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Feather name="activity" size={15} color={palette.turquoiseLight} />
                    <View>
                      <Text style={{ color: palette.softWhite, fontSize: 15, fontWeight: "700" }}>
                        {formatMetric(data.steps.value, "")}
                      </Text>
                      <Text style={{ color: "#93A4AD", fontSize: 11 }}>pasos hoy</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Feather name="moon" size={15} color={palette.turquoiseLight} />
                    <View>
                      <Text style={{ color: palette.softWhite, fontSize: 15, fontWeight: "700" }}>
                        {formatMetric(data.sleep.value, ` ${data.sleep.unit}`)}
                      </Text>
                      <Text style={{ color: "#93A4AD", fontSize: 11 }}>sueño</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <MetricCard
                    title="Oxígeno (SpO2)"
                    reading={data.spo2}
                    colors={metricColors.spo2.gradient}
                    progress={ratio(data.spo2.value, 100)}
                    icon={<Feather name="wind" size={14} color={metricColors.spo2.solid} />}
                  />
                  <MetricCard
                    title="Calorías"
                    reading={data.calories}
                    colors={metricColors.calories.gradient}
                    progress={ratio(data.calories.value, 700)}
                    icon={<Feather name="zap" size={14} color={metricColors.calories.solid} />}
                  />
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <MetricCard
                    title="Distancia"
                    reading={data.distance}
                    colors={metricColors.distance.gradient}
                    progress={ratio(data.distance.value, 8)}
                    icon={<Feather name="map-pin" size={14} color={metricColors.distance.solid} />}
                  />
                  <MetricCard
                    title="Estrés"
                    reading={data.stress}
                    colors={metricColors.stress.gradient}
                    progress={ratio(data.stress.value, 100)}
                    icon={<Feather name="wind" size={14} color={metricColors.stress.solid} />}
                  />
                </View>
                <MetricCard
                  title="Temperatura"
                  reading={data.temperature}
                  colors={metricColors.temperature.gradient}
                  progress={ratio(data.temperature.value, 40)}
                  icon={<Feather name="thermometer" size={14} color={metricColors.temperature.solid} />}
                />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
