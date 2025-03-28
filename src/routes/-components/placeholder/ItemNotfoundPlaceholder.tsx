import { LucideIcon } from "lucide-react";
import { ReactElement } from "react";

export default function ItemNotfoundPlaceholder({
  icon,
  title,
  description,
}: {
  icon: ReactElement<LucideIcon>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-[300px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex w-full flex-col items-center justify-center text-center">
        {icon}
        <h1 className="mt-4 text-lg font-semibold">{title}</h1>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
