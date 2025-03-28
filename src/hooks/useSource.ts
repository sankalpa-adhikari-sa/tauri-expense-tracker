import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { SourceSchema } from "@/types/publicSchema";
import { z } from "zod";

type Source = z.infer<typeof SourceSchema> & {
  _optimisticUpdate?: boolean;
  _pendingDelete?: boolean;
};
export function useSource() {
  const getAllSource = () => {
    return useQuery({
      queryKey: ["source"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("source")
          .select()
          .throwOnError();
        if (error) throw error;
        return data;
      },
    });
  };
  const getSourceById = (id: string) => {
    return useQuery({
      queryKey: ["source", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("source")
          .select()
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });
  };
  const addSource = () => {
    return useMutation({
      mutationFn: async (newSource: any) => {
        const { data, error } = await supabase
          .from("source")
          .insert([newSource])
          .select()
          .throwOnError();
        if (error) throw error;
        return data[0];
      },
      onMutate: async (newSource) => {
        await queryClient.cancelQueries({ queryKey: ["source"] });
        const previousSources = queryClient.getQueryData(["source"]);

        const optimisticSource = {
          ...newSource,
          id: `temp-${Date.now()}`,
        };

        queryClient.setQueryData(["source"], (old: any[] = []) => {
          return [...old, optimisticSource];
        });

        return { previousSources };
      },
      onSuccess: (newSource) => {
        toast.success("Source Added");

        queryClient.setQueryData(["source"], (old: any[] = []) => {
          return [
            ...old.filter(
              (source) => !source.id.toString().startsWith("temp-")
            ),
            newSource,
          ];
        });
      },
      onError: (error, variables, context) => {
        toast.error(`${error.message}`);

        if (context?.previousSources) {
          queryClient.setQueryData(["source"], context.previousSources);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["source"] });
      },
    });
  };
  const updateSourceById = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { error } = await supabase
          .from("source")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        toast.success("Source Updated");
        queryClient.invalidateQueries({ queryKey: ["source"] });
      },
      onError: (error) => {
        toast.error(`${error}`);
      },
    });
  };

  const deleteSource = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("source").delete().eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["source"] });

        const previousSources =
          queryClient.getQueryData<Source[]>(["source"]) || [];

        queryClient.setQueryData<Source[]>(["source"], (old = []) => {
          return old.map((source) =>
            source.id === id
              ? { ...source, id: `deleting-${id}`, _pendingDelete: true }
              : source
          );
        });

        const previousSource = queryClient.getQueryData<Source>(["source", id]);

        if (previousSource) {
          queryClient.removeQueries({ queryKey: ["source", id] });
        }

        return { previousSources, previousSource, deletedId: id };
      },
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Source[]>(["source"], (old = []) => {
          return old.filter(
            (source) =>
              !source._pendingDelete && source.id !== `deleting-${deletedId}`
          );
        });
      },
      onError: (error: Error, id, context) => {
        toast.error(`${error.message}`);

        if (context?.previousSources) {
          queryClient.setQueryData(["source"], context.previousSources);
        }

        if (context?.previousSource && context?.deletedId) {
          queryClient.setQueryData(
            ["source", context.deletedId],
            context.previousSource
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["source"] });
      },
    });
  };

  return {
    getAllSource,
    deleteSource,
    getSourceById,
    addSource,
    updateSourceById,
  };
}
