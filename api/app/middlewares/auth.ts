import type { Request, Response, NextFunction } from "express";
import { getTokenFromHeader, verifyJwt } from "../lib/jwt/index.js";
import { CResponse, handleError, handleJWTError } from "../lib/utils.js";
import { paramUserSchema, queryTokenSchema } from "../lib/validations/index.js";
import { AppError } from "../lib/helpers/index.js";
import { userRepo } from "../modules/users/repositories/user.repo.js";

export function isAuth(req: Request, res: Response, next: NextFunction) {
    const token = getTokenFromHeader(req);
    if (!token)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: "You need to be logged in to access this route",
        });

    try {
        const payload = verifyJwt(token, process.env.JWT_SECRET);
        req.ctx = { ...req.ctx, user: payload };
        next();
    } catch (err) {
        return handleJWTError(err, res);
    }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const user = await userRepo.getById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND");

        if (user.role !== "admin")
            throw new AppError(
                "You need to be an admin to access this route",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

export async function isPoster(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const user = await userRepo.getById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND");

        if (user.role !== "poster")
            throw new AppError(
                "You need to be a job poster to access this route",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

export async function isSeeker(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const user = await userRepo.getById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND");

        if (user.role !== "seeker")
            throw new AppError(
                "You need to be a job seeker to access this route",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

export async function isSameUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const { error, value } = paramUserSchema.validate(req.params);
        if (error) throw error;

        const { id } = value;

        if (userId !== id)
            throw new AppError(
                "You can only access your own data",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

export async function isSameUserOrAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.ctx?.user.id;
        if (!userId)
            throw new AppError(
                "You need to be logged in to access this route",
                "UNAUTHORIZED"
            );

        const { error, value } = paramUserSchema.validate(req.params);
        if (error) throw error;

        const { id } = value;

        const user = await userRepo.getById(userId);
        if (!user) throw new AppError("User not found", "NOT_FOUND");

        if (user.role !== "admin" && userId !== id)
            throw new AppError(
                "You can only access your own data",
                "FORBIDDEN"
            );

        next();
    } catch (err) {
        return handleError(err, res);
    }
}

export function isTokenValid(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = queryTokenSchema.validate(req.query);
        if (error) throw error;

        try {
            const payload = verifyJwt(value.token, process.env.EMAIL_SECRET);
            req.ctx = { ...req.ctx, user: payload };
            next();
        } catch (err) {
            return handleJWTError(err, res);
        }
    } catch (err) {
        return handleError(err, res);
    }
}
