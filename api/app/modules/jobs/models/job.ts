import { model, Schema, type AggregatePaginateModel } from "mongoose";
import type { JobDocument } from "../../../interfaces/index.js";
import {
    JOB_TYPES,
    LOCATION_TYPES,
    PAYMENT_MODES,
} from "../../../config/const.js";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const jobSchema = new Schema<JobDocument>(
    {
        companyName: {
            type: Schema.Types.String,
            required: true,
        },
        companyEmail: {
            type: Schema.Types.String,
            required: true,
        },
        logoUrl: {
            type: Schema.Types.String,
            default: "",
        },
        position: {
            type: Schema.Types.String,
            required: true,
        },
        type: {
            type: Schema.Types.Mixed,
            enum: Object.values(JOB_TYPES),
            default: JOB_TYPES.FULL_TIME,
            lowercase: true,
        },
        description: {
            type: Schema.Types.String,
            required: true,
        },
        locationType: {
            type: Schema.Types.Mixed,
            enum: Object.values(LOCATION_TYPES),
            default: LOCATION_TYPES.REMOTE,
            lowercase: true,
        },
        location: {
            city: {
                type: Schema.Types.String,
                lowercase: true,
            },
            state: {
                type: Schema.Types.String,
            },
            country: {
                type: Schema.Types.String,
            },
        },
        salary: {
            mode: {
                type: Schema.Types.String,
                enum: Object.values(PAYMENT_MODES),
                default: PAYMENT_MODES.YEARLY,
                lowercase: true,
            },
            amount: {
                type: Schema.Types.String,
                required: true,
            },
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
        isFeatured: {
            type: Schema.Types.Boolean,
            default: false,
        },
        isPublished: {
            type: Schema.Types.Boolean,
            default: true,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

jobSchema.plugin(aggregatePaginate);

export const Job = model<JobDocument, AggregatePaginateModel<JobDocument>>(
    "job",
    jobSchema
);
