import { apiClient } from "./httpClient";
import { ApiResponse, DashboardSummaryNasabah, DashboardStatsAdmin } from "./types";

export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummaryNasabah>> {
  return apiClient.get<DashboardSummaryNasabah>("/api/v1/dashboard/summary");
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStatsAdmin>> {
  return apiClient.get<DashboardStatsAdmin>("/api/v1/dashboard/stats");
}
