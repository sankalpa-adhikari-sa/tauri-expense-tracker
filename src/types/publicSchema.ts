import { z } from "zod";

const BaseCategorySchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  type: z.enum(["income", "expense"]),
});

const CategorySchema = BaseCategorySchema.extend({
  id: z.string(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
});
const BaseSourceSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
});

const SourceSchema = BaseSourceSchema.extend({
  id: z.string(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
});

const BaseEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  budget: z.number().nullable(),
});
const EventSchema = BaseEventSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
});

const BaseTransactionSchema = z.object({
  name: z.string().trim().min(3, "Name must be atleast 3 characters long"),
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string().uuid(),
  source: z.string().uuid(),
  event: z.string().uuid().optional(),
});

const TransactionSchema = z.object({
  name: z.string().trim().min(3, "Name must be atleast 3 characters long"),
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(["income", "expense"]),
  }),
  source: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  event: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
});
const BaseBudgetSchema = z.object({
  name: z.string().trim().min(3, "Name must be atleast 3 characters long"),
  amount: z.number(),
  start: z.string().datetime(),
  end: z.string().datetime(),
});
const BudgetSchema = BaseBudgetSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
});

export {
  CategorySchema,
  BaseCategorySchema,
  BaseEventSchema,
  EventSchema,
  SourceSchema,
  BaseSourceSchema,
  BaseTransactionSchema,
  TransactionSchema,
  BaseBudgetSchema,
  BudgetSchema,
};
