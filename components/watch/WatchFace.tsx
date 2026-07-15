import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RingProgress } from "@/components/metrics/RingProgress";
import { watchTheme, metricColors } from "@/constants/theme";

interface WatchFaceProps {
  size?: number;
  heartRate: number;
  heartRateRatio: number; // 0..1
  connected?: boolean;
}

const weekday = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function formatTime(date: Date) {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// Carátula circular tipo Huawei Watch (bisel + corona física simulada),
// siempre en paleta blanca — es la vista de "reloj" del dashboard.
export function WatchFace({ size = 260, heartRate, heartRateRatio, connected = true }: WatchFaceProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const bezelThickness = Math.round(size * 0.045);
  const faceSize = size - bezelThickness * 2;
  const ringSize = Math.round(size * 0.5);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
      <View
        style={{
          position: "absolute",
          right: -4,
          top: size * 0.42,
          width: 8,
          height: size * 0.16,
          borderRadius: 4,
          backgroundColor: watchTheme.crown,
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: watchTheme.bezel,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View
          style={{
            width: faceSize,
            height: faceSize,
            borderRadius: faceSize / 2,
            backgroundColor: watchTheme.face,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: watchTheme.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: connected ? "#34C97A" : "#C7CAC4",
              }}
            />
            <Text style={{ color: watchTheme.textMuted, fontSize: 11, fontWeight: "600", textTransform: "capitalize" }}>
              {weekday[now.getDay()]}
            </Text>
          </View>

          <Text style={{ color: watchTheme.text, fontSize: size * 0.15, fontWeight: "700", letterSpacing: -1, marginTop: 2 }}>
            {formatTime(now)}
          </Text>

          <View style={{ marginTop: 10, width: ringSize, height: ringSize, alignItems: "center", justifyContent: "center" }}>
            <RingProgress
              progress={heartRateRatio}
              colors={metricColors.heartRate.gradient}
              trackColor={watchTheme.ringTrack}
              size={ringSize}
              strokeWidth={Math.round(ringSize * 0.09)}
            />
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <Feather name="heart" size={14} color={metricColors.heartRate.solid} />
              <Text style={{ color: watchTheme.text, fontSize: 18, fontWeight: "800", marginTop: 2 }}>
                {Math.round(heartRate)}
              </Text>
              <Text style={{ color: watchTheme.textMuted, fontSize: 9, fontWeight: "600" }}>bpm</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
