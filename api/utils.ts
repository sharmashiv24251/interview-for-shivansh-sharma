import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { Launch, LaunchFilters } from "./types";

function buildQueryString(filters?: LaunchFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.upcoming !== undefined) {
    // /launches or /launches/upcoming endpoint will handle upcoming
  }
  if (filters.success !== undefined)
    params.append("launch_success", String(filters.success));
  if (filters.start) params.append("start", filters.start);
  if (filters.end) params.append("end", filters.end);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchLaunches(
  filters?: LaunchFilters
): Promise<Launch[]> {
  let route = "/launches";
  if (filters?.upcoming) route = "/launches/upcoming";
  const query = buildQueryString(filters);
  return apiFetch<null, Launch[]>(route + query, "GET", null);
}

export function useLaunches(
  filters?: LaunchFilters,
  options?: UseQueryOptions<Launch[]>
) {
  const keyParts = ["launches", filters || {}] as const;
  return useQuery<Launch[]>({
    queryKey: keyParts,
    queryFn: () => fetchLaunches(filters),
    ...options,
  });
}
