import { model, Schema, type AggregatePaginateModel } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { APPLICATION_STATUSES } from "../../../config/const.js";
import type { ApplicationDocument } from "../../../interfaces/index.js";

const applicationSchema = new Schema<ApplicationDocument>(
    {
        applicantId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        jobId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "job",
        },
        status: {
            type: Schema.Types.Mixed,
            enum: Object.values(APPLICATION_STATUSES),
            default: APPLICATION_STATUSES.PENDING,
            lowercase: true,
        },
        coverLetter: {
            type: Schema.Types.String,
            default: "",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

applicationSchema.plugin(aggregatePaginate);

export const Application = model<
    ApplicationDocument,
    AggregatePaginateModel<ApplicationDocument>
>("application", applicationSchema);
