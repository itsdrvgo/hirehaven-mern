import type { FilterQuery, PaginateOptions } from "mongoose";
import type {
    ApplicationData,
    ApplicationDocument,
    CreateApplicationData,
    JobDocument,
    UpdateApplicationData,
    UserDocument,
} from "../../../interfaces/index.js";
import { db } from "../../../lib/db/index.js";

type AggregatedApplication = ApplicationDocument & {
    id: string;
    applicant: Omit<UserDocument, "password" | "updatedAt"> & {
        id: string;
    };
    job: JobDocument & {
        id: string;
        postedBy: Omit<UserDocument, "password" | "updatedAt"> & {
            id: string;
        };
        posterId: string;
    };
};

class ApplicationRepo {
    get = async (filter?: FilterQuery<ApplicationData>) => {
        return await db.applications.aggregate<AggregatedApplication>([
            {
                $lookup: {
                    from: "users",
                    localField: "applicantId",
                    foreignField: "_id",
                    as: "applicant",
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
                    path: "$applicant",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "job",
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
                $unwind: {
                    path: "$job",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    posterId: "$job.postedBy.id",
                },
            },
            filter
                ? {
                      $match: filter,
                  }
                : {
                      $match: {},
                  },
        ]);
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }: {
        filter?: FilterQuery<ApplicationData>;
        options: PaginateOptions;
    }) => {
        const applications = db.applications.aggregate<AggregatedApplication>([
            {
                $lookup: {
                    from: "users",
                    localField: "applicantId",
                    foreignField: "_id",
                    as: "applicant",
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
                    path: "$applicant",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "job",
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
                $unwind: {
                    path: "$job",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    posterId: "$job.postedBy.id",
                },
            },
            filter
                ? {
                      $match: filter,
                  }
                : {
                      $match: {},
                  },
        ]);

        return await db.applications.aggregatePaginate(applications, options);
    };

    getById = async (id: string) => {
        const application =
            await db.applications.aggregate<AggregatedApplication>([
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
                        from: "users",
                        localField: "applicantId",
                        foreignField: "_id",
                        as: "applicant",
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
                        path: "$applicant",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "job",
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
                    $unwind: {
                        path: "$job",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        id: { $toString: "$_id" },
                    },
                },
            ]);

        return application[0];
    };

    create = async (
        data: CreateApplicationData & {
            applicantId: string;
            jobId: string;
        }
    ) => {
        return await db.applications.create(data);
    };

    update = async (id: string, data: UpdateApplicationData) => {
        return await db.applications.updateOne({ _id: id }, data);
    };
}

export const applicationRepo = new ApplicationRepo();
