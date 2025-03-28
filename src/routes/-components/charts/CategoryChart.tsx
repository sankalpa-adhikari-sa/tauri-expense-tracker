import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { z } from "zod";
import { TransactionSchema } from "@/types/publicSchema";
import { useMemo } from "react";
import { aggregateByCategory } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import ItemNotfoundPlaceholder from "../placeholder/ItemNotfoundPlaceholder";

export function CategoryChart({
  data,
}: {
  data: z.infer<typeof TransactionSchema>[];
}) {
  const aggregatedIncomeCategories = useMemo(() => {
    if (!data) return [];
    return aggregateByCategory({ transactions: data, type: "income" });
  }, [data]);
  const aggregatedExpenseCategories = useMemo(() => {
    if (!data) return [];
    return aggregateByCategory({ transactions: data, type: "expense" });
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle> Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row flex-wrap items-center justify-center  pb-0">
        {aggregatedIncomeCategories.length > 0 && (
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart
              {...{
                overflow: "visible",
              }}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const payload = item.payload as any;
                      return (
                        <div className="min-w-[150px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor: `${payload.fill}`,
                                }}
                              />
                              <span className="capitalize">{payload.name}</span>
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
                              <div>Type:</div> {payload.type}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={aggregatedIncomeCategories}
                paddingAngle={2}
                cornerRadius={8}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      className="capitalize"
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--foreground)"
                    >
                      {payload.name}
                    </text>
                  );
                }}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {aggregatedIncomeCategories.reduce(
                              (acc, { value }) => {
                                acc += value;
                                return acc;
                              },
                              0
                            )}
                            <tspan className="font-normal text-base fill-muted-foreground">
                              $
                            </tspan>
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Income
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}

        {aggregatedExpenseCategories.length > 0 && (
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart
              {...{
                overflow: "visible",
              }}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => {
                      const payload = item.payload as any;
                      return (
                        <div className="min-w-[150px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                style={{
                                  backgroundColor: `${payload.fill}`,
                                }}
                              />
                              <span className="capitalize">{payload.name}</span>
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
                              <div>Type:</div> {payload.type}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={aggregatedExpenseCategories}
                paddingAngle={2}
                cornerRadius={8}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      className="capitalize"
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="var(--foreground)"
                    >
                      {payload.name}
                    </text>
                  );
                }}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {aggregatedExpenseCategories.reduce(
                              (acc, { value }) => {
                                acc += value;
                                return acc;
                              },
                              0
                            )}

                            <tspan className="font-normal text-base fill-muted-foreground">
                              $
                            </tspan>
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Expense
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
        {aggregatedIncomeCategories.length < 1 &&
          aggregatedExpenseCategories.length < 1 && (
            <ItemNotfoundPlaceholder
              icon={<InfoIcon size={24} />}
              title={" No Transactions found"}
              description={" You haven't added any Transactions."}
            />
          )}
      </CardContent>
    </Card>
  );
}
