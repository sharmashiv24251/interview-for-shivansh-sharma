"use client";

import { useState } from "react";
import type { LaunchFilters } from "@/api/types";
import { useLaunches } from "@/api/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardFilters } from "@/components/dashboard-filters";
import { LaunchesTable } from "@/components/launches-table";
import { LaunchesCards } from "@/components/launches-cards";
import { DashboardPagination } from "@/components/dashboard-pagination";
import { ErrorBoundary } from "@/components/error-boundary";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LaunchesDashboard() {
  const [filters, setFilters] = useState<LaunchFilters>({});
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const isMobile = useIsMobile();

  const { data: launches, isLoading, error } = useLaunches(filters);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    setFilters((f) => ({
      ...f,
      start: range.from?.toISOString().slice(0, 10),
      end: range.to?.toISOString().slice(0, 10),
    }));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters((f) => ({
      ...f,
      success:
        value === "success" ? true : value === "failed" ? false : undefined,
      upcoming: value === "upcoming" ? true : undefined,
    }));
    setCurrentPage(1);
  };

  // Pagination logic
  const totalItems = launches?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaunches = launches?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <DashboardHeader />

          <DashboardFilters
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onStatusFilterChange={handleStatusFilterChange}
          />

          {error ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-red-600 mb-2">Error loading launches</div>
              <div className="text-gray-500 text-sm">{error.message}</div>
            </div>
          ) : isMobile ? (
            <LaunchesCards
              launches={currentLaunches}
              isLoading={isLoading}
              startIndex={startIndex}
            />
          ) : (
            <LaunchesTable
              launches={currentLaunches}
              isLoading={isLoading}
              startIndex={startIndex}
            />
          )}

          {totalPages > 1 && !error && (
            <DashboardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
