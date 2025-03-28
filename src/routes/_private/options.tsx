import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import {
  HandCoinsIcon,
  InfoIcon,
  LayoutGridIcon,
  PlusIcon,
  TrendingDownIcon,
} from "lucide-react";
import ListItem from "@/routes/-components/ListItem";
import { useCategory } from "@/hooks/useCategory";
import { toast } from "sonner";
import { CategoryForm } from "../-components/forms/CategoryForm";
import { ResponsiveDrawerDialog } from "@/components/responsive-drawer-dialog";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMemo, useState } from "react";

import { useSource } from "@/hooks/useSource";
import { SourceForm } from "../-components/forms/sourceForm";
import { Skeleton } from "@/components/ui/skeleton";
import ListItemSkeleton from "../-components/skeleton/ListItemSkeleton";

export const Route = createFileRoute("/_private/options")({
  component: RouteComponent,
});
type viewModeType = "all" | "income" | "expense";
function RouteComponent() {
  const [categoryViewMode, setCategoryViewMode] = useState<viewModeType>("all");

  const { getAllCategory, deleteCategory } = useCategory();
  const {
    data: category,
    isError: isCategoryError,
    isLoading: isCategoryLoading,
  } = getAllCategory();

  const { getAllSource, deleteSource } = useSource();
  const {
    data: source,
    isError: isSourceError,
    isLoading: isSourceLoading,
  } = getAllSource();

  const filteredCategories = useMemo(() => {
    if (categoryViewMode === "all") return category;
    return category?.filter((cat) => cat.type === categoryViewMode);
  }, [category, categoryViewMode]);

  const deleteCategoryMutation = deleteCategory();

  const handleCategoryDelete = async ({ id }: { id: string }) => {
    console.log(id);
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteCategoryMutation.mutate(id, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      }),
      {
        loading: "Deleting Category...",
        success: () => {
          return "Successfully deleted";
        },
        error: "Deletion failed. Please try again.",
        duration: 1000,
      }
    );
  };

  const deleteSourceMutation = deleteSource();

  const handleSourceDelete = async ({ id }: { id: string }) => {
    console.log(id);
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteSourceMutation.mutate(id, {
          onSuccess: () => resolve(),
          onError: () => reject(),
        });
      }),
      {
        loading: "Deleting Source...",
        success: () => {
          return "Successfully deleted";
        },
        error: "Deletion failed. Please try again.",
        duration: 1000,
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Category</h2>
        <div className="flex flex-row items-center justify-between">
          <ToggleGroup
            value={categoryViewMode}
            onValueChange={(value: viewModeType) =>
              value && setCategoryViewMode(value)
            }
            type="single"
          >
            <ToggleGroupItem value="all" aria-label="Toggle bold">
              <LayoutGridIcon size={16} />
            </ToggleGroupItem>

            <ToggleGroupItem value="income" aria-label="Toggle italic">
              <HandCoinsIcon size={16} />
            </ToggleGroupItem>

            <ToggleGroupItem value="expense" aria-label="Toggle strikethrough">
              <TrendingDownIcon className="text-destructive" size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
          <ResponsiveDrawerDialog
            trigger={
              <Button>
                <PlusIcon size={16} />
                <span>Category</span>
              </Button>
            }
            headerProps={{ title: "Category" }}
          >
            <CategoryForm />
          </ResponsiveDrawerDialog>
        </div>
        {isCategoryLoading ? (
          <div className="flex flex-col w-full gap-3">
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </div>
        ) : filteredCategories && filteredCategories.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredCategories?.map((item) => (
              <ListItem
                dialogTitle="Update Categories"
                key={item.id}
                data={item}
                onDelete={() => handleCategoryDelete({ id: item.id })}
                dialogContent={<CategoryForm data={item} />}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <InfoIcon size={24} />
              <h1 className="mt-4 text-lg font-semibold">
                No categories found
              </h1>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven't added any Categories.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className=" w-full flex flex-row items-center justify-between">
          <h2 className="text-lg font-medium">Payment Methods</h2>

          <ResponsiveDrawerDialog
            trigger={
              <Button>
                <PlusIcon size={16} />
                <span>Payment Method</span>
              </Button>
            }
            headerProps={{ title: "Source" }}
          >
            <SourceForm />
          </ResponsiveDrawerDialog>
        </div>
        <div>
          {isSourceLoading ? (
            <div className="flex flex-col w-full gap-3">
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
              <ListItemSkeleton />
            </div>
          ) : source && source.length > 0 ? (
            <div className="flex flex-col gap-3">
              {source?.map((item) => (
                <ListItem
                  dialogTitle="Update Sources"
                  key={item.id}
                  data={item}
                  onDelete={() => handleSourceDelete({ id: item.id })}
                  dialogContent={<SourceForm data={item} />}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <InfoIcon size={24} />
                <h1 className="mt-4 text-lg font-semibold">
                  No payment methods found
                </h1>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven't added any Payment Methods.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
