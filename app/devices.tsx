import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useDeviceList, useDisconnectDevice } from "@/hooks/useDevice";
import { formatUpdatedAt } from "@/utils/formatters";
import { statusColors, themedHeaderOptions } from "@/constants/theme";

export default function Devices() {
  const theme = useAppTheme();
  const { data, isLoading } = useDeviceList();
  const disconnect = useDisconnectDevice();

  return (
    <GradientBackground>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Dispositivos vinculados",
          headerBackTitle: "Perfil",
          ...themedHeaderOptions(theme),
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {isLoading ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 40 }} />
          ) : !data || data.length === 0 ? (
            <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 40 }}>
              Aún no tienes dispositivos vinculados.
            </Text>
          ) : (
            data.map((device) => (
              <Card key={device.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name={device.type === "watch" ? "watch" : "smartphone"}
                    size={22}
                    color={theme.accent}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}>{device.name}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                      {device.connected ? "Conectado" : "Desconectado"} · vinculado {formatUpdatedAt(device.linkedAt)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: device.connected ? statusColors.normal : "#7C8B96",
                    }}
                  />
                </View>
                <Button
                  label="Desvincular"
                  variant="ghost"
                  onPress={() => disconnect.mutate(device.id)}
                  style={{ marginTop: 8 }}
                />
              </Card>
            ))
          )}

          <Button label="Vincular otro dispositivo" onPress={() => router.push("/device-selection")} style={{ marginTop: 12 }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
