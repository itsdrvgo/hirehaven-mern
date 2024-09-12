import { z } from "zod";
import { userSchema } from "./user";

export const signUpSchema = userSchema
    .pick({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
    })
    .merge(
        z.object({
            confirmPassword: userSchema.shape.password,
        })
    )
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const signInSchema = z.object({
    email: userSchema.shape.email,
    password: userSchema.shape.password,
});

export const tokenSchema = z.object({
    token: z.string().min(1, "No token provided"),
});

export const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const forgotPasswordSchema = z.object({
    email: userSchema.shape.email,
});

export const resetPasswordSchema = z
    .object({
        password: userSchema.shape.password,
        confirmPassword: userSchema.shape.password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
export type OtpData = z.infer<typeof otpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
