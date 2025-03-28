"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateRangeAtom } from "@/lib/atom";
import { useAtom } from "jotai";
import { toast } from "sonner";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [dateRange, setDateRange] = useAtom(dateRangeAtom);
  const [tempDateRange, setTempDateRange] = React.useState<
    DateRange | undefined
  >(dateRange);

  // Extract time from existing dateRange or use defaults
  const [fromTime, setFromTime] = React.useState<string>(
    dateRange?.from ? format(dateRange.from, "HH:mm") : "00:00"
  );
  const [toTime, setToTime] = React.useState<string>(
    dateRange?.to ? format(dateRange.to, "HH:mm") : "23:59"
  );

  const handleSaveDateRange = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      const fromDateTime = new Date(tempDateRange.from);
      const toDateTime = new Date(tempDateRange.to);

      const [fromHours, fromMinutes] = fromTime.split(":").map(Number);
      const [toHours, toMinutes] = toTime.split(":").map(Number);

      fromDateTime.setHours(fromHours, fromMinutes);
      toDateTime.setHours(toHours, toMinutes);

      const updatedDateRange = {
        from: fromDateTime,
        to: toDateTime,
      };

      setDateRange(updatedDateRange);
      toast.success(
        <div className="flex flex-col">
          <div className="text-md font-medium">Date Range Saved</div>
          <div className="text-xs text-muted-foreground">
            Selected: {format(fromDateTime, "LLL dd, yyyy hh:mm a")} -
            {format(toDateTime, "LLL dd, yyyy hh:mm a")}
          </div>
        </div>
      );
    } else {
      toast.error(
        <div className="flex flex-col">
          <div className="text-md font-medium">Incomplete Date Range</div>
          <div className="text-xs text-muted-foreground">
            Please select both a start and end date.
          </div>
        </div>
      );
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[350px] justify-start text-left font-normal",
              !tempDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {tempDateRange?.from ? (
              tempDateRange.to ? (
                <>
                  {format(tempDateRange.from, "LLL dd, yyyy hh:mm a")} -{" "}
                  {format(tempDateRange.to, "LLL dd, yyyy hh:mm a")}
                </>
              ) : (
                format(tempDateRange.from, "LLL dd, yyyy hh:mm a")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={tempDateRange?.from}
              selected={tempDateRange}
              onSelect={setTempDateRange}
              numberOfMonths={2}
            />
            {tempDateRange?.from && tempDateRange?.to && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">From Time</label>
                  <Input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">To Time</label>
                  <Input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSaveDateRange}
                disabled={!tempDateRange?.from || !tempDateRange?.to}
                className="mt-2"
              >
                Save Date Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
