"use client";

import { JobManageForm } from "@/components/globals/forms";
import Skeleton from "@/components/ui/skeleton";
import { PAGES } from "@/config/const";
import { useJob, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { notFound, redirect } from "next/navigation";
import { JobManageSkeleton } from "../create";

interface PageProps extends GenericProps {
    params: {
        jId: string;
    };
}

export function JobEditPage({ className, params, ...props }: PageProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("poster");
    const { job, isPending: isJobFetching } = useJob(params.jId);

    if (isUserFetching || isJobFetching)
        return (
            <div className={cn("space-y-10", className)} {...props}>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-2/5 rounded-md" />
                    <p className="text-sm text-muted-foreground">
                        Make changes to the job details below
                    </p>
                </div>

                <JobManageSkeleton />
            </div>
        );

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.POSTER);
    if (!job) notFound();

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    Edit {job.position} at {job.companyName}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Make changes to the job details below
                </p>
            </div>

            <JobManageForm job={job} />
        </div>
    );
}
