import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { TransactionSchema } from "@/types/publicSchema";
import { z } from "zod";
import { useAtomValue } from "jotai";
import { dateRangeAtom } from "@/lib/atom";
import { ISOStringFormat } from "date-fns";

type Transaction = z.infer<typeof TransactionSchema> & {
  _optimisticUpdate?: boolean;
  _pendingDelete?: boolean;
};
export function useTransaction() {
  const getAllTransaction = () => {
    return useQuery({
      queryKey: ["transactions"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .throwOnError();
        if (error) throw error;
        return data;
      },
    });
  };
  const getAllTransactionExpendedByTimeframe = ({
    fromDate,
    toDate,
  }: {
    fromDate: ISOStringFormat;
    toDate: ISOStringFormat;
  }) => {
    return useQuery({
      queryKey: ["transactions", fromDate, toDate],
      queryFn: async () => {
        if (!fromDate || !toDate) {
          throw new Error("Date range must be fully specified");
        }

        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
             *,
             category(id, name, type),
             source(id, name),
             event(id, name)
            `
          )
          .gte("created_at", fromDate)
          .lte("created_at", toDate)
          .order("created_at", { ascending: true })
          .throwOnError();

        if (error) throw error;
        return data;
      },
    });
  };

  const getAllTransactionExpended = () => {
    const dateRange = useAtomValue(dateRangeAtom);

    const fromDate = dateRange?.from ? new Date(dateRange.from) : undefined;
    const toDate = dateRange?.to ? new Date(dateRange.to) : undefined;

    return useQuery({
      queryKey: [
        "transactions",
        fromDate?.toISOString(),
        toDate?.toISOString(),
      ],
      queryFn: async () => {
        if (!fromDate || !toDate) {
          throw new Error("Date range must be fully specified");
        }

        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
             *,
             category(id, name, type),
             source(id, name),
             event(id, name)
            `
          )
          .gte("created_at", fromDate.toISOString())
          .lte("created_at", toDate.toISOString())
          .order("created_at", { ascending: true })
          .throwOnError();

        if (error) throw error;
        return data;
      },
    });
  };

  const getTransactionById = (id: string) => {
    return useQuery({
      queryKey: ["transactions", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });
  };
  const addTransaction = () => {
    return useMutation({
      mutationFn: async (newTransaction: any) => {
        const { data, error } = await supabase
          .from("transactions")
          .insert([newTransaction])
          .select()
          .throwOnError();
        if (error) throw error;
        return data[0];
      },
      onMutate: async (newTransaction) => {
        await queryClient.cancelQueries({ queryKey: ["transactions"] });
        const previousTransactions = queryClient.getQueryData(["transactions"]);

        const optimisticTransaction = {
          ...newTransaction,
          id: `temp-${Date.now()}`,
        };

        queryClient.setQueryData(["transactions"], (old: any[] = []) => {
          return [...old, optimisticTransaction];
        });

        return { previousTransactions };
      },
      onSuccess: (newTransaction) => {
        queryClient.setQueryData(["transactions"], (old: any[] = []) => {
          return [
            ...old.filter(
              (transaction) => !transaction.id.toString().startsWith("temp-")
            ),
            newTransaction,
          ];
        });
      },
      onError: (error, variables, context) => {
        toast.error(`${error.message}`);

        if (context?.previousTransactions) {
          queryClient.setQueryData(
            ["transactions"],
            context.previousTransactions
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    });
  };
  const updateTransactionById = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { error } = await supabase
          .from("transactions")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
      onError: (error) => {
        toast.error(`${error.message}`);
      },
    });
  };

  const deleteTransaction = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["transactions"] });

        const previousTransactions =
          queryClient.getQueryData<Transaction[]>(["transactions"]) || [];

        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          (old = []) => {
            return old.map((transaction) =>
              transaction.id === id
                ? { ...transaction, id: `deleting-${id}`, _pendingDelete: true }
                : transaction
            );
          }
        );

        const previousTransaction = queryClient.getQueryData<Transaction>([
          "transactions",
          id,
        ]);

        if (previousTransaction) {
          queryClient.removeQueries({ queryKey: ["transactions", id] });
        }

        return { previousTransactions, previousTransaction, deletedId: id };
      },
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Transaction[]>(
          ["transactions"],
          (old = []) => {
            return old.filter(
              (transaction) =>
                !transaction._pendingDelete &&
                transaction.id !== `deleting-${deletedId}`
            );
          }
        );
      },
      onError: (error: Error, id, context) => {
        toast.error(`${error.message}`);

        if (context?.previousTransactions) {
          queryClient.setQueryData(
            ["transactions"],
            context.previousTransactions
          );
        }

        if (context?.previousTransaction && context?.deletedId) {
          queryClient.setQueryData(
            ["transactions", context.deletedId],
            context.previousTransaction
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    });
  };

  return {
    getAllTransaction,
    getAllTransactionExpended,
    getAllTransactionExpendedByTimeframe,
    deleteTransaction,
    getTransactionById,
    addTransaction,
    updateTransactionById,
  };
}
