import type { Request, Response } from "express";
import {
    cookieOptions,
    JWT_EXPIRES_IN,
    TOKENS,
} from "../../../config/const.js";
import { comparePasswords, hashPassword } from "../../../lib/bcrypt/index.js";
import { AppError } from "../../../lib/helpers/index.js";
import { signJWT } from "../../../lib/jwt/index.js";
import { mailer } from "../../../lib/nodemailer/index.js";
import {
    CResponse,
    getDefaultImageUrl,
    handleError,
} from "../../../lib/utils.js";
import {
    queryUserTypeSchema,
    signInSchema,
    signUpSchema,
} from "../../../lib/validations/index.js";
import { userRepo } from "../../users/repositories/user.repo.js";

class AuthController {
    currentUser = async (req: Request, res: Response) => {
        try {
            const uId = req.ctx?.user.id;
            if (!uId)
                throw new AppError("You are not logged in", "UNAUTHORIZED");

            const user = await userRepo.getById(uId);
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

    signUp = async (req: Request, res: Response) => {
        try {
            const { error, value } = signUpSchema.validate(req.body);
            if (error) throw error;

            const existingUser = await userRepo.getByEmail(value.email);
            if (existingUser)
                throw new AppError(
                    "A user with this email already exists",
                    "BAD_REQUEST"
                );

            const hashedPassword = await hashPassword(value.password);

            const user = await userRepo.create({
                ...value,
                password: hashedPassword,
                avatarUrl: getDefaultImageUrl(),
            });

            await mailer.sendVerificationEmail({
                user: {
                    id: user.id,
                    username: user.firstName,
                    email: user.email,
                },
            });

            const token = signJWT(
                {
                    id: user.id,
                },
                process.env.JWT_SECRET,
                JWT_EXPIRES_IN
            );

            res.cookie(TOKENS.SEEKER_TOKEN, token, cookieOptions);

            return CResponse({
                res,
                message: "CREATED",
                longMessage:
                    "A verification email has been sent to your email address",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    signIn = async (req: Request, res: Response) => {
        try {
            const { error: queryUserTypeError, value: queryUserTypeValue } =
                queryUserTypeSchema.validate(req.query);
            if (queryUserTypeError) throw queryUserTypeError;

            const { type } = queryUserTypeValue;

            const { error, value } = signInSchema.validate(req.body);
            if (error) throw error;

            const user = await userRepo.getByEmail(
                value.email,
                type ?? "seeker"
            );
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            const isMatch = await comparePasswords(
                value.password,
                user.password
            );
            if (!isMatch)
                throw new AppError("Invalid credentials", "UNAUTHORIZED");

            const token = signJWT(
                {
                    id: user.id,
                },
                process.env.JWT_SECRET,
                JWT_EXPIRES_IN
            );

            res.cookie(
                type === "admin"
                    ? TOKENS.ADMIN_TOKEN
                    : type === "poster"
                      ? TOKENS.POSTER_TOKEN
                      : TOKENS.SEEKER_TOKEN,
                token,
                cookieOptions
            );

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    signOut = async (req: Request, res: Response) => {
        try {
            const { error, value } = queryUserTypeSchema.validate(req.query);
            if (error) throw error;

            const { type } = value;

            const cookieName =
                type === "admin"
                    ? TOKENS.ADMIN_TOKEN
                    : type === "poster"
                      ? TOKENS.POSTER_TOKEN
                      : TOKENS.SEEKER_TOKEN;

            res.clearCookie(cookieName);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    verifyAccount = async (req: Request, res: Response) => {
        try {
            const id = req.ctx?.user.id;
            if (!id)
                throw new AppError("You are not logged in", "UNAUTHORIZED");

            const user = await userRepo.getById(id);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            if (user.isVerified)
                throw new AppError("Account already verified", "BAD_REQUEST");

            await userRepo.update(user.id, {
                isVerified: true,
            });

            await mailer.sendEmailVerified({
                user: {
                    username: user.firstName,
                    email: user.email,
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

    resendVerificationEmail = async (req: Request, res: Response) => {
        try {
            const userId = req.ctx?.user.id;
            if (!userId)
                throw new AppError(
                    "You need to be logged in to access this route",
                    "UNAUTHORIZED"
                );

            const user = await userRepo.getById(userId);
            if (!user) throw new AppError("User not found", "NOT_FOUND");

            if (user.isVerified)
                throw new AppError(
                    "Your account is already verified",
                    "BAD_REQUEST"
                );

            await mailer.sendVerificationEmail({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.firstName,
                },
            });

            return CResponse({
                res,
                message: "OK",
                longMessage:
                    "A new verification email has been sent to your email address",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const authController = new AuthController();
