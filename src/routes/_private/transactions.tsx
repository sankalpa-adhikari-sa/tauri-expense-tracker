import { Button } from "@/components/ui/button";

import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";

import { DataTable } from "@/components/custom/data-table";
import { transactionColumns } from "../-components/tables/transactionColumn";
import { useTransaction } from "@/hooks/useTransaction";
import { ResponsiveDrawerDialog } from "@/components/responsive-drawer-dialog";
import { CategoryForm } from "../-components/forms/CategoryForm";
import { TransactionForm } from "../-components/forms/transactionForm";
import { Skeleton } from "@/components/ui/skeleton";
import { dateRangeAtom } from "@/lib/atom";
import { useAtom } from "jotai";
import { parseISO, compareDesc } from "date-fns";
export const Route = createFileRoute("/_private/transactions")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getAllCategory } = useCategory();
  const {
    data: category,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
  } = getAllCategory();
  const { getAllTransactionExpended } = useTransaction();
  const { data: TransactionData } = getAllTransactionExpended();
  const [dateRange, setDateRange] = useAtom(dateRangeAtom);

  const sortedTransactions = (TransactionData ?? [])
    .slice()
    .sort((a, b) =>
      compareDesc(parseISO(a.created_at), parseISO(b.created_at))
    );
  console.log(sortedTransactions, dateRange);

  return (
    <div className="flex flex-col">
      <h1 className="font-normal text-base py-2">Add Income</h1>
      <div className="flex flex-row flex-wrap gap-2">
        {isCategoryLoading ? (
          <>
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
          </>
        ) : (
          <>
            {category
              ?.filter((item) => item.type === "income")
              .map((item) => (
                <ResponsiveDrawerDialog
                  key={item.id}
                  trigger={
                    <Button
                      key={item.id}
                      variant="default"
                      className="h-16 w-16 flex items-center justify-center text-xs font-medium p-2"
                    >
                      <span className="truncate max-w-full">{item.name}</span>
                    </Button>
                  }
                  headerProps={{ title: `Add Transaction for ${item.name}` }}
                >
                  <TransactionForm
                    categoryDefault={{
                      categoryId: item.id,
                      categoryType: item.type,
                    }}
                  />
                </ResponsiveDrawerDialog>
              ))}

            <ResponsiveDrawerDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="h-16 w-16 flex flex-col items-center justify-center text-xs font-medium p-2"
                >
                  <PlusIcon size={16} />
                  <span className="text-xs">Category</span>
                </Button>
              }
              headerProps={{ title: "Add Income Category" }}
            >
              <CategoryForm type="income" />
            </ResponsiveDrawerDialog>
          </>
        )}
      </div>
      <h1 className="font-normal text-base py-2">Add Expenses</h1>
      <div className="flex flex-row flex-wrap gap-2">
        {isCategoryLoading ? (
          <>
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
          </>
        ) : (
          <>
            {category
              ?.filter((item) => item.type === "expense")
              .map((item) => (
                <ResponsiveDrawerDialog
                  key={item.id}
                  trigger={
                    <Button
                      key={item.id}
                      variant="default"
                      className="h-16 w-16 flex items-center justify-center text-xs font-medium p-2"
                    >
                      <span className="truncate max-w-full">{item.name}</span>
                    </Button>
                  }
                  headerProps={{ title: `Add Transaction for ${item.name}` }}
                >
                  <TransactionForm
                    categoryDefault={{
                      categoryId: item.id,
                      categoryType: item.type,
                    }}
                  />
                </ResponsiveDrawerDialog>
              ))}
            <ResponsiveDrawerDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="h-16 w-16 flex flex-col items-center justify-center text-xs font-medium p-2"
                >
                  <PlusIcon size={16} />
                  <span className="text-xs">Category</span>
                </Button>
              }
              headerProps={{ title: "Add Expense Category" }}
            >
              <CategoryForm type="expense" />
            </ResponsiveDrawerDialog>
          </>
        )}
      </div>

      <h1 className="font-normal text-base py-2">Transactions</h1>

      {sortedTransactions && (
        <DataTable data={sortedTransactions} columns={transactionColumns} />
      )}
    </div>
  );
}
