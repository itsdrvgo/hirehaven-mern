import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});
