"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import { JobsTable, JobTableSkeleton } from "./jobs-table";

export function JobsPage({ className, ...props }: GenericProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("poster");

    if (isUserFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Jobs Table</h1>
                    <p className="text-sm text-muted-foreground">
                        View & Manage all Jobs
                    </p>
                </div>

                <JobTableSkeleton filters={3} />
            </div>
        );

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.POSTER);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Jobs Table</h1>
                <p className="text-sm text-muted-foreground">
                    View & Manage all Jobs
                </p>
            </div>

            <JobsTable />
        </div>
    );
}
