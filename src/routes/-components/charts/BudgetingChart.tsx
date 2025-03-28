import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import {
  Label,
  Pie,
  PieChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, formatDate } from "@/lib/utils";

import { useBudget } from "@/hooks/useBudget";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTransaction } from "@/hooks/useTransaction";
import { useMemo } from "react";
import { aggregateByCategory } from "@/lib/utils";
import { BudgetSchema, TransactionSchema } from "@/types/publicSchema";
import { z } from "zod";

interface BudgetBreakdown {
  used: number;
  available: number;
  totalBudget: number;
}

const chartConfig: ChartConfig = {
  available: {
    label: "Available",
    color: "var(--chart-4)",
  },
  used: {
    label: "Used",
    color: "var(--chart-5)",
  },
};

const calculateBudgetBreakdown = (
  budgetData?: z.infer<typeof BudgetSchema>[],
  transactionsData?: z.infer<typeof TransactionSchema>[]
): BudgetBreakdown[] => {
  if (!budgetData || budgetData.length === 0) return [];

  const used = transactionsData
    ? transactionsData
        .filter((item) => item.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;

  const totalBudget = budgetData[0].amount;
  const available = totalBudget - used;

  return [
    {
      used,
      available,
      totalBudget,
    },
  ];
};

const BudgetStatusIndicator: React.FC<{
  usagePercentage: number;
  usedAmount: number;
  totalBudget: number;
}> = ({ usagePercentage, usedAmount, totalBudget }) => {
  const isOverBudget = usedAmount > totalBudget;
  const isNearingBudget = usagePercentage >= 80 && usagePercentage < 100;
  const isFullyUsed = usagePercentage === 100;

  const getStatusIcon = () => {
    if (isOverBudget) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (isFullyUsed) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    if (isNearingBudget) {
      return <TrendingUp className="h-4 w-4 text-amber-500" />;
    }
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  };

  const getStatusMessage = () => {
    if (isOverBudget) {
      return `Exceeded budget by $${(usedAmount - totalBudget).toFixed(2)}`;
    }
    if (isFullyUsed) {
      return "Budget fully used";
    }
    if (isNearingBudget) {
      return "Nearing budget limit";
    }
    return "Budget looks good";
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
          isOverBudget && "bg-red-50 text-destructive",
          isNearingBudget && "bg-amber-50 text-amber-600",
          !isOverBudget && !isNearingBudget && "bg-emerald-50 text-emerald-600"
        )}
      >
        {getStatusIcon()}
        <span>
          {usagePercentage}% Used (${usedAmount.toFixed(2)})
        </span>
      </div>

      <p
        className={cn(
          "text-xs text-muted-foreground",
          isOverBudget && "text-destructive",
          isNearingBudget && "text-amber-500"
        )}
      >
        {getStatusMessage()}
      </p>
    </div>
  );
};

export default function Budgeting() {
  const { data: budgetData } = useBudget().getAllBudget();

  const { data: transactionsData } =
    useTransaction().getAllTransactionExpendedByTimeframe({
      fromDate: budgetData?.[0]?.start,
      toDate: budgetData?.[0]?.end,
    });
  const aggregatedExpenseCategories = useMemo(() => {
    if (!transactionsData) return [];
    return aggregateByCategory({
      transactions: transactionsData,
      type: "expense",
    });
  }, [transactionsData]);

  const budgetBreakdown = useMemo(
    () => calculateBudgetBreakdown(budgetData, transactionsData),
    [budgetData, transactionsData]
  );

  const totalBudget = budgetBreakdown[0]?.totalBudget || 0;
  const usedAmount = budgetBreakdown[0]?.used || 0;
  // const availableAmount = budgetBreakdown[0]?.available || 0;

  const usagePercentage =
    totalBudget > 0 ? Math.round((usedAmount / totalBudget) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Budget</CardTitle>
          <CardDescription>
            <span className="mr-1">Period:</span>
            <Badge>{formatDate(budgetData?.[0]?.start)}</Badge>
            <span className="mx-1">to</span>
            <Badge>{formatDate(budgetData?.[0]?.end)}</Badge>
          </CardDescription>
        </div>
        {budgetData && budgetData?.length > 0 && (
          <Button variant={"outline"}>
            <CoinsIcon size={16} />
            {budgetData?.map((item) => item.name)}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-row flex-wrap items-center justify-center   pb-0">
        <div className="w-full mx-auto max-w-[300px] ">
          <ChartContainer
            config={chartConfig}
            className=" aspect-square w-full "
          >
            <RadialBarChart
              cy={"80%"}
              data={budgetBreakdown}
              endAngle={180}
              innerRadius={130}
              outerRadius={180}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                            y={(viewBox.cy || 0) - 18}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalBudget.toLocaleString()}
                            <tspan className="font-normal text-base fill-muted-foreground">
                              $
                            </tspan>
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Budget
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="available"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-available)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="used"
                fill="var(--color-used)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
          <BudgetStatusIndicator
            usagePercentage={usagePercentage}
            usedAmount={usedAmount}
            totalBudget={totalBudget}
          />
        </div>
        {aggregatedExpenseCategories &&
          aggregatedExpenseCategories.length > 0 && (
            <ChartContainer
              config={{}}
              className=" mx-auto aspect-square w-full max-w-[300px]"
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
                      formatter={(value, _, item) => {
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
                                <span className="capitalize">
                                  {payload.name}
                                </span>
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
      </CardContent>
    </Card>
  );
}
