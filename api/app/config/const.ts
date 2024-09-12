import type { CookieOptions } from "express";
import { slugify } from "../lib/utils.js";

export const DEFAULT_AVATAR_PATH = "uploads/images/avatars/default_avatar.png";
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const TOKENS = {
    SEEKER_TOKEN: "hirehaven__seeker_KkasdmnJ2jifa_654128",
    POSTER_TOKEN: "hirehaven__poster_KkasdmnJ2jifa_654128",
    ADMIN_TOKEN: "hirehaven__admin_KkasdmnJ2jifa_654128",
} as const;

export const JWT_EXPIRES_IN = "90d";
export const cookieOptions: CookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
};

export const contactQueries = [
    "Help & Support",
    "Become a Poster",
    "Hacked Account",
    "Bug Reporting",
    "Feature Request",
    "Others",
].map((query) => ({ label: query, value: slugify(query) }));

export const ROLES = {
    ADMIN: "admin",
    POSTER: "poster",
    SEEKER: "seeker",
} as const;

export const JOB_TYPES = {
    FULL_TIME: "full_time",
    FREELANCE: "freelance",
    PART_TIME: "part_time",
    CONTRACT: "contract",
    INTERNSHIP: "internship",
} as const;

export const JOB_STATUSES = {
    PENDING: "draft",
    PUBLISHED: "published",
} as const;

export const LOCATION_TYPES = {
    ONSITE: "onsite",
    HYBRID: "hybrid",
    REMOTE: "remote",
} as const;

export const PAYMENT_MODES = {
    HOURLY: "hourly",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
} as const;

export const APPLICATION_STATUSES = {
    PENDING: "pending",
    REVIEWED: "reviewed",
    REJECTED: "rejected",
    HIRED: "hired",
} as const;

export type UserRoles = ValueOf<typeof ROLES>;
export type JobTypes = ValueOf<typeof JOB_TYPES>;
export type JobStatuses = ValueOf<typeof JOB_STATUSES>;
export type LocationTypes = ValueOf<typeof LOCATION_TYPES>;
export type PaymentModes = ValueOf<typeof PAYMENT_MODES>;
export type ApplicationStatuses = ValueOf<typeof APPLICATION_STATUSES>;
