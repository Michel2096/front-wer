import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { healthService } from "@/services/healthService";
import { connectSocket } from "@/services/socket";
import { SOCKET_EVENTS } from "@/constants/config";
import { DashboardData } from "@/types/health";
import { ApiHealthMetric, mapHealthMetricToDashboard } from "@/services/healthMapper";

interface HealthUpdatePayload {
  success: boolean;
  data: ApiHealthMetric;
}

export function useDashboard() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => healthService.dashboard(),
  });

  useEffect(() => {
    let active = true;

    connectSocket().then((socket) => {
      if (!active) return;

      // El backend emite "health_update" con la última lectura biométrica
      // (ver health_api/services/simulator_service.py); no existe un evento
      // "dashboard_update" en el servidor.
      const onHealthUpdate = (payload: HealthUpdatePayload) => {
        if (!payload?.data) return;
        queryClient.setQueryData<DashboardData>(["dashboard"], mapHealthMetricToDashboard(payload.data));
      };

      socket.on(SOCKET_EVENTS.healthUpdate, onHealthUpdate);

      return () => {
        socket.off(SOCKET_EVENTS.healthUpdate, onHealthUpdate);
      };
    });

    return () => {
      active = false;
    };
  }, [queryClient]);

  return query;
}
