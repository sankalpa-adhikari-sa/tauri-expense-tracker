import { BaseSourceSchema, SourceSchema } from "@/types/publicSchema";
import { FormDescription, FormMessage } from "@/components/form-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formOptions, useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { z } from "zod";
import { useSource } from "@/hooks/useSource";
import { useAuth } from "@/lib/authProvider";

export function SourceForm({ data }: { data?: z.infer<typeof SourceSchema> }) {
  const isAddMode = !data;
  const { addSource, updateSourceById } = useSource();
  const addSourceData = addSource();
  const updateSourceData = updateSourceById();
  const auth = useAuth();

  const formOpts = formOptions({
    defaultValues: isAddMode
      ? ({
          name: "",

          description: "",
        } as z.infer<typeof BaseSourceSchema>)
      : {
          name: data?.name ?? "",

          description: data?.description ?? "",
        },
  });

  const form = useForm({
    ...formOpts,
    validators: {
      onChange: BaseSourceSchema,
    },
    onSubmit: async ({ value }) => {
      isAddMode
        ? addSourceData.mutate({
            ...value,
            name: value.name.trim(),
            user_id: auth.session?.user.id,
          })
        : updateSourceData.mutate({
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
                placeholder="Source Name"
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
                placeholder="Source Description"
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
