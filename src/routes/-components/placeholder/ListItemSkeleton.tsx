import { Skeleton } from "@/components/ui/skeleton";

export default function ListItemSkeleton() {
  return (
    <Skeleton className="w-full h-16 bg-accent py-3 px-4 flex flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Skeleton className="w-[80px] h-4 bg-primary/10" />
          <Skeleton className="w-[60px] h-4 bg-primary/10" />
        </div>
        <Skeleton className="w-[190px] h-4 bg-primary/10" />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="rounded-full bg-primary/10 size-9" />
        <Skeleton className="rounded-full bg-primary/10 size-9" />
      </div>
    </Skeleton>
  );
}
