import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useWatchMode } from "@/hooks/useWatchMode";
import { cardShadow, watchTheme } from "@/constants/theme";

export default function TabsLayout() {
  const theme = useAppTheme();
  const isWatchMode = useWatchMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isWatchMode ? watchTheme.text : theme.accent,
        tabBarInactiveTintColor: isWatchMode ? "#B9BBB5" : theme.textMuted,
        tabBarStyle: isWatchMode
          ? {
              backgroundColor: watchTheme.face,
              borderTopWidth: 1,
              borderTopColor: watchTheme.border,
              height: 88,
              paddingTop: 10,
            }
          : {
              backgroundColor: theme.tabBar,
              borderTopWidth: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: 88,
              paddingTop: 10,
              ...cardShadow(theme),
            },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Feather name="activity" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color, size }) => <Feather name="clock" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
