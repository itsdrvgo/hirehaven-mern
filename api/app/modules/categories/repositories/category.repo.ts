import type { FilterQuery } from "mongoose";
import type {
    CategoryData,
    CategoryDocument,
    CreateCategoryData,
    JobDocument,
    UserDocument,
} from "../../../interfaces/index.js";
import { db } from "../../../lib/db/index.js";

type AggregatedCategory = CategoryDocument & {
    id: string;
    jobs: (JobDocument & {
        id: string;
        postedBy: Omit<UserDocument, "password" | "updatedAt"> & {
            id: string;
        };
    })[];
};

class CategoryRepo {
    get = async (filter?: FilterQuery<CategoryData>) => {
        return await db.categories.aggregate<AggregatedCategory>([
            filter
                ? {
                      $match: filter,
                  }
                : {
                      $match: {},
                  },
            {
                $lookup: {
                    from: "jobs",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "jobs",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "postedBy",
                                foreignField: "_id",
                                as: "postedBy",
                                pipeline: [
                                    {
                                        $project: {
                                            password: 0,
                                            updatedAt: 0,
                                        },
                                    },
                                    {
                                        $addFields: {
                                            id: { $toString: "$_id" },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: "$postedBy",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                            },
                        },
                    ],
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    jobCount: { $size: "$jobs" },
                },
            },
        ]);
    };

    getById = async (id: string) => {
        const category = await db.categories.aggregate<AggregatedCategory>([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: id,
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "jobs",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "postedBy",
                                foreignField: "_id",
                                as: "postedBy",
                                pipeline: [
                                    {
                                        $project: {
                                            password: 0,
                                            updatedAt: 0,
                                        },
                                    },
                                    {
                                        $addFields: {
                                            id: { $toString: "$_id" },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: "$postedBy",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    jobCount: { $size: "$jobs" },
                },
            },
        ]);

        return category[0];
    };

    getBySlug = async (slug: string) => {
        return await db.categories.findOne({ slug });
    };

    getOthersBySlug = async (slug: string, id: string) => {
        return await db.categories.find({
            slug,
            _id: { $ne: id },
        });
    };

    create = async (
        data: CreateCategoryData & {
            slug: string;
        }
    ) => {
        return await db.categories.create(data);
    };

    update = async (
        id: string,
        data: CreateCategoryData & {
            slug: string;
        }
    ) => {
        return await db.categories.updateOne({ _id: id }, data);
    };

    delete = async (id: string) => {
        return await db.categories.deleteOne({ _id: id });
    };
}

export const categoryRepo = new CategoryRepo();
