import Joi from "joi";
import type {
    ForgotPasswordData,
    OtpData,
    ResetPasswordData,
    SignInData,
    SignUpData,
} from "../../interfaces/index.js";
import { userSchema } from "./user.js";

export const signUpSchema = Joi.object<SignUpData>({
    firstName: userSchema.extract("firstName"),
    lastName: userSchema.extract("lastName"),
    email: userSchema.extract("email"),
    password: userSchema.extract("password"),
    confirmPassword: userSchema.extract("password"),
}).with("password", "confirmPassword");

export const signInSchema = Joi.object<SignInData>({
    email: userSchema.extract("email"),
    password: userSchema.extract("password"),
});

export const otpSchema = Joi.object<OtpData>({
    otp: Joi.string().length(6).required(),
});

export const forgotPasswordSchema = Joi.object<ForgotPasswordData>({
    email: userSchema.extract("email"),
});

export const resetPasswordSchema = Joi.object<ResetPasswordData>({
    password: userSchema.extract("password"),
    confirmPassword: userSchema.extract("password"),
}).with("password", "confirmPassword");
