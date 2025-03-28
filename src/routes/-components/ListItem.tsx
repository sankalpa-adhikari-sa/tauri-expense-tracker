import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon, PenIcon, XIcon } from "lucide-react";
import { ResponsiveDrawerDialog } from "@/components/responsive-drawer-dialog";

export default function ListItem({
  dialogContent,
  dialogTitle,
  dialogDescription,
  data,
  onDelete,
}: {
  dialogContent: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
  data: { name: string; type: string; id: string; description: string };
  onDelete: () => void;
}) {
  const isOptimisticItem = data.id.toString().startsWith("temp-");
  const isOptimisticDeletingItem = data.id.toString().startsWith("deleting-");
  const isOptimisticUpdatingItem = data.id.toString().startsWith("updating-");

  return (
    <div className="w-full bg-accent py-3 px-4 flex flex-row itens-center justify-between rounded-md group hover:bg-gradient-to-r hover:from-muted-foreground hover:to-primary hover:text-primary-foreground">
      <div className="flex flex-col ">
        <p className="flex flex-row text-base font-normal capitalize gap-4">
          <span>{data.name}</span>{" "}
          {data.type && (
            <Badge variant={"destructive"} className="h-fit">
              {data.type}
            </Badge>
          )}
          {isOptimisticItem && (
            <Badge variant="outline" className="h-fit">
              Saving... <Loader2Icon size={12} className="animate-spin" />
            </Badge>
          )}
          {isOptimisticDeletingItem && (
            <Badge variant="outline" className="h-fit">
              Deleting... <Loader2Icon size={12} className="animate-spin" />
            </Badge>
          )}
          {isOptimisticUpdatingItem && (
            <Badge variant="outline" className="h-fit">
              Updating... <Loader2Icon size={12} className="animate-spin" />
            </Badge>
          )}
        </p>
        {data.description && (
          <p className="text-sm font-normal text-muted-foreground">
            {data.description}
          </p>
        )}
      </div>

      <div className="flex flex-row gap-2">
        <ResponsiveDrawerDialog
          trigger={
            <Button
              size={"icon"}
              variant={"default"}
              className={cn(
                "rounded-full cursor-pointer group-hover:bg-muted-foreground/40 group-hover:text-primary-foreground hover:bg-muted-foreground/50",
                isOptimisticItem ||
                  isOptimisticDeletingItem ||
                  isOptimisticUpdatingItem
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              )}
              disabled={
                isOptimisticItem ||
                isOptimisticDeletingItem ||
                isOptimisticUpdatingItem
              }
            >
              <PenIcon size={16} />
            </Button>
          }
          headerProps={{ title: dialogTitle, subtitle: dialogDescription }}
        >
          {dialogContent}
        </ResponsiveDrawerDialog>

        <Button
          size={"icon"}
          variant={"default"}
          className={cn(
            "rounded-full cursor-pointer group-hover:bg-muted-foreground/40 group-hover:text-primary-foreground  hover:bg-destructive hover:text-white",
            isOptimisticItem ||
              isOptimisticDeletingItem ||
              isOptimisticUpdatingItem
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          )}
          onClick={onDelete}
          disabled={
            isOptimisticItem ||
            isOptimisticDeletingItem ||
            isOptimisticUpdatingItem
          }
        >
          <XIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
