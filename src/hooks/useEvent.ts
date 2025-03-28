import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { queryClient } from "@/main";
import { EventSchema } from "@/types/publicSchema";
import { z } from "zod";

type Event = z.infer<typeof EventSchema> & {
  _optimisticUpdate?: boolean;
  _pendingDelete?: boolean;
};
export function useEvent() {
  const getAllEvent = () => {
    return useQuery({
      queryKey: ["event"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("event")
          .select()
          .throwOnError();
        if (error) throw error;
        return data;
      },
    });
  };
  const getEventById = (id: string) => {
    return useQuery({
      queryKey: ["event", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("event")
          .select()
          .eq("id", id)
          .single();
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });
  };
  const addEvent = () => {
    return useMutation({
      mutationFn: async (newEvent: any) => {
        const { data, error } = await supabase
          .from("event")
          .insert([newEvent])
          .select()
          .throwOnError();
        if (error) throw error;
        return data[0];
      },
      onMutate: async (newEvent) => {
        await queryClient.cancelQueries({ queryKey: ["event"] });
        const previousEvents = queryClient.getQueryData(["event"]);

        const optimisticEvent = {
          ...newEvent,
          id: `temp-${Date.now()}`,
        };

        queryClient.setQueryData(["event"], (old: any[] = []) => {
          return [...old, optimisticEvent];
        });

        return { previousEvents };
      },
      onSuccess: (newEvent) => {
        toast.success("Event Added");

        queryClient.setQueryData(["event"], (old: any[] = []) => {
          return [
            ...old.filter((event) => !event.id.toString().startsWith("temp-")),
            newEvent,
          ];
        });
      },
      onError: (error, variables, context) => {
        toast.error(`${error.message}`);

        if (context?.previousEvents) {
          queryClient.setQueryData(["event"], context.previousEvents);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["event"] });
      },
    });
  };
  const updateEventById = () => {
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
        const { error } = await supabase
          .from("event")
          .update(updates)
          .eq("id", id);
        if (error) throw error;
      },
      onSuccess: () => {
        toast.success("Event Updated");
        queryClient.invalidateQueries({ queryKey: ["event"] });
      },
      onError: (error) => {
        toast.error(`${error}`);
      },
    });
  };

  const deleteEvent = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from("event").delete().eq("id", id);
        if (error) throw error;
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["event"] });

        const previousEvents =
          queryClient.getQueryData<Event[]>(["event"]) || [];

        queryClient.setQueryData<Event[]>(["event"], (old = []) => {
          return old.map((event) =>
            event.id === id
              ? { ...event, id: `deleting-${id}`, _pendingDelete: true }
              : event
          );
        });

        const previousEvent = queryClient.getQueryData<Event>(["event", id]);

        if (previousEvent) {
          queryClient.removeQueries({ queryKey: ["event", id] });
        }

        return { previousEvents, previousEvent, deletedId: id };
      },
      onSuccess: (deletedId) => {
        queryClient.setQueryData<Event[]>(["event"], (old = []) => {
          return old.filter(
            (event) =>
              !event._pendingDelete && event.id !== `deleting-${deletedId}`
          );
        });
      },
      onError: (error: Error, id, context) => {
        toast.error(`${error.message}`);

        if (context?.previousEvents) {
          queryClient.setQueryData(["event"], context.previousEvents);
        }

        if (context?.previousEvent && context?.deletedId) {
          queryClient.setQueryData(
            ["event", context.deletedId],
            context.previousEvent
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["event"] });
      },
    });
  };

  return {
    getAllEvent,
    deleteEvent,
    getEventById,
    addEvent,
    updateEventById,
  };
}
