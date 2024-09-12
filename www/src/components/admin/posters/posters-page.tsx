"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import { UserTableSkeleton } from "../seekers/seekers-table";
import { PostersTable } from "./posters-table";

export function PostersPage({ className, ...props }: GenericProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("admin");

    if (isUserFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Job Posters Table</h1>
                    <p className="text-sm text-muted-foreground">
                        View & Manage all Job Posters
                    </p>
                </div>

                <UserTableSkeleton />
            </div>
        );

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.ADMIN);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Job Posters Table</h1>
                <p className="text-sm text-muted-foreground">
                    View & Manage all Job Posters
                </p>
            </div>

            <PostersTable />
        </div>
    );
}
