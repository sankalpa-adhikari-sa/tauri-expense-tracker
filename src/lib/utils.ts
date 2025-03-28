import { TransactionSchema } from "@/types/publicSchema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function generateColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }

  const hue = hash % 360;
  const saturation = 70 + (hash % 30);
  const lightness = 50 + (hash % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

type AggregatedCategory = {
  name: string;
  id: string;
  value: number;
  type: "income" | "expense";
  fill: string;
};

export function aggregateByCategory({
  transactions,
  type,
}: {
  transactions: z.infer<typeof TransactionSchema>[];
  type: "income" | "expense";
}): AggregatedCategory[] {
  const categoryMap = transactions
    .filter((item) => item.type === type)
    .reduce<Record<string, AggregatedCategory>>((acc, { amount, category }) => {
      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          id: category.id,
          type: category.type,
          value: 0,
          fill: generateColor(category.id),
        };
      }

      acc[category.id].value += amount;
      return acc;
    }, {});

  return Object.values(categoryMap);
}
