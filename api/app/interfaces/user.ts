import type { Document } from "mongoose";
import type { UserRoles } from "../config/const.js";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatarUrl: string;
    phone: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip?: string;
    };
    resumeUrl?: string;
    coverLetter: string;
    role: UserRoles;
    status: boolean;
    isVerified: boolean;
    isRestricted: boolean;
    isProfileCompleted: boolean;
}

export interface UpdateUserEmailData {
    email: string;
    password: string;
}

export interface UpdateUserRoleData {
    role: UserRoles;
}

export type UpdateUserData = Partial<
    Omit<UserData, "email" | "password" | "role" | "isProfileCompleted">
>;
export type SafeUserData = Omit<UserData, "password">;
export type SafeUserArray = SafeUserData[];

export interface UpdateUserPasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type UserDocument = UserData & Document;
