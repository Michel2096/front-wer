import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/services/api";
import { statusColors, radius } from "@/constants/theme";
import { useSettingsStore } from "@/store/settingsStore";

const THEME_OPTIONS: { value: "light" | "dark" | "system"; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
];

function ThemeSwitcher() {
  const theme = useAppTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  return (
    <Card style={{ marginBottom: 10 }}>
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600", marginBottom: 10 }}>Apariencia</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {THEME_OPTIONS.map((opt) => {
          const active = themeMode === opt.value;
          return (
            <Text
              key={opt.value}
              onPress={() => setThemeMode(opt.value)}
              style={{
                flex: 1,
                textAlign: "center",
                paddingVertical: 10,
                borderRadius: radius.pill,
                fontSize: 13,
                fontWeight: "700",
                overflow: "hidden",
                backgroundColor: active ? theme.accent : theme.surfaceSage,
                color: active ? "#FFFFFF" : theme.onSurfaceSage,
              }}
            >
              {opt.label}
            </Text>
          );
        })}
      </View>
    </Card>
  );
}

function Row({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const theme = useAppTheme();
  return (
    <Card
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Feather name={icon} size={18} color={theme.accent} />
      <Text style={{ color: theme.text, fontSize: 15, fontWeight: "600", flex: 1, marginLeft: 12 }} onPress={onPress}>
        {label}
      </Text>
      <Feather name="chevron-right" size={18} color={theme.textMuted} onPress={onPress} />
    </Card>
  );
}

export default function Profile() {
  const theme = useAppTheme();
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const logout = useLogout();

  const [editing, setEditing] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setWeight(String(data.weightKg));
      setHeight(String(data.heightCm));
    }
  }, [data]);

  const handleSave = async () => {
    setApiError(null);
    try {
      await updateProfile.mutateAsync({ weightKg: Number(weight), heightCm: Number(height) });
      setEditing(false);
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={{ color: theme.text, fontSize: 26, fontWeight: "800", marginBottom: 16 }}>Perfil</Text>

          {isLoading || !data ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 40 }} />
          ) : (
            <>
              <Card style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: "800" }}>{data.fullName}</Text>
                <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 2 }}>{data.email}</Text>

                <View style={{ flexDirection: "row", marginTop: 16, gap: 20 }}>
                  <View>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>Sexo</Text>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{data.sex}</Text>
                  </View>
                  <View>
                    <Text style={{ color: theme.textMuted, fontSize: 12 }}>Nacimiento</Text>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{data.birthDate}</Text>
                  </View>
                </View>

                {editing ? (
                  <View style={{ marginTop: 16 }}>
                    <Input label="Peso (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
                    <Input label="Altura (cm)" keyboardType="decimal-pad" value={height} onChangeText={setHeight} />
                    {apiError ? <Text style={{ color: statusColors.alerta, fontSize: 12, marginBottom: 8 }}>{apiError}</Text> : null}
                    <Button label="Guardar cambios" onPress={handleSave} loading={updateProfile.isPending} />
                    <Button label="Cancelar" variant="ghost" onPress={() => setEditing(false)} />
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", marginTop: 16, gap: 20 }}>
                    <View>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>Peso</Text>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{data.weightKg} kg</Text>
                    </View>
                    <View>
                      <Text style={{ color: theme.textMuted, fontSize: 12 }}>Altura</Text>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: "700" }}>{data.heightCm} cm</Text>
                    </View>
                    <Button label="Editar" variant="ghost" onPress={() => setEditing(true)} style={{ marginLeft: "auto", paddingVertical: 0 }} />
                  </View>
                )}
              </Card>

              <Row icon="watch" label="Dispositivos vinculados" onPress={() => router.push("/devices")} />
              <Row icon="wifi" label="Configuración de red local" onPress={() => router.push("/network-settings")} />

              <ThemeSwitcher />

              <Button
                label="Cerrar sesión"
                variant="secondary"
                onPress={async () => {
                  await logout.mutateAsync();
                  router.replace("/(auth)/login");
                }}
                style={{ marginTop: 20 }}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}
