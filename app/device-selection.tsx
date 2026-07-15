import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { DeviceCard } from "@/components/device/DeviceCard";
import { Divider } from "@/components/ui/Divider";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useConnectPhone } from "@/hooks/useDevice";
import { useLogout } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { themedHeaderOptions, statusColors } from "@/constants/theme";
import { extractErrorMessage } from "@/services/api";

const WATCH_IMAGE = "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&q=80";
const PHONE_IMAGE = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80";

export default function DeviceSelection() {
  const theme = useAppTheme();
  const setSelectedDeviceType = useUiStore((s) => s.setSelectedDeviceType);
  const connectPhone = useConnectPhone();
  const logout = useLogout();
  const [apiError, setApiError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.replace("/(auth)/login");
  };

  const handleWatch = () => {
    setApiError(null);
    setSelectedDeviceType("smartwatch");
    router.push("/watch-connect");
  };

  const handlePhone = async () => {
    setApiError(null);
    setSelectedDeviceType("smartphone");
    try {
      await connectPhone.mutateAsync();
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  return (
    <GradientBackground>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Vincula tu dispositivo",
          ...themedHeaderOptions(theme),
          headerRight: () => (
            <Pressable onPress={handleLogout} hitSlop={12} style={{ paddingHorizontal: 4 }}>
              <Feather name="log-out" size={20} color={theme.accent} />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 40 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
            <View style={{ width: 22, height: 6, borderRadius: 3, backgroundColor: theme.accent }} />
            <View style={{ width: 22, height: 6, borderRadius: 3, backgroundColor: theme.border, marginLeft: 6 }} />
            <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "600", marginLeft: 10 }}>
              Paso 1 de 2
            </Text>
          </View>

          <Text style={{ color: theme.text, fontSize: 15, lineHeight: 21 }}>
            Elige cómo quieres registrar tus métricas de salud. Podrás vincular otro dispositivo más
            adelante desde tu perfil.
          </Text>

          {apiError && (
            <View
              style={{
                backgroundColor: `${statusColors.alerta}22`,
                borderColor: statusColors.alerta,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                marginTop: 16,
              }}
            >
              <Text style={{ color: statusColors.alerta, fontSize: 13, fontWeight: "600" }}>{apiError}</Text>
            </View>
          )}

          <View style={{ marginTop: 28 }}>
            <DeviceCard
              title="Smartwatch"
              description="Sincroniza en tiempo real desde tu reloj inteligente vía código QR"
              imageUri={WATCH_IMAGE}
              actionLabel="Conectar"
              actionIcon={<MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />}
              onPress={handleWatch}
            />
          </View>

          <Divider label="o" />

          <DeviceCard
            title="Teléfono"
            description="Usa los sensores de tu teléfono como dispositivo principal"
            imageUri={PHONE_IMAGE}
            actionLabel="Continuar"
            actionIcon={<Feather name="smartphone" size={18} color="#FFFFFF" />}
            onPress={handlePhone}
            loading={connectPhone.isPending}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
