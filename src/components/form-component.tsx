import { AnyFieldApi } from "@tanstack/react-form";

export function FormMessage({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.errors.length ? (
        <p className="text-[0.8rem] font-medium text-destructive">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </p>
      ) : null}
    </>
  );
}
export function FormDescription({ children }: { children: string }) {
  return <div className="text-[0.8rem] text-muted-foreground">{children}</div>;
}
