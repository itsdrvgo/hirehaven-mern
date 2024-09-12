import type { Document, ObjectId } from "mongoose";
import type { JobTypes, LocationTypes, PaymentModes } from "../config/const.js";

export interface JobData {
    companyName: string;
    companyEmail: string;
    logoUrl: string;
    position: string;
    type: JobTypes;
    description: string;
    locationType: LocationTypes;
    location: {
        city?: string;
        state?: string;
        country: string;
    };
    salary: {
        mode: PaymentModes;
        amount: string;
    };
    categoryId: string | ObjectId;
    status: boolean;
    isFeatured: boolean;
    isPublished: boolean;
    postedBy: string | ObjectId;
}

export type CreateJobData = Omit<JobData, "status" | "logoUrl" | "postedBy">;
export type UpdateJobData = Partial<
    Omit<
        JobData,
        "companyName" | "companyEmail" | "logoUrl" | "postedBy" | "categoryId"
    >
>;

export type JobDocument = JobData & Document;
