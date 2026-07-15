import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useLogin } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/services/api";
import { isValidEmail } from "@/utils/validators";
import { statusColors } from "@/constants/theme";

export default function Login() {
  const theme = useAppTheme();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setApiError(null);
    const errors: typeof fieldErrors = {};
    if (!isValidEmail(email)) errors.email = "Ingresa un correo válido";
    if (password.length === 0) errors.password = "Ingresa tu contraseña";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await login.mutateAsync({ email, password });
      router.replace("/device-selection");
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 40, justifyContent: "center" }}
            showsVerticalScrollIndicator={false}
          >
            <Logo size={56} tone="color" style={{ marginBottom: 28 }} />

            <Text style={{ color: theme.text, fontSize: 30, fontWeight: "800" }}>Bienvenido de nuevo</Text>
            <Text style={{ color: theme.textMuted, fontSize: 15, marginTop: 6, marginBottom: 32 }}>
              Inicia sesión para ver tu salud en tiempo real
            </Text>

            <Input
              label="Correo electrónico"
              placeholder="tu@correo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={fieldErrors.email}
            />
            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={fieldErrors.password}
            />

            {apiError ? (
              <Text style={{ color: statusColors.alerta, fontSize: 13, marginBottom: 12 }}>{apiError}</Text>
            ) : null}

            <Button label="Iniciar sesión" onPress={handleSubmit} loading={login.isPending} style={{ marginTop: 8 }} />

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
              <Text style={{ color: theme.textMuted }}>¿No tienes cuenta? </Text>
              <Button label="Regístrate" variant="ghost" onPress={() => router.push("/(auth)/register")} style={{ paddingVertical: 0 }} />
            </View>

            <Button
              label="Vincular como reloj (escanear QR)"
              variant="ghost"
              onPress={() => router.push("/watch-scan")}
              style={{ marginTop: 4 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
