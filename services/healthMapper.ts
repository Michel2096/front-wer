import {
  DashboardData,
  HistoryPoint,
  HistoryRange,
  HistoryResponse,
  MetricStatistic,
  MetricStatus,
  StatisticsResponse,
} from "@/types/health";

/**
 * La API Flask expone las métricas biométricas en snake_case y sin
 * envolver cada valor en {value, unit, status, updatedAt} (ver
 * health_api/models/health_metric.py). Este módulo traduce esas formas
 * al contrato que consume la UI, igual que userMapper.ts para el perfil.
 */

export interface ApiHealthMetric {
  id: string;
  heart_rate: number | null;
  oxygen: number | null;
  steps: number | null;
  calories: number | null;
  distance: number | null;
  sleep: number | null;
  stress: number | null;
  temperature: number | null;
  created_at: string;
}

export interface ApiDashboardResponse {
  current_metric: ApiHealthMetric | null;
}

export interface ApiHistoryResponse {
  items: ApiHealthMetric[];
}

export interface ApiStatisticsResponse {
  avg_heart_rate: number | null;
  min_heart_rate: number | null;
  max_heart_rate: number | null;
  avg_oxygen: number | null;
  min_oxygen: number | null;
  max_oxygen: number | null;
  avg_steps: number | null;
  min_steps: number | null;
  max_steps: number | null;
  avg_calories: number | null;
  min_calories: number | null;
  max_calories: number | null;
  avg_distance: number | null;
  min_distance: number | null;
  max_distance: number | null;
  avg_sleep: number | null;
  min_sleep: number | null;
  max_sleep: number | null;
  avg_stress: number | null;
  min_stress: number | null;
  max_stress: number | null;
  avg_temperature: number | null;
  min_temperature: number | null;
  max_temperature: number | null;
}

function heartRateStatus(v: number): MetricStatus {
  if (v < 50 || v > 120) return "alerta";
  if (v < 60 || v > 100) return "atencion";
  return "normal";
}

function spo2Status(v: number): MetricStatus {
  if (v < 90) return "alerta";
  if (v < 95) return "atencion";
  return "normal";
}

function sleepStatus(v: number): MetricStatus {
  if (v < 4) return "alerta";
  if (v < 6) return "atencion";
  return "normal";
}

function stressStatus(v: number): MetricStatus {
  if (v > 85) return "alerta";
  if (v > 60) return "atencion";
  return "normal";
}

function temperatureStatus(v: number): MetricStatus {
  if (v >= 38 || v < 35.5) return "alerta";
  if (v >= 37.5 || v < 36) return "atencion";
  return "normal";
}

export function mapHealthMetricToDashboard(metric: ApiHealthMetric | null): DashboardData {
  const updatedAt = metric?.created_at ?? new Date().toISOString();
  const heartRate = metric?.heart_rate ?? 0;
  const oxygen = metric?.oxygen ?? 0;
  const sleep = metric?.sleep ?? 0;
  const stress = metric?.stress ?? 0;
  const temperature = metric?.temperature ?? 0;

  return {
    heartRate: { value: heartRate, unit: "bpm", status: metric ? heartRateStatus(heartRate) : "normal", updatedAt },
    spo2: { value: oxygen, unit: "%", status: metric ? spo2Status(oxygen) : "normal", updatedAt },
    steps: { value: metric?.steps ?? 0, unit: "pasos", status: "normal", updatedAt },
    calories: { value: metric?.calories ?? 0, unit: "kcal", status: "normal", updatedAt },
    distance: { value: metric?.distance ?? 0, unit: "km", status: "normal", updatedAt },
    sleep: { value: sleep, unit: "h", status: metric ? sleepStatus(sleep) : "normal", updatedAt },
    stress: { value: stress, unit: "%", status: metric ? stressStatus(stress) : "normal", updatedAt },
    temperature: { value: temperature, unit: "°C", status: metric ? temperatureStatus(temperature) : "normal", updatedAt },
  };
}

export function mapHistoryToApi(range: HistoryRange, apiHistory: ApiHistoryResponse): HistoryResponse {
  // El backend devuelve los items más recientes primero; para graficar una
  // tendencia cronológica se invierte a orden ascendente.
  const points: HistoryPoint[] = [...apiHistory.items].reverse().map((m) => ({
    timestamp: m.created_at,
    heartRate: m.heart_rate ?? 0,
    spo2: m.oxygen ?? 0,
    steps: m.steps ?? 0,
    calories: m.calories ?? 0,
    distance: m.distance ?? 0,
    sleep: m.sleep ?? 0,
    stress: m.stress ?? 0,
    temperature: m.temperature ?? 0,
  }));

  return { range, points };
}

function stat(average: number | null, min: number | null, max: number | null): MetricStatistic {
  return { average: average ?? 0, min: min ?? 0, max: max ?? 0, trend: "stable" };
}

export function mapStatisticsToApi(s: ApiStatisticsResponse): StatisticsResponse {
  return {
    heartRate: stat(s.avg_heart_rate, s.min_heart_rate, s.max_heart_rate),
    spo2: stat(s.avg_oxygen, s.min_oxygen, s.max_oxygen),
    steps: stat(s.avg_steps, s.min_steps, s.max_steps),
    calories: stat(s.avg_calories, s.min_calories, s.max_calories),
    distance: stat(s.avg_distance, s.min_distance, s.max_distance),
    sleep: stat(s.avg_sleep, s.min_sleep, s.max_sleep),
    stress: stat(s.avg_stress, s.min_stress, s.max_stress),
    temperature: stat(s.avg_temperature, s.min_temperature, s.max_temperature),
  };
}
