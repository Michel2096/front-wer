import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, Stack } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useUiStore } from "@/store/uiStore";
import { rememberMyDeviceId } from "@/hooks/useMyDeviceId";
import { statusColors, themedHeaderOptions } from "@/constants/theme";
import client, { extractErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/constants/config";
import { ApiEnvelope } from "@/types/api";

// El QR generado en watch-connect.tsx codifica "healthmonitor://device-pair?token=...".
const TOKEN_PATTERN = /token=([^&]+)/;

export default function WatchScan() {
  const theme = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const setSelectedDeviceType = useUiStore((s) => s.setSelectedDeviceType);
  const queryClient = useQueryClient();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [linking, setLinking] = useState(false);

  const redeem = async (payload: { qr_token?: string; pairing_code?: string }) => {
    try {
      // Sin sesión previa: el qr_token/pairing_code demuestra la vinculación
      // y el backend autentica este dispositivo como el mismo usuario que
      // generó el código (ver redeem_qr_token en qr_service.py).
      const { data } = await client.post<ApiEnvelope<{ id: string }>>(ENDPOINTS.deviceConnect, {
        ...payload,
        device_name: "Reloj vinculado",
        device_type: "watch",
      });
      // Este aparato ES el registro recién creado: guardarlo local es lo
      // que hace que SOLO este celular se muestre en modo reloj (ver
      // useWatchMode), sin afectar a los demás dispositivos de la cuenta.
      await rememberMyDeviceId(queryClient, data.data.id);
      setSelectedDeviceType("smartwatch");
      router.replace("/(tabs)/dashboard");
      return true;
    } catch (err) {
      setError(extractErrorMessage(err));
      return false;
    }
  };

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    const match = data.match(TOKEN_PATTERN);
    if (!match) {
      setError("Este código QR no es de Vitta.");
      return;
    }

    setScanned(true);
    setError(null);
    const ok = await redeem({ qr_token: match[1] });
    if (!ok) setScanned(false);
  };

  const handleManualCode = async () => {
    if (code.trim().length !== 6) {
      setError("El código tiene 6 dígitos.");
      return;
    }
    setError(null);
    setLinking(true);
    await redeem({ pairing_code: code.trim() });
    setLinking(false);
  };

  const manualCodeCard = (
    <Card style={{ marginTop: 20 }}>
      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700", marginBottom: 4 }}>
        ¿No puedes escanear?
      </Text>
      <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 12 }}>
        Escribe el código de 6 dígitos que muestra tu otro dispositivo debajo del QR.
      </Text>
      <Input
        label="Código de vinculación"
        placeholder="482913"
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Button label="Vincular con código" onPress={handleManualCode} loading={linking} />
    </Card>
  );

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!permission.granted) {
    return (
      <GradientBackground>
        <Stack.Screen options={{ headerShown: true, title: "Vincular reloj", ...themedHeaderOptions(theme) }} />
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: theme.text, fontSize: 16, textAlign: "center", marginTop: 12 }}>
            Necesitamos acceso a la cámara para escanear el código QR de tu otro dispositivo.
          </Text>
          <Button label="Conceder permiso" onPress={requestPermission} style={{ marginTop: 16 }} />

          {error && (
            <Text style={{ color: statusColors.alerta, fontSize: 13, textAlign: "center", marginTop: 12 }}>
              {error}
            </Text>
          )}

          {manualCodeCard}
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen options={{ headerShown: true, title: "Escanear código", headerTintColor: "#fff" }} />
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "rgba(0,0,0,0.55)" }}>
        <Text style={{ color: "#fff", fontSize: 13, textAlign: "center", marginBottom: 12 }}>
          Apunta al código QR que muestra tu otro dispositivo en "Vincular otro dispositivo → Smartwatch"
        </Text>

        {error && (
          <Pressable
            onPress={() => {
              setError(null);
              setScanned(false);
            }}
            style={{
              alignSelf: "center",
              backgroundColor: `${statusColors.alerta}CC`,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>{error} (toca para reintentar)</Text>
          </Pressable>
        )}

        {manualCodeCard}
      </View>
    </View>
  );
}
