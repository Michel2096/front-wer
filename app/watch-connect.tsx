import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDeviceQr } from "@/hooks/useDevice";
import { useUiStore } from "@/store/uiStore";
import { watchTheme } from "@/constants/theme";

const stateCopy: Record<string, { title: string; subtitle: string }> = {
  esperando: { title: "Esperando conexión", subtitle: "Escanea el código con la app de tu reloj" },
  escaneando: { title: "Escaneando código", subtitle: "Mantén el reloj cerca de tu teléfono" },
  conectado: { title: "Dispositivo conectado", subtitle: "Sincronización en tiempo real activa" },
  error: { title: "Error de conexión", subtitle: "Vuelve a intentarlo o revisa tu red local" },
};

// Tamaño del bisel circular que enmarca el QR, imitando la carátula
// redonda de un smartwatch Huawei (siempre en paleta blanca).
const FACE_SIZE = 240;
const BEZEL_THICKNESS = 12;

export default function WatchConnect() {
  const theme = useAppTheme();
  const { data, isLoading, isError } = useDeviceQr();
  const connectionState = useUiStore((s) => s.watchConnectionState);
  const copy = stateCopy[connectionState] ?? stateCopy.esperando;

  useEffect(() => {
    if (connectionState === "conectado") {
      const timer = setTimeout(() => router.replace("/(tabs)/dashboard"), 900);
      return () => clearTimeout(timer);
    }
  }, [connectionState]);

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Card style={{ alignItems: "center", width: "100%", paddingVertical: 32 }}>
          <View style={{ width: FACE_SIZE, height: FACE_SIZE, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            {/* Corona física simulada, igual que la carátula del dashboard en modo reloj */}
            <View
              style={{
                position: "absolute",
                right: -4,
                top: FACE_SIZE * 0.42,
                width: 8,
                height: FACE_SIZE * 0.16,
                borderRadius: 4,
                backgroundColor: watchTheme.crown,
              }}
            />
            <View
              style={{
                width: FACE_SIZE,
                height: FACE_SIZE,
                borderRadius: FACE_SIZE / 2,
                backgroundColor: watchTheme.bezel,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 6,
              }}
            >
              <View
                style={{
                  width: FACE_SIZE - BEZEL_THICKNESS * 2,
                  height: FACE_SIZE - BEZEL_THICKNESS * 2,
                  borderRadius: (FACE_SIZE - BEZEL_THICKNESS * 2) / 2,
                  backgroundColor: watchTheme.face,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: watchTheme.border,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={watchTheme.text} />
                ) : data ? (
                  <QRCode value={data.qrPayload} size={150} />
                ) : (
                  <Text style={{ color: watchTheme.textMuted }}>QR no disponible</Text>
                )}
              </View>
            </View>
          </View>

          <Text style={{ color: theme.text, fontSize: 20, fontWeight: "700" }}>{copy.title}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 14, textAlign: "center", marginTop: 8 }}>
            {isError ? "No se pudo generar el código QR." : copy.subtitle}
          </Text>

          {data && (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                ¿No puedes escanear? Escribe este código a mano:
              </Text>
              <Text
                style={{
                  color: theme.text,
                  fontSize: 28,
                  fontWeight: "800",
                  letterSpacing: 6,
                  marginTop: 6,
                }}
              >
                {data.pairingCode}
              </Text>
            </View>
          )}
        </Card>
      </SafeAreaView>
    </GradientBackground>
  );
}
