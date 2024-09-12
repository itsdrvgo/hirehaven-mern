import type { FilterQuery, PaginateOptions } from "mongoose";
import type {
    ContactData,
    ContactDocument,
    UserDocument,
} from "../../../interfaces/index.js";
import { db } from "../../../lib/db/index.js";

type AggregatedContact = Omit<ContactDocument, "updatedAt"> & {
    id: string;
    user: Omit<UserDocument, "password" | "updatedAt"> & {
        id: string;
    };
};

class ContactRepo {
    get = async (filter?: FilterQuery<ContactData>) => {
        return await db.contacts.aggregate<AggregatedContact>([
            filter
                ? {
                      $match: filter,
                  }
                : {
                      $match: {},
                  },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                password: 0,
                                updatedAt: 0,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                },
            },
        ]);
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }: {
        filter?: FilterQuery<ContactData>;
        options: PaginateOptions;
    }) => {
        const contacts = db.contacts.aggregate<AggregatedContact>([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                password: 0,
                                updatedAt: 0,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                },
            },
        ]);

        return await db.contacts.aggregatePaginate(contacts, options);
    };

    getById = async (id: string) => {
        const contact = await db.contacts.aggregate<
            AggregatedContact & {
                updatedAt: Date;
            }
        >([
            {
                $match: {
                    $expr: {
                        $eq: [
                            "$_id",
                            {
                                $toObjectId: id,
                            },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                password: 0,
                                updatedAt: 0,
                            },
                        },
                        {
                            $addFields: {
                                id: { $toString: "$_id" },
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    updatedAt: 0,
                },
            },
            {
                $addFields: {
                    id: { $toString: "$_id" },
                },
            },
        ]);

        return contact[0];
    };

    create = async (data: ContactData) => {
        return await db.contacts.create(data);
    };

    delete = async (id: string) => {
        return await db.contacts.deleteOne({ _id: id });
    };
}

export const contactRepo = new ContactRepo();
