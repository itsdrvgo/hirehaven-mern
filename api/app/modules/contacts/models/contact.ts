import { model, Schema, type AggregatePaginateModel } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { contactQueries } from "../../../config/const.js";
import type { ContactDocument } from "../../../interfaces/index.js";

const contactSchema = new Schema<ContactDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        query: {
            type: Schema.Types.String,
            enum: contactQueries.map((query) => query.value),
            required: true,
        },
        message: {
            type: Schema.Types.String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

contactSchema.plugin(aggregatePaginate);

export const Contact = model<
    ContactDocument,
    AggregatePaginateModel<ContactDocument>
>("contact", contactSchema);
