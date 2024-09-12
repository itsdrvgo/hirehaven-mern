import type { Document } from "mongoose";

export interface CategoryData {
    name: string;
    slug: string;
}

export type CreateCategoryData = Omit<CategoryData, "slug">;

export type CategoryDocument = CategoryData & Document;
