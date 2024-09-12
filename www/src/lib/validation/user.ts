import { ROLES } from "@/config/const";
import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    firstName: z
        .string()
        .min(1, "First name must be at least 1 character long"),
    lastName: z.string().min(1, "Last name must be at least 1 character long"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/,
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number"
        ),
    avatarUrl: z
        .string()
        .url("Invalid URL")
        .min(1, "Avatar URL must be at least 1 character long"),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zip: z
            .string()
            .regex(/^[0-9]*$/, "Zip code must be a number")
            .optional(),
    }),
    phone: z
        .string()
        .regex(
            // can only have numbers and +
            /^[0-9+]*$/,
            "Phone number must contain only numbers and +"
        )
        .optional(),
    resumeUrl: z.string().url("Invalid URL").optional(),
    coverLetter: z.string(),
    role: z.nativeEnum(ROLES),
    status: z.boolean(),
    isVerified: z.boolean(),
    isRestricted: z.boolean(),
    isProfileCompleted: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const updateUserSchema = userSchema
    .omit({
        email: true,
        password: true,
        role: true,
        isProfileCompleted: true,
    })
    .partial();

export const updateUserGeneralSchema = userSchema
    .pick({
        firstName: true,
        lastName: true,
        coverLetter: true,
    })
    .partial();

export const updateUserContactSchema = userSchema
    .pick({
        address: true,
        phone: true,
    })
    .partial();

export const updateUserEmailSchema = z.object({
    email: userSchema.shape.email,
    password: userSchema.shape.password,
});

export const updateUserRoleSchema = z.object({
    role: userSchema.shape.role,
});

export const safeUserSchema = userSchema.omit({
    password: true,
    updatedAt: true,
});

export const safeUserArraySchema = z.array(safeUserSchema);

export const updateUserPasswordSchema = z
    .object({
        oldPassword: userSchema.shape.password,
        newPassword: userSchema.shape.password,
        confirmPassword: userSchema.shape.password,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password must be different from old password",
        path: ["newPassword"],
    });

export const aggregatedUserSchema = z.object({
    docs: z.array(userSchema),
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

export type UserData = z.infer<typeof userSchema>;
export type UpdateUserGeneralData = z.infer<typeof updateUserGeneralSchema>;
export type UpdateUserContactData = z.infer<typeof updateUserContactSchema>;
export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserPasswordData = z.infer<typeof updateUserPasswordSchema>;
export type SafeUserData = z.infer<typeof safeUserSchema>;
export type SafeUserArrayData = z.infer<typeof safeUserArraySchema>;
export type AggregatedUserData = z.infer<typeof aggregatedUserSchema>;
