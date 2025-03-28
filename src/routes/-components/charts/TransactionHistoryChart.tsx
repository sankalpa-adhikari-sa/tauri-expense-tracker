"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { z } from "zod";
import {
  CategorySchema,
  SourceSchema,
  TransactionSchema,
} from "@/types/publicSchema";
import { useState } from "react";
import { ToggleGroup } from "@radix-ui/react-toggle-group";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { HandCoinsIcon, InfoIcon, TrendingDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ItemNotfoundPlaceholder from "../placeholder/ItemNotfoundPlaceholder";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TransactionHistoryChart({
  data,
  categoryData,
  sourceData,
}: {
  data: z.infer<typeof TransactionSchema>[];
  categoryData: z.infer<typeof CategorySchema>[];
  sourceData: z.infer<typeof SourceSchema>[];
}) {
  const [activeChart, setActiveChart] = useState<"income" | "expense">(
    "expense"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const formattedData = data?.map((item) => ({
    ...item,
    created_at: new Date(item.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  const filteredData = (
    type: "income" | "expense",
    categoryId?: string | null
  ) => {
    return formattedData?.filter(
      (item) =>
        item.type === type && (!categoryId || item.category.id === categoryId)
    );
  };

  const handleChartTypeChange = (value: "income" | "expense") => {
    setSelectedCategory(null);
    setActiveChart(value);
  };

  const relevantCategories = categoryData?.filter(
    (item) => item.type === activeChart
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Chart</CardTitle>
        <CardDescription>
          Showing total transactions by type and category
        </CardDescription>
        <div className="flex flex-row items-center justify-between">
          <ToggleGroup
            value={activeChart}
            onValueChange={handleChartTypeChange}
            type="single"
          >
            <ToggleGroupItem value="expense" aria-label="Toggle expense">
              <TrendingDownIcon className="text-destructive" size={16} />
            </ToggleGroupItem>
            <ToggleGroupItem value="income" aria-label="Toggle income">
              <HandCoinsIcon size={16} />
            </ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {relevantCategories?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData(activeChart, selectedCategory).length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={filteredData(activeChart, selectedCategory)}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                allowDuplicatedCategory={false}
                dataKey="created_at"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const payload = item.payload as any;
                      return (
                        <div className="min-w-[200px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 capitalize">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor: `var(--color-${name})`,
                                }}
                              />
                              <span>{payload.name}</span>
                            </div>
                            <div className="flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground capitalize">
                              {value}
                              <span className="font-normal text-muted-foreground">
                                $
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            <div className="flex items-center justify-between">
                              <div>Category:</div> {payload.category.name}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Payment method:</div> {payload.source.name}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Date:</div>{" "}
                              {new Date(payload.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
                cursor={false}
              />
              <Line
                activeDot={{ r: 4.5 }}
                dataKey="amount"
                type="linear"
                fill="var(--color-amount)"
                fillOpacity={0.4}
                stroke="var(--color-amount)"
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <ItemNotfoundPlaceholder
            icon={<InfoIcon size={24} />}
            title={"No Transactions found"}
            description={"You haven't added any Transactions."}
          />
        )}
      </CardContent>
    </Card>
  );
}
