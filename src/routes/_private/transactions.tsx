import { Button } from "@/components/ui/button";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLinkIcon, PlusIcon } from "lucide-react";
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
import { useSource } from "@/hooks/useSource";
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
  const { getAllSource } = useSource();
  const {
    data: source,
    isError: isSourceError,
    isLoading: isSourceLoading,
  } = getAllSource();
  const { getAllTransactionExpended } = useTransaction();
  const { data: TransactionData } = getAllTransactionExpended();
  const [dateRange, setDateRange] = useAtom(dateRangeAtom);

  const sortedTransactions = (TransactionData ?? [])
    .slice()
    .sort((a, b) =>
      compareDesc(parseISO(a.created_at), parseISO(b.created_at))
    );

  return (
    <div className="flex flex-col gap-4">
      {source && source?.length < 1 && (
        <div className="bg-accent text-sm rounded-md py-1.5 px-2 flex flex-row items-center justify-between">
          <div className="text-wrap">
            Looks like you haven't added any prefered payment method for your
            transactions.
          </div>
          <Button size={"sm"} variant={"outline"}>
            <Link className="flex flex-row items-center gap-2" to="/options">
              Let's setup
              <ExternalLinkIcon size={16} />
            </Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="font-normal text-base">Add Income</h1>
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
                        className="h-16 w-16 flex items-center justify-center text-xs font-medium p-2 cursor-pointer"
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
                    className="h-16 w-16 flex flex-col items-center justify-center text-xs font-medium p-2 cursor-pointer"
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
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-normal text-base">Add Expenses</h1>
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
                        className="h-16 w-16 flex items-center justify-center text-xs font-medium p-2 cursor-pointer"
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
                    className="h-16 w-16 flex flex-col items-center justify-center text-xs font-medium p-2 cursor-pointer"
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
      </div>

      <h1 className="font-normal text-base py-2">Transactions</h1>

      {sortedTransactions && (
        <DataTable data={sortedTransactions} columns={transactionColumns} />
      )}
    </div>
  );
}
