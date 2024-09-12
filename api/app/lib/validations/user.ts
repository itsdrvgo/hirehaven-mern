import Joi from "joi";
import { ROLES } from "../../config/const.js";
import type {
    UpdateUserData,
    UpdateUserEmailData,
    UpdateUserPasswordData,
    UpdateUserRoleData,
    UserData,
} from "../../interfaces/index.js";

export const userSchema = Joi.object<UserData>({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).*$/,
            "Password"
        )
        .min(8)
        .required(),
    avatarUrl: Joi.string().uri().required(),
    address: Joi.object({
        street: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        zip: Joi.string()
            .pattern(new RegExp(/^[0-9]+$/))
            .optional(),
    }),
    phone: Joi.string()
        .pattern(new RegExp(/^[0-9+]+$/))
        .optional(),
    resumeUrl: Joi.string().uri().optional(),
    coverLetter: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLES)),
    isVerified: Joi.boolean().required(),
    status: Joi.boolean().required(),
    isRestricted: Joi.boolean().required(),
    isProfileCompleted: Joi.boolean().required(),
});

export const updateUserSchema = Joi.object<UpdateUserData>({
    firstName: userSchema.extract("firstName").optional(),
    lastName: userSchema.extract("lastName").optional(),
    avatarUrl: userSchema.extract("avatarUrl").optional(),
    address: userSchema.extract("address").optional(),
    phone: userSchema.extract("phone").optional(),
    resumeUrl: userSchema.extract("resumeUrl").optional(),
    coverLetter: userSchema.extract("coverLetter").optional(),
    isVerified: userSchema.extract("isVerified").optional(),
    status: userSchema.extract("status").optional(),
    isRestricted: userSchema.extract("isRestricted").optional(),
});

export const updateUserEmailSchema = Joi.object<UpdateUserEmailData>({
    email: userSchema.extract("email"),
    password: userSchema.extract("password"),
});

export const updateUserRoleSchema = Joi.object<UpdateUserRoleData>({
    role: userSchema.extract("role"),
});

export const safeUserSchema = userSchema.keys({
    password: Joi.string().forbidden(),
});

export const safeUserArraySchema = Joi.array().items(safeUserSchema);

export const updateUserPasswordSchema = Joi.object<UpdateUserPasswordData>({
    oldPassword: userSchema.extract("password"),
    newPassword: userSchema.extract("password"),
    confirmPassword: userSchema.extract("password"),
})
    .with("newPassword", "confirmPassword")
    .xor("oldPassword", "newPassword");
