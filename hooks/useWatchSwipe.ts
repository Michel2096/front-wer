import { useMemo, useRef } from "react";
import { PanResponder } from "react-native";
import { router, usePathname } from "expo-router";

// Un smartwatch no tiene barra de tabs: se navega deslizando el dedo entre
// pantallas. Este orden define esas "páginas" y hacia dónde se mueve cada
// swipe (ver _layout.tsx, que oculta la barra en modo reloj).
const ORDER = ["dashboard", "history", "statistics", "profile"] as const;

export function useWatchSwipe() {
  const pathname = usePathname();

  const currentIndex = useMemo(() => {
    const name = pathname.split("/").filter(Boolean).pop();
    const idx = ORDER.indexOf(name as (typeof ORDER)[number]);
    return idx === -1 ? 0 : idx;
  }, [pathname]);

  // PanResponder se crea una sola vez (useRef); sin este ref, sus callbacks
  // quedarían con el "currentIndex" de aquel primer render (closure vieja).
  const indexRef = useRef(currentIndex);
  indexRef.current = currentIndex;

  const goToIndex = (index: number) => {
    const next = ORDER[(index + ORDER.length) % ORDER.length];
    router.replace(`/(tabs)/${next}` as never);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.5,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx <= -40) goToIndex(indexRef.current + 1);
        else if (gesture.dx >= 40) goToIndex(indexRef.current - 1);
      },
    })
  ).current;

  return {
    currentIndex,
    pageCount: ORDER.length,
    goToIndex,
    panHandlers: panResponder.panHandlers,
  };
}
