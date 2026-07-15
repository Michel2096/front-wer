/**
 * Vitta — Design tokens
 * -----------------------------------------------------------------------
 * Identidad HealthTech: monitoreo inteligente, confianza clínica, calma.
 * - Azul oscuro (navy) es el color de marca principal y de navegación.
 * - Turquesa es el acento de acción (botones, estados activos, foco).
 * - Blanco suave y verde grisáceo construyen superficies calmadas,
 *   nunca blanco puro ni gris frío de "app genérica".
 */

export const palette = {
  navy: "#2F404F",
  navyDeep: "#1D2A34",
  navyElevated: "#3C5063",
  turquoise: "#3894A1",
  turquoiseLight: "#5CB8C4",
  turquoiseDeep: "#276F79",
  softWhite: "#F0F1EE",
  sage: "#C7DAD3",
  sageDeep: "#A9C2B8",
  white: "#FFFFFF",
};

// Colores de estado — se mantienen reconocibles clínicamente
// (verde=normal, ámbar=atención, rojo=alerta) pero calibrados para
// convivir con el navy/turquesa de marca.
export const statusColors = {
  normal: "#34C97A",
  atencion: "#F2B84B",
  alerta: "#E8555F",
};

export const lightTheme = {
  mode: "light" as const,
  background: palette.softWhite,
  backgroundGradient: [palette.softWhite, palette.softWhite],
  surface: palette.white,
  surfaceAlt: "#E2ECE8",
  surfaceSage: palette.sage,
  onSurfaceSage: palette.navy,
  text: "#1B2A33",
  textMuted: "#5C7282",
  border: "#DCE6E1",
  accent: palette.turquoise,
  accentGradient: [palette.turquoise, palette.turquoiseLight],
  brand: palette.navy,
  brandGradient: [palette.navy, palette.navyElevated],
  tabBar: "#FFFFFFF2",
  shadowColor: "#1B2A33",
};

export const darkTheme = {
  mode: "dark" as const,
  background: palette.navy,
  backgroundGradient: [palette.navyDeep, palette.navy],
  surface: palette.navyElevated,
  surfaceAlt: "#46596B",
  surfaceSage: "#3E5A56",
  onSurfaceSage: palette.softWhite,
  text: palette.softWhite,
  textMuted: "#A9BAC4",
  border: "#44586A",
  accent: palette.turquoiseLight,
  accentGradient: [palette.turquoise, palette.turquoiseLight],
  brand: palette.navyDeep,
  brandGradient: [palette.navyDeep, palette.navy],
  tabBar: "#1D2A34F2",
  shadowColor: "#000000",
};

export type AppTheme = typeof darkTheme;

// Estética "smartwatch Huawei" — se aplica a las vistas de reloj (Inicio,
// Historial, Estadísticas) cuando el dispositivo vinculado es un smartwatch.
// Siempre en paleta blanca, independiente del tema claro/oscuro del sistema,
// igual que el software complementario de Huawei (Health) sobre sus relojes blancos.
export const watchTheme = {
  background: palette.softWhite,
  bezel: "#E4E5E1",
  face: palette.white,
  text: "#101418",
  textMuted: "#6B7278",
  ringTrack: "#E7E8E4",
  crown: "#C9CBC5",
  border: "#E2E3DF",
};

// Identidad de color por métrica — coherente con la paleta de marca,
// manteniendo semántica reconocible (frecuencia cardíaca = rojo coral, etc.)
export const metricColors = {
  heartRate: { solid: "#E8555F", gradient: ["#E8555F", "#F2828A"] },
  spo2: { solid: "#3894A1", gradient: ["#3894A1", "#5CB8C4"] },
  steps: { solid: "#E0A63C", gradient: ["#E0A63C", "#F2C368"] },
  calories: { solid: "#DB7A4A", gradient: ["#DB7A4A", "#F2A874"] },
  distance: { solid: "#34C97A", gradient: ["#34C97A", "#7ADFA4"] },
  sleep: { solid: "#6E7FD1", gradient: ["#6E7FD1", "#9BA8E4"] },
  stress: { solid: "#3894A1", gradient: ["#276F79", "#3894A1"] },
  temperature: { solid: "#F2B84B", gradient: ["#F2B84B", "#F7D08B"] },
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  display: { fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: "800" as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
  metricValue: { fontSize: 28, fontWeight: "800" as const, letterSpacing: -0.5 },
};

// Sombra suave, consistente en toda la app (elevación tipo "premium health app")
export function cardShadow(theme: { shadowColor: string }) {
  return {
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.shadowColor === "#000000" ? 0.35 : 0.08,
    shadowRadius: 18,
    elevation: 6,
  };
}

// Header nativo (react-navigation) tematizado: por defecto renderiza con
// fondo blanco, lo que rompe la identidad visual sobre el GradientBackground.
// Se ancla al primer color del gradiente para que la transición sea invisible.
export function themedHeaderOptions(theme: { backgroundGradient: string[]; text: string }) {
  return {
    headerStyle: { backgroundColor: theme.backgroundGradient[0] },
    headerTintColor: theme.text,
    headerTitleStyle: { color: theme.text, fontWeight: "800" as const },
    headerShadowVisible: false,
  };
}
