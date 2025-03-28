import { FormMessage } from "@/components/form-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formOptions, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/lib/authProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransaction } from "@/hooks/useTransaction";
import { BaseTransactionSchema, TransactionSchema } from "@/types/publicSchema";
import { useCategory } from "@/hooks/useCategory";
import { useSource } from "@/hooks/useSource";
import { useEvent } from "@/hooks/useEvent";
import { toast } from "sonner";

const CategoryDefaultSchema = z.object({
  categoryId: z.string().uuid(),
  categoryType: z.enum(["income", "expense"]),
});
export function TransactionForm({
  data,
  categoryDefault,
}: {
  data?: z.infer<typeof TransactionSchema>;
  categoryDefault?: z.infer<typeof CategoryDefaultSchema>;
}) {
  const isAddMode = !data;
  const { addTransaction, updateTransactionById } = useTransaction();
  const addTransactionData = addTransaction();
  const updateTransactionData = updateTransactionById();

  const { getAllCategory } = useCategory();
  const { data: categoryData } = getAllCategory();

  const { getAllSource } = useSource();
  const { data: sourceData } = getAllSource();

  const { getAllEvent } = useEvent();
  const { data: eventData } = getAllEvent();

  const auth = useAuth();

  const formOpts = formOptions({
    defaultValues: isAddMode
      ? ({
          name: "",
          type: categoryDefault?.categoryType ?? "expense",
          category: categoryDefault?.categoryId ?? "",
          source: "",
          amount: 0,
          event: undefined,
        } as z.infer<typeof BaseTransactionSchema>)
      : {
          name: data?.name ?? "",
          type: data?.type ?? "expense",
          category: data?.category.id ?? "",
          source: data?.source.id ?? "",
          amount: data?.amount ?? 0,
          event: data?.event?.id ?? undefined,
        },
  });

  const form = useForm({
    ...formOpts,
    validators: {
      onChange: BaseTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      isAddMode
        ? toast.promise(
            new Promise<void>((resolve, reject) => {
              addTransactionData.mutate(
                {
                  ...value,
                  name: value.name.trim(),
                  user_id: auth.session?.user.id,
                },
                {
                  onSuccess: () => resolve(),
                  onError: () => reject(),
                }
              );
            }),
            {
              loading: "Adding Transaction...",
              success: () => {
                return "Successfully Added";
              },
              error: "Submission failed. Please try again.",
            }
          )
        : toast.promise(
            new Promise<void>((resolve, reject) => {
              updateTransactionData.mutate(
                {
                  id: data?.id,
                  updates: {
                    ...value,
                    name: value.name.trim(),
                    user_id: auth.session?.user.id,
                  },
                },
                {
                  onSuccess: () => resolve(),
                  onError: () => reject(),
                }
              );
            }),
            {
              loading: "Updating Transaction...",
              success: () => {
                return "Successfully updated";
              },
              error: "Update failed. Please try again.",
            }
          );
    },
  });

  return (
    <form
      className="flex flex-col space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Name:</Label>
              <Input
                placeholder="Name"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FormMessage field={field} />
            </div>
          );
        }}
      />
      <div className="flex flex-row items-baseline justify-between gap-2">
        <form.Field
          name="amount"
          children={(field) => {
            return (
              <div className="space-y-2 flex-1">
                <Label htmlFor={field.name}>Amount:</Label>
                <Input
                  type="number"
                  placeholder="Amount"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                />
                <FormMessage field={field} />
              </div>
            );
          }}
        />
        <form.Field
          name="source"
          children={(field) => {
            return (
              <div className="space-y-2 flex-1">
                <Label className="text-sm leading-[1.18] " htmlFor={field.name}>
                  Payment gateway:
                </Label>
                <Select
                  onValueChange={(value) => field.handleChange(value)}
                  value={field.state.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceData?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage field={field} />
              </div>
            );
          }}
        />
      </div>

      <div className="flex flex-row items-center justify-between gap-2">
        <form.Field
          name="type"
          children={(field) => {
            return (
              <div className="space-y-2 flex-1">
                <Label htmlFor={field.name}>Type:</Label>
                <Select
                  disabled={categoryDefault?.categoryType ? true : false}
                  onValueChange={(value) =>
                    field.handleChange(value as "income" | "expense")
                  }
                  value={field.state.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">income</SelectItem>
                    <SelectItem value="expense">expense</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage field={field} />
              </div>
            );
          }}
        />
        <form.Subscribe
          selector={(state) => state.values.type}
          children={(type) => (
            <form.Field
              name="category"
              children={(field) => {
                return (
                  <div className="space-y-2 flex-1">
                    <Label htmlFor={field.name}>Category:</Label>
                    <Select
                      disabled={categoryDefault?.categoryId ? true : false}
                      onValueChange={(value) => field.handleChange(value)}
                      value={field.state.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryData
                          ?.filter((item) => item.type === type)
                          .map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <FormMessage field={field} />
                  </div>
                );
              }}
            />
          )}
        />
      </div>

      <form.Field
        name="event"
        children={(field) => {
          return (
            <div className="space-y-2 flex-1">
              <Label htmlFor={field.name}>Event:</Label>
              <Select
                onValueChange={(value) => field.handleChange(value)}
                value={field.state.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventData?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage field={field} />
            </div>
          );
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex flex-row items-center w-full gap-2">
            <Button className="flex-1" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : isAddMode ? "Submit" : "Update"}
            </Button>
            <Button
              size={"icon"}
              variant={"destructive"}
              type="reset"
              onClick={() => {
                form.reset();
                form.setFieldValue("event", undefined);
              }}
            >
              <TrashIcon />
            </Button>
          </div>
        )}
      />
    </form>
  );
}
