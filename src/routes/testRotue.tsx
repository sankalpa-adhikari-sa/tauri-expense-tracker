import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/data-table";
import { transactionColumns } from "./-components/tables/transactionColumn";

export const Route = createFileRoute("/testRotue")({
  component: RouteComponent,
});

function RouteComponent() {
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    from: subMonths(today, 1),
    to: today,
  });
  const [activeTab, setActiveTab] = useState("from");
  const TransactionDataM = [
    {
      name: "Test",
      amount: 25,
      type: "expense",
      category: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      source: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      event: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      created_at: "2025-03-20T19:09:26.517362Z",
      user_id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
    },
    {
      name: "Test",
      amount: 25,
      type: "income",
      category: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      source: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      event: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      created_at: "2025-03-20T19:09:26.517362Z",
      user_id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
    },
    {
      name: "Test",
      amount: 25,
      type: "expense",
      category: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      source: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      event: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      created_at: "2025-03-20T19:09:26.517362Z",
      user_id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
    },
    {
      name: "Test",
      amount: 25,
      type: "income",
      category: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      source: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      event: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
      created_at: "2025-03-20T19:09:26.517362Z",
      user_id: "5cc9a683-978a-4c2b-849f-dafca9e760d0",
    },
  ];
  return (
    <div>
      {TransactionDataM && (
        <DataTable data={TransactionDataM} columns={transactionColumns} />
      )}
      <div className="flex items-center w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-start gap-2 w-auto px-3 py-2"
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {dateRange.from
                  ? format(dateRange.from, "MMM d, yyyy")
                  : "Start date"}{" "}
                —{" "}
                {dateRange.to
                  ? format(dateRange.to, "MMM d, yyyy")
                  : "End date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Tabs
              defaultValue="from"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col space-y-4 p-3 w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="from">Start Date</TabsTrigger>
                  <TabsTrigger value="to">End Date</TabsTrigger>
                </TabsList>

                <TabsContent value="from">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    defaultMonth={dateRange.from}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDateRange((prev) => ({
                          ...prev,
                          from: selectedDate,
                        }));
                        setActiveTab("to");
                      }
                    }}
                    toDate={dateRange.to}
                    initialFocus
                  />
                </TabsContent>

                <TabsContent value="to">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    defaultMonth={dateRange.to}
                    fromDate={dateRange.from}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDateRange((prev) => ({
                          ...prev,
                          to: selectedDate,
                        }));
                      }
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
