import Joi from "joi";
import type {
    CategoryData,
    CreateCategoryData,
} from "../../interfaces/index.js";

export const categorySchema = Joi.object<CategoryData>({
    name: Joi.string().required(),
    slug: Joi.string().required().lowercase(),
});

export const createCategorySchema = Joi.object<CreateCategoryData>({
    name: categorySchema.extract("name"),
});
