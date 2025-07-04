import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiFetch } from "./client";
import { Launch, LaunchFilters } from "./types";

function buildLaunchQuery(filters?: LaunchFilters): Record<string, any> {
  const query: Record<string, any> = {};

  if (filters?.upcoming !== undefined) {
    query.upcoming = filters.upcoming;
  }

  if (filters?.success !== undefined) {
    query.success = filters.success;
  }

  if (filters?.start || filters?.end) {
    query.date_utc = {};
    if (filters.start) {
      query.date_utc.$gte = new Date(filters.start).toISOString();
    }
    if (filters.end) {
      query.date_utc.$lte = new Date(filters.end).toISOString();
    }
  }

  return query;
}

export async function fetchLaunches(
  filters?: LaunchFilters
): Promise<Launch[]> {
  const query = buildLaunchQuery(filters);

  return apiFetch<{ query: any; options: any }, { docs: Launch[] }>(
    "/launches/query",
    "POST",
    {
      query,
      options: {
        sort: { date_utc: "asc" },
        pagination: false, // to get all results in one call
      },
    }
  ).then((res) => res.docs);
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
