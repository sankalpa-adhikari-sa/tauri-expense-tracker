import { BaseCategorySchema, CategorySchema } from "@/types/publicSchema";
import { FormDescription, FormMessage } from "@/components/form-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formOptions, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { z } from "zod";
import { useCategory } from "@/hooks/useCategory";
import { useAuth } from "@/lib/authProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function CategoryForm({
  type,
  data,
}: {
  type?: "income" | "expense";
  data?: z.infer<typeof CategorySchema>;
}) {
  const isAddMode = !data;
  const { addCategory, updateCategoryById } = useCategory();
  const addCategoryData = addCategory();
  const updateCategoryData = updateCategoryById();
  const auth = useAuth();

  const formOpts = formOptions({
    defaultValues: isAddMode
      ? ({
          name: "",
          type: type ?? "expense",
          description: "",
        } as z.infer<typeof BaseCategorySchema>)
      : {
          name: data?.name ?? "",
          type: data?.type ?? "expense",
          description: data?.description ?? "",
        },
  });

  const form = useForm({
    ...formOpts,
    validators: {
      onChange: BaseCategorySchema,
    },
    onSubmit: async ({ value }) => {
      isAddMode
        ? addCategoryData.mutate({
            ...value,
            name: value.name.trim(),
            user_id: auth.session?.user.id,
          })
        : updateCategoryData.mutate({
            id: data?.id,
            updates: {
              ...value,
              name: value.name.trim(),
              user_id: auth.session?.user.id,
            },
          });
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
                placeholder="Category Name"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FormDescription>Example: XYZbank, XYZWallet</FormDescription>
              <FormMessage field={field} />
            </div>
          );
        }}
      />
      <form.Field
        name="description"
        children={(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Description:</Label>
              <Input
                placeholder="Category Description"
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />

              <FormMessage field={field} />
            </div>
          );
        }}
      />
      <form.Field
        name="type"
        children={(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Type:</Label>
              <Select
                disabled={type ? true : false}
                onValueChange={(value) =>
                  field.handleChange(value as "income" | "expense")
                }
                defaultValue={field.state.value}
              >
                <SelectTrigger>
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
              onClick={() => form.reset()}
            >
              <TrashIcon />
            </Button>
          </div>
        )}
      />
    </form>
  );
}
