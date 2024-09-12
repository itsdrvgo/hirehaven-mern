"use client";

import { JobManageForm } from "@/components/globals/forms";
import Skeleton from "@/components/ui/skeleton";
import { PAGES } from "@/config/const";
import { useCategories, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";

export function JobCreatePage({ className, ...props }: GenericProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("poster");
    const { isPending: isCategoriesFetching } = useCategories();

    if (isUserFetching || isCategoriesFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Post a Job</h1>
                    <p className="text-sm text-muted-foreground">
                        Fill out the form to post a new job
                    </p>
                </div>

                <JobManageSkeleton />
            </div>
        );

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.POSTER);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Post a Job</h1>
                <p className="text-sm text-muted-foreground">
                    Fill out the form to post a new job
                </p>
            </div>

            <JobManageForm />
        </div>
    );
}

export function JobManageSkeleton() {
    return (
        <div className="space-y-5">
            <Skeleton className="h-[35rem] w-full rounded-xl" />
            <Skeleton className="h-[45rem] w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
}
