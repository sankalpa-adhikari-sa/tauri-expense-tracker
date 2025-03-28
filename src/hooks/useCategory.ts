import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { CategorySchema } from "@/types/publicSchema";
import { z } from "zod";

type Category = z.infer<typeof CategorySchema> & {
  _optimisticUpdate?: boolean;
  _pendingDelete?: boolean;
};
export function useCategory() {
  const getAllCategory = () => {
    return useQuery({
      queryKey: ["category"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("category")
          .select()
          .throwOnError();
        if (error) throw error;
        return data;
      },
    });
  };
  const getCategoryById = (id: string) => {
    return useQuery({
      queryKey: ["category", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("category")
          .select()
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });
  };
  const addCategory = () => {
    return useMutation({
      mutationFn: async (newCategory: any) => {
        const { data, error } = await supabase
          .from("category")
          .insert([newCategory])
          .select()
          .throwOnError();
        if (error) throw error;
        return data[0];
      },
      onMutate: async (newCategory) => {
        await queryClient.cancelQueries({ queryKey: ["category"] });
        const previousCategories = queryClient.getQueryData(["category"]);

        const optimisticCategory = {
          ...newCategory,
          id: `temp-${Date.now()}`,
        };

        queryClient.setQueryData(["category"], (old: any[] = []) => {
          return [...old, optimisticCategory];
        });

        return { previousCategories };
      },
      onSuccess: (newCategory) => {
        toast.success("Category Added");

        queryClient.setQueryData(["category"], (old: any[] = []) => {
          return [
            ...old.filter(
              (category) => !category.id.toString().startsWith("temp-")
            ),
            newCategory,
          ];
        });
      },
      onError: (error, variables, context) => {
        toast.error(`${error.message}`);

        if (context?.previousCategories) {
          queryClient.setQueryData(["category"], context.previousCategories);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
    });
  };
  const updateCategoryById = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { error } = await supabase
          .from("category")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        toast.success("Category Updated");
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
      onError: (error) => {
        toast.error(`${error}`);
      },
    });
  };

  const deleteCategory = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("category").delete().eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["category"] });

        const previousCategories =
          queryClient.getQueryData<Category[]>(["category"]) || [];

        queryClient.setQueryData<Category[]>(["category"], (old = []) => {
          return old.map((category) =>
            category.id === id
              ? { ...category, id: `deleting-${id}`, _pendingDelete: true }
              : category
          );
        });

        const previousCategory = queryClient.getQueryData<Category>([
          "category",
          id,
        ]);

        if (previousCategory) {
          queryClient.removeQueries({ queryKey: ["category", id] });
        }

        return { previousCategories, previousCategory, deletedId: id };
      },
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Category[]>(["category"], (old = []) => {
          return old.filter(
            (category) =>
              !category._pendingDelete &&
              category.id !== `deleting-${deletedId}`
          );
        });
      },
      onError: (error: Error, id, context) => {
        toast.error(`${error.message}`);

        if (context?.previousCategories) {
          queryClient.setQueryData(["category"], context.previousCategories);
        }

        if (context?.previousCategory && context?.deletedId) {
          queryClient.setQueryData(
            ["category", context.deletedId],
            context.previousCategory
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["category"] });
      },
    });
  };

  return {
    getAllCategory,
    deleteCategory,
    getCategoryById,
    addCategory,
    updateCategoryById,
  };
}
