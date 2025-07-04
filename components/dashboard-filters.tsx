"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar, ChevronLeft, ChevronRight, X, Filter } from "lucide-react";

interface DashboardFiltersProps {
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onStatusFilterChange: (value: string) => void;
}

export function DashboardFilters({
  dateRange,
  onDateRangeChange,
  onStatusFilterChange,
}: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const urlFrom = searchParams.get("from");
  const urlTo = searchParams.get("to");
  const urlStatus = searchParams.get("status") || "all";
  const urlPeriod = searchParams.get("period") || "all";

  // Parse dates from URL if present
  const initialFrom = urlFrom ? new Date(urlFrom) : undefined;
  const initialTo = urlTo ? new Date(urlTo) : undefined;

  const [selectedPeriod, setSelectedPeriod] = useState(urlPeriod);
  const [currentDate, setCurrentDate] = useState(initialFrom || new Date());
  const [selectedRange, setSelectedRange] = useState<{
    from?: Date;
    to?: Date;
  }>({ from: initialFrom, to: initialTo });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const presetPeriods = [
    "Past week",
    "Past month",
    "Past 3 months",
    "Past 6 months",
    "Past year",
    "Past 2 years",
  ];

  // Responsive: detect small screen (phone)
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // sm breakpoint in tailwind
    setIsSmallScreen(mediaQuery.matches);

    function handler(e: MediaQueryListEvent) {
      setIsSmallScreen(e.matches);
    }
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Update URL with filter states
  function updateUrl({
    from,
    to,
    status,
    period,
  }: {
    from?: Date;
    to?: Date;
    status?: string;
    period?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    if (from) {
      params.set("from", from.toISOString().slice(0, 10));
    } else {
      params.delete("from");
    }
    if (to) {
      params.set("to", to.toISOString().slice(0, 10));
    } else {
      params.delete("to");
    }
    if (period) {
      params.set("period", period);
    } else {
      params.delete("period");
    }
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.replace(`?${params.toString()}`);
  }

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    const now = new Date();
    let from = new Date();

    switch (period) {
      case "Past week":
        from.setDate(now.getDate() - 7);
        break;
      case "Past month":
        from.setMonth(now.getMonth() - 1);
        break;
      case "Past 3 months":
        from.setMonth(now.getMonth() - 3);
        break;
      case "Past 6 months":
        from.setMonth(now.getMonth() - 6);
        break;
      case "Past year":
        from.setFullYear(now.getFullYear() - 1);
        break;
      case "Past 2 years":
        from.setFullYear(now.getFullYear() - 2);
        break;
    }

    const range = { from, to: now };
    setSelectedRange(range);
    onDateRangeChange(range);
    updateUrl({
      from,
      to: now,
      status: searchParams.get("status") || "all",
      period,
    });
    setIsDialogOpen(false);
  };

  const handleDateClick = (day: number, monthOffset: number) => {
    const clickedDate = new Date(currentDate);
    clickedDate.setMonth(currentDate.getMonth() + monthOffset);
    clickedDate.setDate(day);

    let newRange;
    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      // Start new selection
      newRange = { from: clickedDate, to: undefined };
    } else if (selectedRange.from && !selectedRange.to) {
      // Complete the range
      const from = selectedRange.from;
      const to = clickedDate;

      // Ensure from is before to
      newRange = from <= to ? { from, to } : { from: to, to: from };
      setIsDialogOpen(false); // Close dialog on range completion
    }

    if (newRange) {
      setSelectedRange(newRange);
      setSelectedPeriod("Custom Range");
      onDateRangeChange(newRange);
      updateUrl({
        ...newRange,
        status: searchParams.get("status") || "all",
        period: "Custom Range",
      });
    }
  };

  const handleClearDate = () => {
    const newRange = { from: undefined, to: undefined };
    setSelectedRange(newRange);
    setSelectedPeriod("all");
    onDateRangeChange(newRange);
    updateUrl({
      from: undefined,
      to: undefined,
      status: searchParams.get("status") || "all",
      period: "all",
    });
    setIsDialogOpen(false);
  };

  const isDateInRange = (day: number, monthOffset: number) => {
    if (!selectedRange.from) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);
    checkDate.setHours(0, 0, 0, 0);

    if (selectedRange.from && selectedRange.to) {
      const from = new Date(selectedRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(selectedRange.to);
      to.setHours(0, 0, 0, 0);
      return checkDate >= from && checkDate <= to;
    } else if (selectedRange.from) {
      const from = new Date(selectedRange.from);
      from.setHours(0, 0, 0, 0);
      return checkDate.getTime() === from.getTime();
    }

    return false;
  };

  const isDateStart = (day: number, monthOffset: number) => {
    if (!selectedRange.from) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);
    checkDate.setHours(0, 0, 0, 0);

    const from = new Date(selectedRange.from);
    from.setHours(0, 0, 0, 0);
    return checkDate.getTime() === from.getTime();
  };

  const isDateEnd = (day: number, monthOffset: number) => {
    if (!selectedRange.to) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);
    checkDate.setHours(0, 0, 0, 0);

    const to = new Date(selectedRange.to);
    to.setHours(0, 0, 0, 0);
    return checkDate.getTime() === to.getTime();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const displayDate = new Date(currentDate);
    displayDate.setMonth(currentDate.getMonth() + monthOffset);

    const daysInMonth = getDaysInMonth(displayDate);
    const firstDayOfMonth = getFirstDayOfMonth(displayDate);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${monthOffset}-${i}`} className="w-8 h-8"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const inRange = isDateInRange(day, monthOffset);
      const isStart = isDateStart(day, monthOffset);
      const isEnd = isDateEnd(day, monthOffset);

      days.push(
        <button
          key={`${monthOffset}-${day}`}
          onClick={() => handleDateClick(day, monthOffset)}
          className={`w-8 h-8 text-sm rounded flex items-center justify-center transition-all duration-200 ease-out transform hover:scale-105 ${
            inRange
              ? isStart || isEnd
                ? "bg-blue-600 text-white scale-110"
                : "bg-blue-100 text-blue-900"
              : "hover:bg-gray-100"
          }`}
          type="button"
          aria-pressed={inRange}
          aria-label={`Select ${
            monthNames[displayDate.getMonth()]
          } ${day}, ${displayDate.getFullYear()}`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4 min-w-[280px]">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={() => navigateMonth(-1)}
              aria-label="Previous month"
              type="button"
              className="p-1 rounded-full hover:bg-gray-200 transition-transform hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {monthNames[displayDate.getMonth()]}
            </span>
            <span className="text-sm text-gray-600">
              {displayDate.getFullYear()}
            </span>
          </div>
          {monthOffset === (isSmallScreen ? 0 : 1) && (
            <button
              onClick={() => navigateMonth(1)}
              aria-label="Next month"
              type="button"
              className="p-1 rounded-full hover:bg-gray-200 transition-transform hover:scale-110"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={`${monthOffset}-header-${day}`}
              className="w-8 h-8 text-xs text-gray-500 flex items-center justify-center font-medium select-none"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const handleStatusChange = (value: string) => {
    onStatusFilterChange(value);
    updateUrl({
      from: selectedRange.from,
      to: selectedRange.to,
      status: value,
      period: selectedPeriod,
    });
  };

  useEffect(() => {
    if (initialFrom || initialTo) {
      onDateRangeChange({ from: initialFrom, to: initialTo });
    }
    if (urlStatus) {
      onStatusFilterChange(urlStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatPeriodLabel = () => {
    if (
      selectedPeriod === "Custom Range" &&
      selectedRange.from &&
      selectedRange.to
    ) {
      return `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`;
    } else if (selectedPeriod === "Custom Range" && selectedRange.from) {
      return `${selectedRange.from.toLocaleDateString()} - ...`;
    }
    return selectedPeriod === "all" ? "Select Date" : selectedPeriod;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:justify-between">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full sm:w-auto justify-start text-left font-normal hover:bg-transparent"
            aria-label="Open calendar filter"
            type="button"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatPeriodLabel()}
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 overflow-hidden sm:min-w-[700px]">
          <div className="flex border-b items-center justify-between p-4">
            <h3 className="text-lg font-medium">Select Date Range</h3>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="bg-gray-50 p-4 border-r min-w-[140px]">
              <div className="space-y-1">
                {presetPeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodSelect(period)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors duration-200 ${
                      selectedPeriod === period
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    type="button"
                  >
                    {period}
                  </button>
                ))}
                <button
                  key="clear"
                  onClick={handleClearDate}
                  className="block w-full text-left text-sm px-3 py-2 rounded text-red-600 hover:bg-red-50 transition-colors duration-200"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto mx-auto">
              {renderCalendar(0)}
              {!isSmallScreen && renderCalendar(1)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Select onValueChange={handleStatusChange} value={urlStatus}>
        <SelectTrigger className="w-full sm:w-auto bg-transparent border-0 shadow-none hover:bg-transparent focus:ring-0 focus:ring-offset-0 p-2">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Launches" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Launches</SelectItem>
          <SelectItem value="success">Successful Launches</SelectItem>
          <SelectItem value="failed">Failed Launches</SelectItem>
          <SelectItem value="upcoming">Upcoming Launches</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
