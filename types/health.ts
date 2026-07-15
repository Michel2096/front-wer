export type MetricStatus = "normal" | "atencion" | "alerta";

export interface MetricReading {
  value: number;
  unit: string;
  status: MetricStatus;
  updatedAt: string;
}

export interface DashboardData {
  heartRate: MetricReading;
  spo2: MetricReading;
  steps: MetricReading;
  calories: MetricReading;
  distance: MetricReading;
  sleep: MetricReading;
  stress: MetricReading;
  temperature: MetricReading;
}

export type HistoryRange = "daily" | "weekly" | "monthly";

export interface HistoryPoint {
  timestamp: string;
  heartRate: number;
  spo2: number;
  steps: number;
  calories: number;
  distance: number;
  sleep: number;
  stress: number;
  temperature: number;
}

export interface HistoryResponse {
  range: HistoryRange;
  points: HistoryPoint[];
}

export interface MetricStatistic {
  average: number;
  max: number;
  min: number;
  trend: "up" | "down" | "stable";
}

export interface StatisticsResponse {
  heartRate: MetricStatistic;
  spo2: MetricStatistic;
  steps: MetricStatistic;
  calories: MetricStatistic;
  distance: MetricStatistic;
  sleep: MetricStatistic;
  stress: MetricStatistic;
  temperature: MetricStatistic;
}
