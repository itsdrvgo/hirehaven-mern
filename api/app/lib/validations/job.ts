import Joi from "joi";
import { isValidObjectId } from "mongoose";
import {
    JOB_TYPES,
    LOCATION_TYPES,
    PAYMENT_MODES,
} from "../../config/const.js";
import type {
    CreateJobData,
    JobData,
    UpdateJobData,
} from "../../interfaces/index.js";

export const jobSchema = Joi.object<JobData>({
    companyName: Joi.string().min(3).required(),
    companyEmail: Joi.string().email().required(),
    logoUrl: Joi.string().uri().optional(),
    position: Joi.string().min(3).required(),
    type: Joi.string()
        .valid(...Object.values(JOB_TYPES))
        .required(),
    description: Joi.string().min(10).required(),
    locationType: Joi.string()
        .valid(...Object.values(LOCATION_TYPES))
        .required(),
    location: Joi.object({
        city: Joi.string().optional().lowercase().empty(""),
        state: Joi.string().optional().empty(""),
        country: Joi.string().required(),
    }),
    salary: Joi.object({
        mode: Joi.string()
            .valid(...Object.values(PAYMENT_MODES))
            .required(),
        amount: Joi.string().min(1).required(),
    }),
    status: Joi.boolean().required(),
    isFeatured: Joi.boolean().required(),
    isPublished: Joi.boolean().required(),
    postedBy: Joi.string().required(),
    categoryId: Joi.string().required(),
}).custom((value, helpers) => {
    if (!isValidObjectId(value.postedBy))
        return helpers.error("Posted by must be a valid ObjectId");

    if (!isValidObjectId(value.categoryId))
        return helpers.error("Category must be a valid ObjectId");

    return value;
});

export const createJobSchema = Joi.object<CreateJobData>({
    companyName: jobSchema.extract("companyName"),
    companyEmail: jobSchema.extract("companyEmail"),
    position: jobSchema.extract("position"),
    type: jobSchema.extract("type"),
    description: jobSchema.extract("description"),
    locationType: jobSchema.extract("locationType"),
    location: jobSchema.extract("location"),
    salary: jobSchema.extract("salary"),
    categoryId: jobSchema.extract("categoryId"),
    isFeatured: jobSchema.extract("isFeatured"),
    isPublished: jobSchema.extract("isPublished"),
}).custom((value, helpers) => {
    if (!isValidObjectId(value.categoryId))
        return helpers.error("Category must be a valid ObjectId");
    return value;
});

export const updateJobSchema = Joi.object<UpdateJobData>({
    position: jobSchema.extract("position").optional(),
    type: jobSchema.extract("type").optional(),
    description: jobSchema.extract("description").optional(),
    locationType: jobSchema.extract("locationType").optional(),
    location: jobSchema.extract("location").optional(),
    salary: jobSchema.extract("salary").optional(),
    status: jobSchema.extract("status").optional(),
    isFeatured: jobSchema.extract("isFeatured").optional(),
    isPublished: jobSchema.extract("isPublished").optional(),
});
