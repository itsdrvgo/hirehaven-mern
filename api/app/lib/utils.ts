import type { Response } from "express";
import { existsSync, unlinkSync } from "fs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";
import { MulterError } from "multer";
import path from "path";
import { ZodError } from "zod";
import { DEFAULT_AVATAR_PATH } from "../config/const.js";
import { AppError, logger } from "./helpers/index.js";
import type { ResponseMessages } from "./validations/index.js";

export function sanitizeError(err: unknown) {
    if (err instanceof AppError) return err.message;
    else if (err instanceof Joi.ValidationError) return err.message;
    else if (err instanceof ZodError)
        return err.errors
            .map((e) =>
                e.code === "invalid_type"
                    ? `Expected ${e.expected} but received ${
                          e.received
                      } at ${e.path.join(".")}`
                    : e.message
            )
            .join(", ");
    else if (err instanceof MulterError) return err.message;
    else if (err instanceof MongooseError) return err.message;
    else if (err instanceof jwt.NotBeforeError)
        return err.message + ", the token is not yet valid";
    else if (err instanceof jwt.TokenExpiredError)
        return err.message + ", the token has expired";
    else if (err instanceof jwt.JsonWebTokenError)
        return err.message + ", the token is invalid";
    else if (err instanceof Error) return err.message;
    else return "Unknown error";
}

export function handleJWTError(err: unknown, res: Response) {
    if (err instanceof jwt.NotBeforeError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof jwt.TokenExpiredError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof jwt.JsonWebTokenError)
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
    else
        return CResponse({
            res,
            message: "UNAUTHORIZED",
            longMessage: sanitizeError(err),
        });
}

export function handleError(err: unknown, res: Response) {
    logger.error(err);

    if (err instanceof AppError)
        return CResponse({
            res,
            message: err.status,
            longMessage: sanitizeError(err),
        });
    else if (err instanceof Joi.ValidationError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof ZodError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof MulterError)
        return CResponse({
            res,
            message: "BAD_REQUEST",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof MongooseError)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof Error)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else
        return CResponse({
            res,
            message: "INTERNAL_SERVER_ERROR",
            longMessage: sanitizeError(err),
        });
}

export function CResponse<T = unknown>({
    res,
    message,
    longMessage,
    data,
}: {
    res: Response;
    message: ResponseMessages;
    longMessage?: string;
    data?: T;
}) {
    let code;
    let status = false;

    switch (message) {
        case "OK":
            code = 200;
            status = true;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "CREATED":
            code = 201;
            status = true;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        default:
            code = 500;
            break;
    }

    return res.status(code).json({
        status,
        message,
        longMessage,
        data,
    });
}

export function generateDbUrl() {
    const { DB_PROTOCOL, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } =
        process.env;
    return `${DB_PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
}

export function unlinkFile(filePath?: string) {
    if (!filePath) return;
    if (existsSync(filePath)) unlinkSync(filePath);
}

export function generateFileURL(file: Express.Multer.File) {
    return `${process.env.BACKEND_URL}/${file.path.replace(/\\/g, "/")}`;
}

export function getFilePathFromURL(url: string) {
    return "uploads/" + url.split("/uploads/")[1];
}

export function generateFilename(file: Express.Multer.File, prefix = "item") {
    const ext = path.extname(file.originalname);
    return `${prefix}_${Date.now()}${ext}`;
}

export function getDefaultImageUrl() {
    return `${process.env.BACKEND_URL}/${DEFAULT_AVATAR_PATH}`;
}

export function slugify(text: string, separator: string = "-") {
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, separator);
}
