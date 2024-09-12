import Joi from "joi";
import {
    JOB_STATUSES,
    JOB_TYPES,
    LOCATION_TYPES,
    ROLES,
    type JobTypes,
    type LocationTypes,
} from "../../config/const.js";
import type {
    ParamUserData,
    QueryInfiniteApplicationData,
    QueryInfiniteData,
    QueryInfiniteJobData,
    QueryInfiniteUserData,
    QueryTokenData,
    QueryUserTypeData,
} from "../../interfaces/index.js";
import { isValidObjectId } from "mongoose";

export const queryTokenSchema = Joi.object<QueryTokenData>({
    token: Joi.string().required(),
});

export const paramUserSchema = Joi.object<ParamUserData>({
    id: Joi.string().required(),
});

export const queryInfiniteSchema = Joi.object<QueryInfiniteData>({
    page: Joi.string().optional().default("1"),
    limit: Joi.string().optional().default("10"),
    paginated: Joi.string().valid("true").optional(),
}).custom((value, helpers) => {
    if (value.page && isNaN(parseInt(value.page)))
        return helpers.error("Page must be a number");

    if (value.limit && isNaN(parseInt(value.limit)))
        return helpers.error("Limit must be a number");

    if (value.paginated && value.paginated !== "true")
        return helpers.error("Paginated must be 'true'");

    return {
        ...value,
        page: parseInt(value.page),
        limit: parseInt(value.limit),
        paginated: value.paginated === "true",
    };
});

export const queryUserTypeSchema = Joi.object<QueryUserTypeData>({
    type: Joi.string().valid(ROLES.ADMIN, ROLES.POSTER).optional(),
});

export const queryInfiniteUserSchema = Joi.object<QueryInfiniteUserData>({
    page: queryInfiniteSchema.extract("page"),
    limit: queryInfiniteSchema.extract("limit"),
    paginated: queryInfiniteSchema.extract("paginated"),
    type: Joi.string()
        .valid(...Object.values(ROLES))
        .optional(),
}).custom((value, helpers) => {
    if (value.page && isNaN(parseInt(value.page)))
        return helpers.error("Page must be a number");

    if (value.limit && isNaN(parseInt(value.limit)))
        return helpers.error("Limit must be a number");

    if (value.paginated && value.paginated !== "true")
        return helpers.error("Paginated must be 'true'");

    return {
        ...value,
        page: parseInt(value.page),
        limit: parseInt(value.limit),
        paginated: value.paginated === "true",
    };
});

export const queryInfiniteApplicationSchema =
    Joi.object<QueryInfiniteApplicationData>({
        page: queryInfiniteSchema.extract("page"),
        limit: queryInfiniteSchema.extract("limit"),
        paginated: queryInfiniteSchema.extract("paginated"),
        jId: Joi.string().optional(),
        aId: Joi.string().optional(),
    }).custom((value, helpers) => {
        if (value.page && isNaN(parseInt(value.page)))
            return helpers.error("Page must be a number");

        if (value.limit && isNaN(parseInt(value.limit)))
            return helpers.error("Limit must be a number");

        if (value.paginated && value.paginated !== "true")
            return helpers.error("Paginated must be 'true'");

        if (value.jId && !isValidObjectId(value.jId))
            return helpers.error("Invalid job ID");

        if (value.aId && !isValidObjectId(value.aId))
            return helpers.error("Invalid applicant ID");

        return {
            ...value,
            page: parseInt(value.page),
            limit: parseInt(value.limit),
            paginated: value.paginated === "true",
        };
    });

export const queryInfiniteJobSchema = Joi.object<QueryInfiniteJobData>({
    page: queryInfiniteSchema.extract("page"),
    limit: queryInfiniteSchema.extract("limit"),
    paginated: queryInfiniteSchema.extract("paginated"),
    category: Joi.string().optional(),
    poster: Joi.string().optional(),
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    location: Joi.string().optional(),
    country: Joi.string().optional(),
    minSalary: Joi.string().optional(),
    maxSalary: Joi.string().optional(),
    isFeatured: Joi.string().valid("true").optional(),
    status: Joi.string()
        .valid(...Object.values(JOB_STATUSES))
        .optional(),
}).custom((value, helpers) => {
    if (value.page && isNaN(parseInt(value.page)))
        return helpers.error("Page must be a number");

    if (value.limit && isNaN(parseInt(value.limit)))
        return helpers.error("Limit must be a number");

    if (value.paginated && value.paginated !== "true")
        return helpers.error("Paginated must be 'true'");

    if (value.category && !isValidObjectId(value.category))
        return helpers.error("Invalid category ID");

    if (value.poster && !isValidObjectId(value.poster))
        return helpers.error("Invalid poster ID");

    if (value.type) {
        const types = decodeURIComponent(value.type).split(" ") as JobTypes[];
        const invalidTypes = types.filter(
            (type) => !Object.values(JOB_TYPES).includes(type)
        );

        if (invalidTypes.length)
            return helpers.error(
                `Invalid job types: ${invalidTypes.join(", ")}`
            );
    }

    if (value.location) {
        const locations = decodeURIComponent(value.location).split(
            " "
        ) as LocationTypes[];
        const invalidLocations = locations.filter(
            (location) => !Object.values(LOCATION_TYPES).includes(location)
        );

        if (invalidLocations.length)
            return helpers.error(
                `Invalid location types: ${invalidLocations.join(", ")}`
            );
    }

    if (value.minSalary && isNaN(parseInt(value.minSalary)))
        return helpers.error("minSalary must be a number");

    if (value.maxSalary && isNaN(parseInt(value.maxSalary)))
        return helpers.error("maxSalary must be a number");

    if (value.minSalary && value.maxSalary)
        if (parseInt(value.minSalary) > parseInt(value.maxSalary))
            return helpers.error("minSalary must be less than maxSalary");

    if (value.isFeatured && value.isFeatured !== "true")
        return helpers.error("isFeatured must be 'true'");

    return {
        ...value,
        page: parseInt(value.page),
        limit: parseInt(value.limit),
        paginated: value.paginated === "true",
        name: value.name ? decodeURIComponent(value.name) : undefined,
        type: value.type
            ? decodeURIComponent(value.type).split(" ")
            : undefined,
        location: value.location
            ? decodeURIComponent(value.location).split(" ")
            : undefined,
        country: value.country ? value.country.toUpperCase() : undefined,
        minSalary: value.minSalary ? parseInt(value.minSalary, 10) : undefined,
        maxSalary: value.maxSalary ? parseInt(value.maxSalary, 10) : undefined,
        isFeatured: value.isFeatured === "true",
    };
});
