import { model, Schema, type AggregatePaginateModel } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ROLES } from "../../../config/const.js";
import type { UserDocument } from "../../../interfaces/index.js";

const userSchema = new Schema<UserDocument>(
    {
        firstName: {
            type: Schema.Types.String,
            required: true,
        },
        lastName: {
            type: Schema.Types.String,
            required: true,
        },
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
        },
        avatarUrl: {
            type: Schema.Types.String,
            default: "",
        },
        phone: {
            type: Schema.Types.String,
        },
        address: {
            street: {
                type: Schema.Types.String,
            },
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
            zip: {
                type: Schema.Types.String,
            },
        },
        resumeUrl: {
            type: Schema.Types.String,
            default: "",
        },
        coverLetter: {
            type: Schema.Types.String,
            default: "",
        },
        role: {
            type: Schema.Types.Mixed,
            enum: Object.values(ROLES),
            default: ROLES.SEEKER,
            lowercase: true,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
        },
        isVerified: {
            type: Schema.Types.Boolean,
            default: false,
        },
        isRestricted: {
            type: Schema.Types.Boolean,
            default: false,
        },
        isProfileCompleted: {
            type: Schema.Types.Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.plugin(aggregatePaginate);

export const User = model<UserDocument, AggregatePaginateModel<UserDocument>>(
    "user",
    userSchema
);
