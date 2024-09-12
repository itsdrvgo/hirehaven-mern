import type { Request, Response } from "express";
import { AppError } from "../../../lib/helpers/index.js";
import { CResponse, handleError, slugify } from "../../../lib/utils.js";
import { categoryRepo } from "../repositories/category.repo.js";
import { createCategorySchema } from "../../../lib/validations/index.js";
import { jobRepo } from "../../jobs/repositories/job.repo.js";

class CategoryController {
    getCategories = async (req: Request, res: Response) => {
        try {
            const categories = await categoryRepo.get();

            return CResponse({
                res,
                message: "OK",
                data: categories,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    getCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const category = await categoryRepo.getById(id!);
            if (!category)
                throw new AppError("Category not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: category,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createCategory = async (req: Request, res: Response) => {
        try {
            const { error, value } = createCategorySchema.validate(req.body);
            if (error) throw error;

            const slug = slugify(value.name);

            const existingCategory = await categoryRepo.getBySlug(slug);
            if (existingCategory)
                throw new AppError(
                    "Category with this name already exists",
                    "CONFLICT"
                );

            const category = await categoryRepo.create({
                ...value,
                slug,
            });

            return CResponse({
                res,
                message: "OK",
                data: category,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { error, value } = createCategorySchema.validate(req.body);
            if (error) throw error;

            const slug = slugify(value.name);

            const otherCategories = await categoryRepo.getOthersBySlug(
                slug,
                id!
            );
            if (otherCategories.length > 0)
                throw new AppError(
                    "Category with this name already exists",
                    "CONFLICT"
                );

            const existingCategory = await categoryRepo.getById(id!);
            if (!existingCategory)
                throw new AppError("Category not found", "NOT_FOUND");

            if (existingCategory.slug === slug)
                throw new AppError("You can't use the same name", "CONFLICT");

            await categoryRepo.update(id!, {
                ...value,
                slug,
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteCategory = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existingCategory = await categoryRepo.getById(id!);
            if (!existingCategory)
                throw new AppError("Category not found", "NOT_FOUND");

            await categoryRepo.delete(id!);
            await jobRepo.deleteMany({
                categoryId: existingCategory.id,
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const categoryController = new CategoryController();
