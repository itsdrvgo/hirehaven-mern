import { APPLICATION_STATUSES } from "@/config/const";
import { z } from "zod";
import { jobSchema } from "./job";
import { safeUserSchema, userSchema } from "./user";

export const applicationSchema = z.object({
    id: z.string(),
    applicantId: z.string(),
    jobId: z.string(),
    status: z
        .nativeEnum(APPLICATION_STATUSES)
        .default(APPLICATION_STATUSES.PENDING),
    coverLetter: userSchema.shape.coverLetter,
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const updateApplicationSchema = z.object({
    status: z.nativeEnum(APPLICATION_STATUSES),
});

export const responseApplicationSchema = applicationSchema.extend({
    applicant: safeUserSchema,
    job: jobSchema.extend({
        postedBy: safeUserSchema,
    }),
});

export const aggregatedApplicationSchema = z.object({
    docs: z.array(responseApplicationSchema),
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

export type ApplicationData = z.infer<typeof applicationSchema>;
export type UpdateApplicationData = z.infer<typeof updateApplicationSchema>;
export type ResponseApplicationData = z.infer<typeof responseApplicationSchema>;
export type AggregatedApplicationData = z.infer<
    typeof aggregatedApplicationSchema
>;
