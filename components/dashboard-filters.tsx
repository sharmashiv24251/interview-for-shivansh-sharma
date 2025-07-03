"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{
    from?: Date;
    to?: Date;
  }>({ from: undefined, to: undefined });

  const presetPeriods = [
    "Past week",
    "Past month",
    "Past 3 months",
    "Past 6 months",
    "Past year",
    "Past 2 years",
  ];

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
  };

  const handleDateClick = (day: number, monthOffset: number) => {
    const clickedDate = new Date(currentDate);
    clickedDate.setMonth(currentDate.getMonth() + monthOffset);
    clickedDate.setDate(day);

    if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
      // Start new selection
      const newRange = { from: clickedDate, to: undefined };
      setSelectedRange(newRange);
      setSelectedPeriod("Custom Range");
      onDateRangeChange(newRange);
    } else if (selectedRange.from && !selectedRange.to) {
      // Complete the range
      const from = selectedRange.from;
      const to = clickedDate;

      // Ensure from is before to
      const range = from <= to ? { from, to } : { from: to, to: from };
      setSelectedRange(range);
      onDateRangeChange(range);
    }
  };

  const isDateInRange = (day: number, monthOffset: number) => {
    if (!selectedRange.from) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);

    if (selectedRange.from && selectedRange.to) {
      return checkDate >= selectedRange.from && checkDate <= selectedRange.to;
    } else if (selectedRange.from) {
      return checkDate.getTime() === selectedRange.from.getTime();
    }

    return false;
  };

  const isDateStart = (day: number, monthOffset: number) => {
    if (!selectedRange.from) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);

    return checkDate.getTime() === selectedRange.from.getTime();
  };

  const isDateEnd = (day: number, monthOffset: number) => {
    if (!selectedRange.to) return false;

    const checkDate = new Date(currentDate);
    checkDate.setMonth(currentDate.getMonth() + monthOffset);
    checkDate.setDate(day);

    return checkDate.getTime() === selectedRange.to.getTime();
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

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const inRange = isDateInRange(day, monthOffset);
      const isStart = isDateStart(day, monthOffset);
      const isEnd = isDateEnd(day, monthOffset);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day, monthOffset)}
          className={`w-8 h-8 text-sm rounded flex items-center justify-center transition-colors ${
            inRange
              ? isStart || isEnd
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-900"
              : "hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button onClick={() => navigateMonth(-1)}>
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
          {monthOffset === 1 && (
            <button onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="w-8 h-8 text-xs text-gray-500 flex items-center justify-center font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:justify-between">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-[200px] justify-start text-left font-normal bg-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedPeriod === "Custom Range" &&
            selectedRange.from &&
            selectedRange.to
              ? `${selectedRange.from.toLocaleDateString()} - ${selectedRange.to.toLocaleDateString()}`
              : selectedPeriod === "Custom Range" && selectedRange.from
              ? `${selectedRange.from.toLocaleDateString()} - ...`
              : selectedPeriod}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Left sidebar with preset periods */}
            <div className="bg-gray-50 p-4 border-r">
              <div className="space-y-1">
                {presetPeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodSelect(period)}
                    className={`block w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100 ${
                      selectedPeriod === period
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar months */}
            <div className="flex">
              {renderCalendar(0)}
              {renderCalendar(1)}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-white">
          <SelectValue placeholder="All Launches" />
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
