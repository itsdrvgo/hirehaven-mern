"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import {
    ApplicationsTable,
    ApplicationTableSkeleon,
} from "./applications-table";

export function ApplicationsPage({ className, ...props }: GenericProps) {
    const { user, isPending: isUserFetching } = useUser("seeker");

    if (isUserFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <h1 className="text-center text-3xl font-bold">
                    My Applications
                </h1>

                <ApplicationTableSkeleon filters={3} />
            </div>
        );

    if (!user) redirect(PAGES.FRONTEND.SIGNIN.SEEKER);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <h1 className="text-center text-3xl font-bold">My Applications</h1>

            <ApplicationsTable user={user} />
        </div>
    );
}
