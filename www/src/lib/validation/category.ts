import { z } from "zod";
import { aggregatedJobSchema } from "./job";

export const categorySchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Category name must be at least 3 characters long"),
    slug: z.string().min(3, "Category slug must be at least 3 characters long"),
    jobs: z.array(aggregatedJobSchema),
    jobCount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createCategorySchema = categorySchema.pick({
    name: true,
});

export const updateCategorySchema = createCategorySchema;

export type CategoryData = z.infer<typeof categorySchema>;
export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>;
