import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSettingsStore } from "@/store/settingsStore";
import { setBaseUrl, getBaseUrl } from "@/services/api";
import { DEFAULT_API_HOST, DEFAULT_API_PORT } from "@/constants/config";
import { themedHeaderOptions } from "@/constants/theme";

export default function NetworkSettings() {
  const theme = useAppTheme();
  const setApiConfig = useSettingsStore((s) => s.setApiConfig);
  const [host, setHost] = useState(DEFAULT_API_HOST);
  const [port, setPort] = useState(DEFAULT_API_PORT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBaseUrl().then((url) => {
      const match = url.match(/^http:\/\/([^:]+):(\d+)$/);
      if (match) {
        setHost(match[1]);
        setPort(match[2]);
      }
    });
  }, []);

  const handleSave = async () => {
    await setBaseUrl(host, port);
    setApiConfig(host, port);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <GradientBackground>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Configuración de red",
          headerBackTitle: "Perfil",
          ...themedHeaderOptions(theme),
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>
            Ingresa la dirección IP local y el puerto donde corre tu servidor Flask, por ejemplo{" "}
            192.168.1.100 y 5000.
          </Text>

          <Card>
            <Input label="Dirección IP local" placeholder="192.168.1.100" value={host} onChangeText={setHost} keyboardType="numeric" />
            <Input label="Puerto" placeholder="5000" value={port} onChangeText={setPort} keyboardType="number-pad" />
            <Button label={saved ? "Guardado ✓" : "Guardar configuración"} onPress={handleSave} />
          </Card>

          <Button label="Volver" variant="ghost" onPress={() => router.back()} style={{ marginTop: 12 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
