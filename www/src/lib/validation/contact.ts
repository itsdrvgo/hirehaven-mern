import { z } from "zod";
import { safeUserSchema, userSchema } from "./user";

export const contactSchema = z.object({
    id: userSchema.shape.id,
    firstName: userSchema.shape.firstName,
    lastName: userSchema.shape.lastName,
    email: userSchema.shape.email,
    query: z
        .string({ required_error: "Please select a query type" })
        .min(1, "Please select a query type"),
    message: z.string().min(10, "Message must be at least 10 character long"),
});

export const createContactSchema = z.object({
    userId: userSchema.shape.id,
    query: contactSchema.shape.query,
    message: contactSchema.shape.message,
});

export const responseContactSchema = z.object({
    id: contactSchema.shape.id,
    userId: userSchema.shape.id,
    query: contactSchema.shape.query,
    message: contactSchema.shape.message,
    user: safeUserSchema,
    createdAt: z.date(),
});

export const aggregatedContactSchema = z.object({
    docs: z.array(responseContactSchema),
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

export type ContactData = z.infer<typeof contactSchema>;
export type CreateContactData = z.infer<typeof createContactSchema>;
export type ResponseContactData = z.infer<typeof responseContactSchema>;
export type AggregatedContactData = z.infer<typeof aggregatedContactSchema>;
