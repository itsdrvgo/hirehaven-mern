import {
    APPLICATION_STATUSES,
    JOB_TYPES,
    LOCATION_TYPES,
    PAYMENT_MODES,
} from "@/config/const";
import { z } from "zod";
import { safeUserSchema, userSchema } from "./user";

export const jobSchema = z.object({
    id: z.string(),
    companyName: z
        .string()
        .min(3, "Company name must be at least 3 characters long"),
    companyEmail: z.string().email("Invalid email address"),
    logoUrl: z.string().url().optional(),
    position: z.string().min(3, "Position must be at least 3 characters long"),
    type: z.nativeEnum(JOB_TYPES).default(JOB_TYPES.FULL_TIME),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters long"),
    categoryId: z.string().min(1, "Category must be at least 1 character long"),
    locationType: z.nativeEnum(LOCATION_TYPES).default(LOCATION_TYPES.REMOTE),
    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().min(1, "Country must be at least 1 character long"),
    }),
    salary: z.object({
        mode: z.nativeEnum(PAYMENT_MODES).default(PAYMENT_MODES.YEARLY),
        amount: z.string().min(1, "Amount must be at least 1 character long"),
    }),
    status: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(false),
    postedBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const createJobSchema = jobSchema.omit({
    id: true,
    postedBy: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    logoUrl: true,
});

export const updateJobSchema = createJobSchema
    .omit({
        companyName: true,
        companyEmail: true,
        categoryId: true,
    })
    .partial();

export const responseJobSchema = jobSchema.extend({
    postedBy: safeUserSchema,
    applicants: z.array(
        z.object({
            id: z.string(),
            applicantId: z.string(),
            jobId: z.string(),
            status: z
                .nativeEnum(APPLICATION_STATUSES)
                .default(APPLICATION_STATUSES.PENDING),
            coverLetter: userSchema.shape.coverLetter,
            applicant: safeUserSchema,
            createdAt: z.date(),
            updatedAt: z.date(),
        })
    ),
    applications: z.number(),
});

export const aggregatedJobSchema = z.object({
    docs: z.array(responseJobSchema),
    totalDocs: z.number(),
    limit: z.number(),
    page: z.number(),
    totalPages: z.number(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullable(),
    nextPage: z.number().nullable(),
});

export const applyJobSchema = z.object({
    coverLetter: userSchema.shape.coverLetter,
});

export type JobData = z.infer<typeof jobSchema>;
export type CreateJobData = z.infer<typeof createJobSchema>;
export type UpdateJobData = z.infer<typeof updateJobSchema>;
export type ResponseJobData = z.infer<typeof responseJobSchema>;
export type AggregatedJobData = z.infer<typeof aggregatedJobSchema>;
export type ApplyJobData = z.infer<typeof applyJobSchema>;
