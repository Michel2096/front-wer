import client from "@/services/api";
import { ENDPOINTS } from "@/constants/config";
import {
  DashboardData,
  HistoryRange,
  HistoryResponse,
  StatisticsResponse,
} from "@/types/health";
import { ApiEnvelope } from "@/types/api";
import {
  ApiDashboardResponse,
  ApiHealthMetric,
  ApiHistoryResponse,
  ApiStatisticsResponse,
  mapHealthMetricToDashboard,
  mapHistoryToApi,
  mapStatisticsToApi,
} from "@/services/healthMapper";

export const healthService = {
  async dashboard(): Promise<DashboardData> {
    const { data } = await client.get<ApiEnvelope<ApiDashboardResponse>>(ENDPOINTS.dashboard);
    return mapHealthMetricToDashboard(data.data.current_metric);
  },

  async current(): Promise<DashboardData> {
    const { data } = await client.get<ApiEnvelope<ApiHealthMetric>>(ENDPOINTS.healthCurrent);
    return mapHealthMetricToDashboard(data.data);
  },

  async history(range: HistoryRange): Promise<HistoryResponse> {
    const { data } = await client.get<ApiEnvelope<ApiHistoryResponse>>(ENDPOINTS.healthHistory, {
      params: { range },
    });
    return mapHistoryToApi(range, data.data);
  },

  async statistics(range: HistoryRange): Promise<StatisticsResponse> {
    const { data } = await client.get<ApiEnvelope<ApiStatisticsResponse>>(
      ENDPOINTS.healthStatistics,
      { params: { range } }
    );
    return mapStatisticsToApi(data.data);
  },
};
