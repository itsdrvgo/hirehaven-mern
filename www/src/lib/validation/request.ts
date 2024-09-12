import { JOB_TYPES, LOCATION_TYPES } from "@/config/const";
import { z } from "zod";
import { generateZodEnumFromObject } from "../utils";

const jobTypes = Object.entries(JOB_TYPES).map(([label, value]) => ({
    label,
    value,
}));

const locationTypes = Object.entries(LOCATION_TYPES).map(([label, value]) => ({
    label,
    value,
}));

export const queryJobSchema = z.object({
    category: z.string().optional(),
    name: z.string().optional(),
    type: z
        .array(z.enum(generateZodEnumFromObject(jobTypes)))
        .default([])
        .optional(),
    location: z
        .array(z.enum(generateZodEnumFromObject(locationTypes)))
        .default([])
        .optional(),
    country: z.string().optional(),
    minSalary: z.string().optional(),
    maxSalary: z.string().optional(),
});

export const filterJobSchema = z.object({
    category: queryJobSchema.shape.category,
    type: queryJobSchema.shape.type,
    location: queryJobSchema.shape.location,
    country: queryJobSchema.shape.country,
    salaryRange: z.array(z.number()).length(2).optional(),
    name: queryJobSchema.shape.name,
});

export type QueryJobData = z.infer<typeof queryJobSchema>;
export type FilterJobData = z.infer<typeof filterJobSchema>;
