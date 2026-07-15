import React from "react";
import { Pressable, View } from "react-native";
import { watchTheme } from "@/constants/theme";

interface WatchPageDotsProps {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}

// Puntos del "bisel": reemplazan la barra de tabs en modo reloj. Además de
// indicar en qué pantalla estás, son tocables para saltar directo, como
// alternativa a deslizar.
export function WatchPageDots({ count, current, onSelect }: WatchPageDotsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        marginBottom: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Pressable
          key={i}
          hitSlop={10}
          onPress={() => onSelect(i)}
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current ? watchTheme.text : watchTheme.ringTrack,
          }}
        />
      ))}
    </View>
  );
}
