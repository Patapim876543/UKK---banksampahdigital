import { apiClient } from "./httpClient";
import { ApiResponse } from "./types";

export async function seedSampleData(): Promise<ApiResponse<{ message: string; count?: any }>> {
  return apiClient.post<{ message: string; count?: any }>("/api/v1/seed", {});
}
