import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { BudgetSchema } from "@/types/publicSchema";
import { z } from "zod";

type Budget = z.infer<typeof BudgetSchema> & {
  _optimisticUpdate?: boolean;
  _pendingDelete?: boolean;
};
export function useBudget() {
  const getAllBudget = () => {
    return useQuery({
      queryKey: ["budget"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("budget")
          .select()
          .throwOnError();
        if (error) throw error;
        return data;
      },
    });
  };
  const getBudgetById = (id: string) => {
    return useQuery({
      queryKey: ["budget", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("budget")
          .select()
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });
  };
  const addBudget = () => {
    return useMutation({
      mutationFn: async (newBudget: any) => {
        const { data, error } = await supabase
          .from("budget")
          .insert([newBudget])
          .select()
          .throwOnError();
        if (error) throw error;
        return data[0];
      },
      onMutate: async (newBudget) => {
        await queryClient.cancelQueries({ queryKey: ["budget"] });
        const previousBudgets = queryClient.getQueryData(["budget"]);

        const optimisticBudget = {
          ...newBudget,
          id: `temp-${Date.now()}`,
        };

        queryClient.setQueryData(["budget"], (old: any[] = []) => {
          return [...old, optimisticBudget];
        });

        return { previousBudgets };
      },
      onSuccess: (newBudget) => {
        toast.success("Budget Added");

        queryClient.setQueryData(["budget"], (old: any[] = []) => {
          return [
            ...old.filter(
              (budget) => !budget.id.toString().startsWith("temp-")
            ),
            newBudget,
          ];
        });
      },
      onError: (error, variables, context) => {
        toast.error(`${error.message}`);

        if (context?.previousBudgets) {
          queryClient.setQueryData(["budget"], context.previousBudgets);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["budget"] });
      },
    });
  };
  const updateBudgetById = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { error } = await supabase
          .from("budget")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        toast.success("Budget Updated");
        queryClient.invalidateQueries({ queryKey: ["budget"] });
      },
      onError: (error) => {
        toast.error(`${error}`);
      },
    });
  };

  const deleteBudget = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("budget").delete().eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["budget"] });

        const previousBudgets =
          queryClient.getQueryData<Budget[]>(["budget"]) || [];

        queryClient.setQueryData<Budget[]>(["budget"], (old = []) => {
          return old.map((budget) =>
            budget.id === id
              ? { ...budget, id: `deleting-${id}`, _pendingDelete: true }
              : budget
          );
        });

        const previousBudget = queryClient.getQueryData<Budget>(["budget", id]);

        if (previousBudget) {
          queryClient.removeQueries({ queryKey: ["budget", id] });
        }

        return { previousBudgets, previousBudget, deletedId: id };
      },
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Budget[]>(["budget"], (old = []) => {
          return old.filter(
            (budget) =>
              !budget._pendingDelete && budget.id !== `deleting-${deletedId}`
          );
        });
      },
      onError: (error: Error, id, context) => {
        toast.error(`${error.message}`);

        if (context?.previousBudgets) {
          queryClient.setQueryData(["budget"], context.previousBudgets);
        }

        if (context?.previousBudget && context?.deletedId) {
          queryClient.setQueryData(
            ["budget", context.deletedId],
            context.previousBudget
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["budget"] });
      },
    });
  };

  return {
    getAllBudget,
    deleteBudget,
    getBudgetById,
    addBudget,
    updateBudgetById,
  };
}
