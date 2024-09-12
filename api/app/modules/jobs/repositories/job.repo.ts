import type { FilterQuery, PaginateOptions, PipelineStage } from "mongoose";
import type {
    ApplicationDocument,
    CreateJobData,
    JobData,
    JobDocument,
    UpdateJobData,
    UserDocument,
} from "../../../interfaces/index.js";
import { db } from "../../../lib/db/index.js";

type AggregatedJob = JobDocument & {
    id: string;
    postedBy: Omit<UserDocument, "password" | "updatedAt"> & {
        id: string;
    };
    applicants: ApplicationDocument &
        {
            id: string;
            applicant: Omit<UserDocument, "password" | "updatedAt"> & {
                id: string;
            };
        }[];
    applications: number;
};

class JobRepo {
    get = async (pipeline: PipelineStage[] = []) => {
        return await db.jobs.aggregate<AggregatedJob>([
            ...pipeline,
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
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applicants",
                    pipeline: [
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
                            $project: {
                                applicantId: 0,
                                jobId: 0,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    applications: {
                        $size: "$applicants",
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
    };

    getInfinite = async ({
        pipeline = [],
        options = {
            page: 1,
            limit: 10,
        },
    }: {
        pipeline?: PipelineStage[];
        options: PaginateOptions;
    }) => {
        const jobs = db.jobs.aggregate<AggregatedJob>([
            ...pipeline,
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
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applicants",
                    pipeline: [
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
                            $project: {
                                applicantId: 0,
                                jobId: 0,
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    applications: {
                        $size: "$applicants",
                    },
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        return await db.jobs.aggregatePaginate(jobs, options);
    };

    getById = async (id: string) => {
        const job = await db.jobs.aggregate<AggregatedJob>([
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
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applicants",
                    pipeline: [
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
                    ],
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                    applications: {
                        $size: "$applicants",
                    },
                },
            },
        ]);

        return job[0];
    };

    create = async (
        data: CreateJobData & {
            logoUrl?: string;
            postedBy: string;
        }
    ) => {
        return await db.jobs.create(data);
    };

    update = async (id: string, data: UpdateJobData) => {
        return await db.jobs.updateOne({ _id: id }, data);
    };

    delete = async (id: string) => {
        return await db.jobs.deleteOne({ _id: id });
    };

    deleteMany = async (filter?: FilterQuery<JobData>) => {
        return await db.jobs.deleteMany({
            ...(filter && filter),
        });
    };
}

export const jobRepo = new JobRepo();
