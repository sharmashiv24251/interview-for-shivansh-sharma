"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon } from "lucide-react";

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
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-[200px] justify-start text-left font-normal bg-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {dateRange.from.toLocaleDateString()} -{" "}
                  {dateRange.to.toLocaleDateString()}
                </>
              ) : (
                dateRange.from.toLocaleDateString()
              )
            ) : (
              <span>Past 6 Months</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange.from}
            // ts-ignore-next-line expect error
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
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
