import { useQuery } from "@tanstack/react-query";
import { healthService } from "@/services/healthService";
import { HistoryRange } from "@/types/health";

export function useHealthHistory(range: HistoryRange) {
  return useQuery({
    queryKey: ["health-history", range],
    queryFn: () => healthService.history(range),
  });
}

export function useHealthStatistics(range: HistoryRange) {
  return useQuery({
    queryKey: ["health-statistics", range],
    queryFn: () => healthService.statistics(range),
  });
}
