import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import type { ApplicationData } from "../../../interfaces/index.js";
import { AppError } from "../../../lib/helpers/index.js";
import { CResponse, handleError } from "../../../lib/utils.js";
import {
    queryInfiniteApplicationSchema,
    updateApplicationSchema,
} from "../../../lib/validations/index.js";
import { userRepo } from "../../users/repositories/user.repo.js";
import { applicationRepo } from "../repositories/application.repo.js";

class ApplicationController {
    getApplications = async (req: Request, res: Response) => {
        try {
            const { error, value } = queryInfiniteApplicationSchema.validate(
                req.query
            );
            if (error) throw error;

            const { page, limit, paginated, aId, jId } = value;

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const existingUser = await userRepo.getById(userId);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            if (existingUser.role === "admin")
                throw new AppError(
                    "Admins can't view applications",
                    "FORBIDDEN"
                );

            let filter: FilterQuery<ApplicationData> = {};

            if (existingUser.role === "poster") {
                if (!aId && !jId)
                    filter = {
                        $expr: {
                            $eq: [
                                "$job.postedBy._id",
                                {
                                    $toObjectId: userId,
                                },
                            ],
                        },
                    };

                if (aId || jId) {
                    const conditions = [];

                    if (jId)
                        conditions.push(
                            {
                                $expr: {
                                    $eq: [
                                        "$jobId",
                                        {
                                            $toObjectId: jId,
                                        },
                                    ],
                                },
                            },
                            {
                                $expr: {
                                    $eq: ["$posterId", userId],
                                },
                            }
                        );

                    if (aId)
                        conditions.push({
                            $expr: {
                                $eq: [
                                    "$applicantId",
                                    {
                                        $toObjectId: aId,
                                    },
                                ],
                            },
                        });

                    filter = {
                        $and: conditions,
                    };
                }
            } else {
                const conditions = [];

                if (!aId && !jId)
                    conditions.push({
                        $expr: {
                            $eq: [
                                "$applicantId",
                                {
                                    $toObjectId: userId,
                                },
                            ],
                        },
                    });

                if (aId) {
                    if (aId !== userId)
                        throw new AppError(
                            "You can only view your own applications",
                            "FORBIDDEN"
                        );

                    conditions.push({
                        $expr: {
                            $eq: [
                                "$applicantId",
                                {
                                    $toObjectId: aId,
                                },
                            ],
                        },
                    });
                }

                if (jId)
                    conditions.push(
                        {
                            $expr: {
                                $eq: [
                                    "$jobId",
                                    {
                                        $toObjectId: jId,
                                    },
                                ],
                            },
                        },
                        {
                            $expr: {
                                $eq: [
                                    "$applicantId",
                                    {
                                        $toObjectId: userId,
                                    },
                                ],
                            },
                        }
                    );

                filter = { $and: conditions };
            }

            if (!paginated) {
                const applications = await applicationRepo.get(filter);

                return CResponse({
                    res,
                    message: "OK",
                    data: applications,
                });
            } else {
                const applications = await applicationRepo.getInfinite({
                    filter,
                    options: {
                        page,
                        limit,
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: applications,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getApplication = async (req: Request, res: Response) => {
        try {
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

            const application = await applicationRepo.getById(id!);
            if (!application)
                throw new AppError("Application not found", "NOT_FOUND");

            if (existingUser.role === "admin")
                throw new AppError(
                    "Admins can't view applications",
                    "FORBIDDEN"
                );

            if (
                existingUser.role === "poster" &&
                application.job.postedBy.id !== userId
            )
                throw new AppError(
                    "You can only view applications for your jobs",
                    "FORBIDDEN"
                );

            if (
                existingUser.role === "seeker" &&
                application.applicant.id !== userId
            )
                throw new AppError(
                    "You can only view your own applications",
                    "FORBIDDEN"
                );

            return CResponse({
                res,
                message: "OK",
                data: application,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateApplication = async (req: Request, res: Response) => {
        try {
            const { error, value } = updateApplicationSchema.validate(req.body);
            if (error) throw error;

            const { id } = req.params;

            const existingApplication = await applicationRepo.getById(id!);
            if (!existingApplication)
                throw new AppError("Application not found", "NOT_FOUND");

            if (existingApplication.status === value.status)
                throw new AppError(
                    "Application already has this status",
                    "BAD_REQUEST"
                );

            if (
                existingApplication.status === "rejected" ||
                existingApplication.status === "hired"
            )
                throw new AppError(
                    "You can't update a rejected or hired application",
                    "FORBIDDEN"
                );

            if (
                existingApplication.status === "reviewed" &&
                value.status !== "hired"
            )
                throw new AppError(
                    "You can only update a reviewed application to hired or rejected",
                    "FORBIDDEN"
                );

            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const existingUser = await userRepo.getById(userId);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            if (existingApplication.job.postedBy.id !== userId)
                throw new AppError(
                    "You are not authorized to update this application",
                    "FORBIDDEN"
                );

            await applicationRepo.update(id!, value);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const applicationController = new ApplicationController();
