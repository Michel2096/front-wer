import React, { useEffect } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Logo } from "@/components/ui/Logo";
import { palette } from "@/constants/theme";
import { useSession } from "@/hooks/useAuth";

export default function Splash() {
  const { data, isSuccess, isError } = useSession();
  const pulse = useSharedValue(0.9);
  const ring = useSharedValue(0.6);

  useEffect(() => {
    pulse.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 550, easing: Easing.out(Easing.ease) }),
          withTiming(0.96, { duration: 550, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) })
        ),
        -1,
        true
      )
    );
    ring.value = withDelay(
      200,
      withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false)
    );
  }, []);

  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 + ring.value * 0.55 }],
    opacity: 0.35 * (1 - ring.value),
  }));

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        if (data?.authenticated) {
          router.replace("/(tabs)/dashboard");
        } else {
          router.replace("/(auth)/login");
        }
      }, 700);
      return () => clearTimeout(timer);
    }
    if (isError) {
      const timer = setTimeout(() => router.replace("/(auth)/login"), 700);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, data]);

  return (
    <LinearGradient
      colors={[palette.navyDeep, palette.navy]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 90,
            borderWidth: 1.5,
            borderColor: palette.turquoiseLight,
          },
          ringStyle,
        ]}
      />
      <Animated.View style={markStyle}>
        <Logo size={112} tone="light" showWordmark={false} />
      </Animated.View>
      <Animated.View entering={FadeIn.duration(700).delay(350)}>
        <Text
          style={{
            color: palette.softWhite,
            fontSize: 30,
            fontWeight: "800",
            letterSpacing: 0.5,
            marginTop: 28,
          }}
        >
          Vitta
        </Text>
        <Text style={{ color: palette.turquoiseLight, fontSize: 13, marginTop: 6, textAlign: "center" }}>
          Tu bienestar, en tiempo real
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
