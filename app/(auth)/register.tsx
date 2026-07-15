import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Logo } from "@/components/ui/Logo";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRegister } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/services/api";
import { isValidEmail, isValidPassword, isPositiveNumber, passwordsMatch } from "@/utils/validators";
import { Sex } from "@/types/auth";
import { statusColors } from "@/constants/theme";

const sexOptions: { label: string; value: Sex }[] = [
  { label: "Masculino", value: "masculino" },
  { label: "Femenino", value: "femenino" },
  { label: "Otro", value: "otro" },
];

export default function Register() {
  const theme = useAppTheme();
  const register = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState<Sex>("masculino");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setApiError(null);
    const next: Record<string, string> = {};
    if (fullName.trim().length < 2) next.fullName = "Ingresa tu nombre completo";
    if (!isValidEmail(email)) next.email = "Correo inválido";
    if (!isValidPassword(password)) next.password = "Mínimo 8 caracteres";
    if (!passwordsMatch(password, confirmPassword)) next.confirmPassword = "Las contraseñas no coinciden";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) next.birthDate = "Formato AAAA-MM-DD";
    if (!isPositiveNumber(weight)) next.weight = "Peso inválido";
    if (!isPositiveNumber(height)) next.height = "Altura inválida";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await register.mutateAsync({
        fullName,
        email,
        password,
        confirmPassword,
        birthDate,
        sex,
        weightKg: Number(weight),
        heightCm: Number(height),
      });
      router.replace("/(auth)/login");
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
            <Logo size={48} tone="color" style={{ marginBottom: 24 }} />
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "800" }}>Crea tu cuenta</Text>
            <Text style={{ color: theme.textMuted, fontSize: 15, marginTop: 6, marginBottom: 28 }}>
              Configura tu perfil de salud en Vitta
            </Text>

            <Input label="Nombre completo" value={fullName} onChangeText={setFullName} error={errors.fullName} />
            <Input
              label="Correo electrónico"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Input label="Contraseña" secureTextEntry value={password} onChangeText={setPassword} error={errors.password} />
            <Input
              label="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />
            <Input
              label="Fecha de nacimiento (AAAA-MM-DD)"
              placeholder="2000-01-31"
              value={birthDate}
              onChangeText={setBirthDate}
              error={errors.birthDate}
            />

            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>Sexo</Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {sexOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSex(opt.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    backgroundColor: sex === opt.value ? theme.accent : theme.surface,
                  }}
                >
                  <Text style={{ color: sex === opt.value ? "#FFFFFF" : theme.text, fontWeight: "600" }}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input label="Peso (kg)" keyboardType="decimal-pad" value={weight} onChangeText={setWeight} error={errors.weight} />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="Altura (cm)" keyboardType="decimal-pad" value={height} onChangeText={setHeight} error={errors.height} />
              </View>
            </View>

            {apiError ? <Text style={{ color: statusColors.alerta, fontSize: 13, marginBottom: 12 }}>{apiError}</Text> : null}

            <Button label="Registrarme" onPress={handleSubmit} loading={register.isPending} style={{ marginTop: 8 }} />
            <Button label="Ya tengo cuenta" variant="ghost" onPress={() => router.back()} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}
