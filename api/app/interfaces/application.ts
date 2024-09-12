import { Document, type ObjectId } from "mongoose";
import type { ApplicationStatuses } from "../config/const.js";

export interface ApplicationData {
    applicantId: string | ObjectId;
    jobId: string | ObjectId;
    status: ApplicationStatuses;
    coverLetter: string;
}

export type CreateApplicationData = Pick<ApplicationData, "coverLetter">;
export type UpdateApplicationData = Pick<ApplicationData, "status">;

export type ApplicationDocument = ApplicationData & Document;
