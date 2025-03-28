import { createFileRoute } from "@tanstack/react-router";
import { TransactionHistoryChart } from "../-components/charts/TransactionHistoryChart";
import { useTransaction } from "@/hooks/useTransaction";
import { useCategory } from "@/hooks/useCategory";
import { useSource } from "@/hooks/useSource";
import { CategoryChart } from "../-components/charts/CategoryChart";
import { SourceChart } from "../-components/charts/SourceChart";
import { DatePickerWithRange } from "../-components/DatePickerWithRange";
import Budgeting from "../-components/charts/BudgetingChart";

export const Route = createFileRoute("/_private/dashboard")({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { getAllTransactionExpended } = useTransaction();
  const { getAllCategory } = useCategory();
  const { getAllSource } = useSource();

  const { data: transactionData, isLoading: isTransactionLoading } =
    getAllTransactionExpended();

  const { data: categoryData, isLoading: isCategoryLoading } = getAllCategory();

  const { data: sourceData, isLoading: isSourceLoading } = getAllSource();
  if (isTransactionLoading || isCategoryLoading || isSourceLoading) {
    return <div className="text-center py-4">Loading financial data...</div>;
  }

  if (!transactionData || !categoryData || !sourceData) {
    return (
      <div className="text-center text-red-500">
        Failed to load financial information.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Budgeting />
      <DatePickerWithRange />
      <TransactionHistoryChart
        data={transactionData}
        categoryData={categoryData}
        sourceData={sourceData}
      />
      <CategoryChart data={transactionData} />
      <SourceChart data={transactionData} />
    </div>
  );
}
