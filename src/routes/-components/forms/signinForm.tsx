import { FormDescription, FormMessage } from "@/components/form-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthentication } from "@/hooks/useAuthentication";
import { signinSchema } from "@/types/authSchema";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

export function SigninForm() {
  const { signIn } = useAuthentication();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signinSchema,
    },
    onSubmit: async ({ value }) => {
      toast.promise(
        new Promise<void>((resolve, reject) => {
          signIn.mutate(value, {
            onSuccess: () => resolve(),
            onError: () => reject(),
          });
        }),
        {
          loading: "Logging in...",
          success: () => {
            return "Welcome back!";
          },
          error: "Login failed. Please try again.",
          onAutoClose: () => {
            navigate({ to: "/dashboard" });
          },
          duration: 1000,
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
      <form.Subscribe
        selector={(state) => state.errorMap}
        children={(errors) => (
          <form.Field
            name="email"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <Label
                    className={errors.onChange?.["email"] && "text-destructive"}
                    htmlFor={field.name}
                  >
                    Email:
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FormDescription>hi</FormDescription>
                  <FormMessage field={field} />
                </div>
              );
            }}
          />
        )}
      />

      <form.Subscribe
        selector={(state) => state.errorMap}
        children={(errors) => (
          <form.Field
            name="password"
            children={(field) => {
              return (
                <div className="space-y-2">
                  <Label
                    className={
                      errors.onChange?.["password"] && "text-destructive"
                    }
                    htmlFor={field.name}
                  >
                    Password:
                  </Label>
                  <Input
                    id={field.name}
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FormDescription>hi</FormDescription>
                  <FormMessage field={field} />
                </div>
              );
            }}
          />
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex flex-row items-center w-full gap-2">
            <Button className="flex-1" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
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
