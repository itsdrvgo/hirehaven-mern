import Joi from "joi";
import { APPLICATION_STATUSES } from "../../config/const.js";
import type {
    ApplicationData,
    CreateApplicationData,
    UpdateApplicationData,
} from "../../interfaces/index.js";

export const applicationSchema = Joi.object<ApplicationData>({
    applicantId: Joi.string().required(),
    jobId: Joi.string().required(),
    status: Joi.string().required(),
    coverLetter: Joi.string().required(),
});

export const createApplicationSchema = Joi.object<CreateApplicationData>({
    coverLetter: applicationSchema.extract("coverLetter"),
});

export const updateApplicationSchema = Joi.object<UpdateApplicationData>({
    status: Joi.string()
        .valid(...Object.values(APPLICATION_STATUSES))
        .required(),
});
