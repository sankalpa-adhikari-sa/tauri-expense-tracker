import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { endOfDay, format, startOfDay, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";

const LOCAL_STORAGE_KEY = "dateRange";

export const dateRangeAtom = atomWithStorage<DateRange | undefined>(
  LOCAL_STORAGE_KEY,
  {
    from: startOfDay(subMonths(new Date(), 1)),
    to: endOfDay(new Date()),
  }
);

export const formattedDateRangeAtom = atom((get) => {
  const dateRange = get(dateRangeAtom);
  return {
    displayText: `${
      dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Start date"
    } — ${dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "End date"}`,
    from: dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "",
    to: dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "",
  };
});
