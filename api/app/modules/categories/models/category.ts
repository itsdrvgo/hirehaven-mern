import { model, Schema } from "mongoose";
import type { CategoryDocument } from "../../../interfaces/index.js";

const categorySchema = new Schema<CategoryDocument>(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        slug: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Category = model<CategoryDocument>("category", categorySchema);
