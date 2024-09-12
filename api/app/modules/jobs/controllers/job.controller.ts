import type { Request, Response } from "express";
import { MongooseError, type PipelineStage } from "mongoose";
import { AppError } from "../../../lib/helpers/index.js";
import { mailer } from "../../../lib/nodemailer/index.js";
import {
    CResponse,
    generateFileURL,
    getFilePathFromURL,
    handleError,
    unlinkFile,
} from "../../../lib/utils.js";
import {
    createApplicationSchema,
    createJobSchema,
    queryInfiniteJobSchema,
    updateJobSchema,
} from "../../../lib/validations/index.js";
import { applicationRepo } from "../../applications/repositories/application.repo.js";
import { userRepo } from "../../users/repositories/user.repo.js";
import { jobRepo } from "../repositories/job.repo.js";

class JobController {
    getJobs = async (req: Request, res: Response) => {
        try {
            const { error, value } = queryInfiniteJobSchema.validate(req.query);
            if (error) throw error;

            const {
                page,
                limit,
                paginated,
                category,
                poster,
                name,
                type,
                location,
                country,
                minSalary,
                maxSalary,
                isFeatured,
                status,
            } = value;

            const salaryFilter =
                minSalary || maxSalary
                    ? {
                          annualSalary: {
                              ...(minSalary && { $gte: minSalary }),
                              ...(maxSalary && { $lte: maxSalary }),
                          },
                      }
                    : null;

            const pipeline: PipelineStage[] = [
                {
                    $match: {
                        ...(name && {
                            position: {
                                $regex: new RegExp(name, "i"),
                            },
                        }),
                        ...(category && {
                            $expr: {
                                $eq: [
                                    "$categoryId",
                                    {
                                        $toObjectId: category,
                                    },
                                ],
                            },
                        }),
                        ...(poster && {
                            $expr: {
                                $eq: [
                                    "$postedBy",
                                    {
                                        $toObjectId: poster,
                                    },
                                ],
                            },
                        }),
                        ...(type && {
                            type: {
                                $in: type,
                            },
                        }),
                        ...(location && {
                            locationType: {
                                $in: location,
                            },
                        }),
                        ...(country && {
                            "location.country": country,
                        }),
                        ...(isFeatured && { isFeatured }),
                        ...(status && {
                            isPublished: status === "published",
                        }),
                    },
                },
                {
                    $addFields: {
                        annualSalary: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $eq: ["$salary.mode", "monthly"],
                                        },
                                        then: {
                                            $multiply: [
                                                {
                                                    $toDouble: "$salary.amount",
                                                },
                                                12,
                                            ],
                                        },
                                    },
                                    {
                                        case: {
                                            $eq: ["$salary.mode", "weekly"],
                                        },
                                        then: {
                                            $multiply: [
                                                {
                                                    $toDouble: "$salary.amount",
                                                },
                                                52,
                                            ],
                                        },
                                    },
                                    {
                                        case: {
                                            $eq: ["$salary.mode", "daily"],
                                        },
                                        then: {
                                            $multiply: [
                                                {
                                                    $toDouble: "$salary.amount",
                                                },
                                                260,
                                            ],
                                        },
                                    },
                                    {
                                        case: {
                                            $eq: ["$salary.mode", "hourly"],
                                        },
                                        then: {
                                            $multiply: [
                                                {
                                                    $toDouble: "$salary.amount",
                                                },
                                                2080,
                                            ],
                                        },
                                    },
                                ],
                                default: { $toDouble: "$salary.amount" },
                            },
                        },
                    },
                },
                {
                    $match: {
                        ...salaryFilter,
                    },
                },
                {
                    $project: {
                        annualSalary: 0,
                    },
                },
            ];

            if (!paginated) {
                const jobs = await jobRepo.get(pipeline);

                return CResponse({
                    res,
                    message: "OK",
                    data: jobs,
                });
            } else {
                const jobs = await jobRepo.getInfinite({
                    pipeline,
                    options: {
                        page,
                        limit,
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: jobs,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getJob = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const job = await jobRepo.getById(id!);
            if (!job) throw new AppError("Job not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: job,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createJob = async (req: Request, res: Response) => {
        try {
            const { error, value } = createJobSchema.validate(req.body);
            if (error) throw error;

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const existingUser = await userRepo.getById(userId);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const file = req.file;

            let logoUrl: string | undefined = undefined;
            if (file) logoUrl = generateFileURL(file);

            const job = await jobRepo.create({
                ...value,
                logoUrl,
                postedBy: userId,
            });

            return CResponse({
                res,
                message: "OK",
                data: job,
            });
        } catch (err) {
            if (!(err instanceof MongooseError)) unlinkFile(req.file?.path);
            return handleError(err, res);
        }
    };

    applyToJob = async (req: Request, res: Response) => {
        try {
            const { error, value } = createApplicationSchema.validate(req.body);
            if (error) throw error;

            const { id } = req.params;

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const existingUser = await userRepo.getById(userId);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            if (!existingUser.isProfileCompleted)
                throw new AppError(
                    "You need to complete your profile to apply to a job",
                    "BAD_REQUEST"
                );

            const existingJob = await jobRepo.getById(id!);
            if (!existingJob) throw new AppError("Job not found", "NOT_FOUND");

            if (!existingJob.status)
                throw new AppError("Job is not active", "BAD_REQUEST");

            if (!existingJob.isPublished)
                throw new AppError("Job is not published", "BAD_REQUEST");

            if (existingJob.postedBy.id === userId)
                throw new AppError(
                    "You can't apply to a job you posted",
                    "BAD_REQUEST"
                );

            const existingApplication = await applicationRepo.get({
                $expr: {
                    $and: [
                        {
                            $eq: [
                                "$applicantId",
                                {
                                    $toObjectId: userId,
                                },
                            ],
                        },
                        {
                            $eq: [
                                "$jobId",
                                {
                                    $toObjectId: id,
                                },
                            ],
                        },
                    ],
                },
            });
            if (existingApplication.length > 0) {
                throw new AppError(
                    "You have already applied to this job",
                    "BAD_REQUEST"
                );
            }

            const coverLetter = value.coverLetter;

            const resumeUrl = existingUser.resumeUrl;
            if (!resumeUrl)
                throw new AppError(
                    "You need to upload a resume to apply to a job",
                    "BAD_REQUEST"
                );

            const application = await applicationRepo.create({
                ...value,
                jobId: existingJob.id,
                applicantId: userId,
                coverLetter,
            });

            await mailer.sendJobApplied({
                company: {
                    name: existingJob.companyName,
                    position: existingJob.position,
                    email: existingJob.companyEmail,
                },
                user: {
                    username: existingUser.firstName,
                    email: existingUser.email,
                },
            });

            return CResponse({
                res,
                message: "OK",
                data: application,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateJob = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const { error, value } = updateJobSchema.validate(req.body);
            if (error) throw error;

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const job = await jobRepo.getById(id!);
            if (!job) throw new AppError("Job not found", "NOT_FOUND");

            if (job.postedBy.id !== userId)
                throw new AppError(
                    "You can only update your own jobs",
                    "FORBIDDEN"
                );

            await jobRepo.update(job.id, value);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteJob = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const job = await jobRepo.getById(id!);
            if (!job) throw new AppError("Job not found", "NOT_FOUND");

            if (job.postedBy.id !== userId)
                throw new AppError(
                    "You can only delete your own jobs",
                    "FORBIDDEN"
                );

            unlinkFile(getFilePathFromURL(job.logoUrl));
            await jobRepo.delete(job.id);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const jobController = new JobController();
