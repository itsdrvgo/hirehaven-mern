import type {
    JobStatuses,
    JobTypes,
    LocationTypes,
    UserRoles,
} from "../config/const.js";

export interface QueryTokenData {
    token: string;
}

export interface ParamUserData {
    id: string;
}

export interface QueryInfiniteData {
    page: number;
    limit: number;
    paginated?: true;
}

export interface QueryUserTypeData {
    type?: "admin" | "poster";
}

export interface QueryInfiniteUserData {
    page: number;
    limit: number;
    paginated?: true;
    type?: UserRoles;
}

export interface QueryInfiniteApplicationData {
    page: number;
    limit: number;
    paginated?: true;
    jId?: string;
    aId?: string;
}

export interface QueryInfiniteJobData {
    page: number;
    limit: number;
    paginated?: true;
    category?: string;
    poster?: string;
    name?: string;
    type?: JobTypes[];
    location?: LocationTypes[];
    country?: string;
    minSalary?: number;
    maxSalary?: number;
    isFeatured?: boolean;
    status?: JobStatuses;
}
