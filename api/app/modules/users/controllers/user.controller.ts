import type { Request, Response } from "express";
import { MongooseError } from "mongoose";
import { TOKENS } from "../../../config/const.js";
import { comparePasswords, hashPassword } from "../../../lib/bcrypt/index.js";
import { AppError } from "../../../lib/helpers/index.js";
import { mailer } from "../../../lib/nodemailer/index.js";
import {
    CResponse,
    generateFileURL,
    getDefaultImageUrl,
    getFilePathFromURL,
    handleError,
    unlinkFile,
} from "../../../lib/utils.js";
import {
    queryInfiniteUserSchema,
    updateUserPasswordSchema,
    updateUserRoleSchema,
    updateUserSchema,
} from "../../../lib/validations/index.js";
import { userRepo } from "../repositories/user.repo.js";

class UserController {
    getUsers = async (req: Request, res: Response) => {
        try {
            const { error, value } = queryInfiniteUserSchema.validate(
                req.query
            );
            if (error) throw error;

            const { page, limit, type, paginated } = value;

            if (!paginated) {
                const users = await userRepo.get({
                    ...(type && { role: type }),
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: users,
                });
            } else {
                const users = await userRepo.getInfinite({
                    filter: {
                        ...(type && { role: type }),
                    },
                    options: {
                        page: page,
                        limit: limit,
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: users,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const user = await userRepo.getById(id!);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: user,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const { error, value } = updateUserSchema.validate(req.body);
            if (error) throw error;

            const { id } = req.params;

            const currentUserId = req.ctx?.user.id;
            if (!currentUserId)
                throw new AppError("You are not logged in", "UNAUTHORIZED");

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const currentUser = await userRepo.getById(currentUserId);
            if (!currentUser)
                throw new AppError(
                    "You are not logged in. Please log in again",
                    "UNAUTHORIZED"
                );

            if (
                currentUser.id === existingUser.id &&
                Object.keys(value).includes("isRestricted")
            )
                throw new AppError(
                    "You cannot update your own restriction status",
                    "BAD_REQUEST"
                );

            if (
                currentUser.role === "admin" &&
                Object.keys(value).some(
                    (key) => !["status", "isRestricted"].includes(key)
                )
            )
                throw new AppError(
                    "Admins are not allowed to update other user's data",
                    "BAD_REQUEST"
                );

            await userRepo.update(existingUser.id, value);

            if (
                (!existingUser.isProfileCompleted &&
                    value.phone &&
                    value.address &&
                    Object.keys(value.address).length > 0) ||
                (value.phone && existingUser.address) ||
                (value.address && existingUser.phone) ||
                (existingUser.phone && existingUser.address)
            )
                await userRepo.update(existingUser.id, {
                    isProfileCompleted: true,
                });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateRole = async (req: Request, res: Response) => {
        try {
            const { error, value } = updateUserRoleSchema.validate(req.body);
            if (error) throw error;

            const { id } = req.params;

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            await userRepo.update(existingUser.id, {
                role: value.role,
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updatePassword = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { error, value } = updateUserPasswordSchema.validate(
                req.body
            );
            if (error) throw error;

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const isPasswordValid = await comparePasswords(
                value.oldPassword,
                existingUser.password
            );
            if (!isPasswordValid)
                throw new AppError("Old password is incorrect", "BAD_REQUEST");

            const hashedPassword = await hashPassword(value.newPassword);

            await userRepo.update(existingUser.id, {
                password: hashedPassword,
            });

            await mailer.sendPasswordUpdated({
                user: {
                    email: existingUser.email,
                    username: existingUser.firstName,
                },
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    updateResume = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const file = req.file;
            if (!file) throw new AppError("No file uploaded", "BAD_REQUEST");

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const resumeUrl = generateFileURL(file);

            if (existingUser.resumeUrl)
                unlinkFile(getFilePathFromURL(existingUser.resumeUrl));

            await userRepo.update(existingUser.id, {
                resumeUrl,
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            if (!(err instanceof MongooseError)) unlinkFile(req.file?.path);
            return handleError(err, res);
        }
    };

    updateAvatar = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const file = req.file;
            if (!file) throw new AppError("No file uploaded", "BAD_REQUEST");

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            const avatarUrl = generateFileURL(file);

            if (existingUser.avatarUrl !== getDefaultImageUrl())
                unlinkFile(getFilePathFromURL(existingUser.avatarUrl));

            await userRepo.update(existingUser.id, {
                avatarUrl,
            });

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            if (!(err instanceof MongooseError)) unlinkFile(req.file?.path);
            return handleError(err, res);
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const currentUserId = req.ctx?.user.id;
            if (!currentUserId)
                throw new AppError("You are not logged in", "UNAUTHORIZED");

            const existingUser = await userRepo.getById(id!);
            if (!existingUser)
                throw new AppError("User not found", "NOT_FOUND");

            if (existingUser.avatarUrl !== getDefaultImageUrl())
                unlinkFile(getFilePathFromURL(existingUser.avatarUrl));
            if (existingUser.resumeUrl)
                unlinkFile(getFilePathFromURL(existingUser.resumeUrl));

            if (currentUserId === existingUser.id) {
                const cookieName =
                    existingUser.role === "admin"
                        ? TOKENS.ADMIN_TOKEN
                        : existingUser.role === "poster"
                          ? TOKENS.POSTER_TOKEN
                          : TOKENS.SEEKER_TOKEN;

                res.clearCookie(cookieName);
            }

            await userRepo.delete(existingUser.id);

            await mailer.sendAccountDeleted({
                user: {
                    email: existingUser.email,
                    username: existingUser.firstName,
                },
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

export const userController = new UserController();
