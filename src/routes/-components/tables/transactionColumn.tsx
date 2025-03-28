import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenIcon, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import { TransactionSchema } from "@/types/publicSchema";
import { z } from "zod";
import { toast } from "sonner";
import { useTransaction } from "@/hooks/useTransaction";
import { ResponsiveDrawerDialog } from "@/components/responsive-drawer-dialog";
import { TransactionForm } from "../forms/transactionForm";
import { cn } from "@/lib/utils";

function TableRowActions({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof TransactionSchema>;
}) {
  const isOptimisticItem = data.id.toString().startsWith("temp-");
  const isOptimisticDeletingItem = data.id.toString().startsWith("deleting-");
  const isOptimisticUpdatingItem = data.id.toString().startsWith("updating-");
  const { deleteTransaction } = useTransaction();
  const deleteTransactionMutation = deleteTransaction();
  const handleTransactionDelete = async ({ id }: { id: string }) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteTransactionMutation.mutate(id, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      }),
      {
        loading: "Deleting Transaction...",
        success: () => {
          return "Successfully deleted";
        },
        error: "Deletion failed. Please try again.",
        duration: 1000,
      }
    );
  };
  return (
    <div className="flex flex-row items-center justify-end gap-2 ">
      <ResponsiveDrawerDialog
        trigger={
          <Button
            disabled={
              isOptimisticItem ||
              isOptimisticDeletingItem ||
              isOptimisticUpdatingItem
            }
            size="icon"
            variant="default"
            className={cn(
              "rounded-full cursor-pointer group-hover:bg-muted-foreground/40 group-hover:text-primary-foreground hover:bg-muted-foreground/50",
              isOptimisticItem ||
                isOptimisticDeletingItem ||
                isOptimisticUpdatingItem
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            )}
          >
            <PenIcon size={16} />
          </Button>
        }
        headerProps={{ title: "Update", subtitle: "transaction" }}
      >
        <TransactionForm data={data} />
      </ResponsiveDrawerDialog>

      <Button
        onClick={() => handleTransactionDelete({ id: id })}
        size="icon"
        variant="default"
        className="rounded-full cursor-pointer group-hover:bg-muted-foreground/40 group-hover:text-primary-foreground  hover:bg-destructive hover:text-white"
      >
        <TrashIcon size={16} />
      </Button>
    </div>
  );
}

export const transactionColumns: ColumnDef<
  z.infer<typeof TransactionSchema>
>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as "income" | "expense";
      return (
        <div className="size-9 inline-flex items-center justify-center">
          {type === "expense" ? (
            <TrendingDown size={16} className="text-destructive" />
          ) : (
            <TrendingUp size={16} className="text-primary" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const type = row.getValue("type") as "income" | "expense";

      return <TableRowActions data={row.original} id={row.original.id} />;
    },
  },
];
