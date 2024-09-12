import type { FilterQuery, PaginateOptions } from "mongoose";
import type {
    SignUpData,
    UpdateUserData,
    UserData,
    UserDocument,
} from "../../../interfaces/index.js";
import { db } from "../../../lib/db/index.js";
import type { UserRoles } from "../../../config/const.js";

type AggregatedUser = Omit<UserDocument, "password" | "updatedAt"> & {
    id: string;
};

class UserRepo {
    get = async (filter?: FilterQuery<UserData>) => {
        return await db.users.aggregate<AggregatedUser>([
            filter
                ? {
                      $match: filter,
                  }
                : {
                      $match: {},
                  },
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
        ]);
    };

    getInfinite = async ({
        filter = {},
        options = {
            page: 1,
            limit: 10,
        },
    }: {
        filter?: FilterQuery<UserData>;
        options: PaginateOptions;
    }) => {
        const users = db.users.aggregate<AggregatedUser>([
            {
                $match: filter,
            },
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
        ]);

        return await db.users.aggregatePaginate(users, options);
    };

    getById = async (id: string, role?: UserRoles) => {
        const user = await db.users.aggregate<
            AggregatedUser & {
                password: string;
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
                    ...(role && { role }),
                },
            },
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
        ]);

        return user[0];
    };

    getByEmail = async (email: string, role?: UserRoles) => {
        return await db.users.findOne({
            email,
            ...(role && { role }),
        });
    };

    create = async (
        data: Omit<SignUpData, "confirmPassword"> & Pick<UserData, "avatarUrl">
    ) => {
        return await db.users.create(data);
    };

    update = async (
        id: string,
        data: UpdateUserData & {
            password?: string;
            role?: UserRoles;
            isProfileCompleted?: boolean;
        }
    ) => {
        return await db.users.updateOne({ _id: id }, data);
    };

    delete = async (id: string) => {
        return await db.users.deleteOne({ _id: id });
    };
}

export const userRepo = new UserRepo();
