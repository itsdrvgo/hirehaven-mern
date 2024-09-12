"use client";

import { JobApply } from "@/components/globals/forms";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import { useJob, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { JobInfo } from "./job-info";

interface PageProps extends GenericProps {
    params: {
        jobId: string;
    };
}

export function JobPage({ className, params, ...props }: PageProps) {
    const { jobId } = params;

    const { job, isPending: isJobFetching } = useJob(jobId);
    const { isPending: isUserFetching } = useUser();

    if (isJobFetching || isUserFetching) return <JobSkeleton />;

    if (!job)
        return (
            <EmptyPlaceholder
                title="Job not found"
                description="The job you are looking for does not exist, or it may have been removed."
                icon="warning"
                endContent={
                    <Link type="button" href="/jobs">
                        View Jobs
                    </Link>
                }
            />
        );

    return (
        <div
            className={cn("grid grid-cols-1 gap-10 md:grid-cols-3", className)}
            {...props}
        >
            <div className="space-y-5 md:col-span-2">
                <JobInfo job={job} mode="single" />
            </div>

            <div className="h-min overflow-hidden rounded-xl border bg-card md:col-span-1">
                <p className="border-b bg-background p-4 text-center text-lg font-semibold">
                    Apply to {job.companyName}
                </p>

                <div className="p-4">
                    <JobApply job={job} />
                </div>
            </div>
        </div>
    );
}

function JobSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="space-y-5 md:col-span-2">
                <div className="flex items-center justify-between gap-5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-7 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>

                        <Skeleton className="h-8 w-60" />

                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-5 w-32" />
                    </div>

                    <Skeleton className="h-8 w-20" />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-5 w-full" />
                        ))}
                        <Skeleton className="h-5 w-1/3" />
                    </div>

                    <div className="space-y-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-5 w-full" />
                        ))}
                        <Skeleton className="h-5 w-1/2" />
                    </div>

                    <div className="space-y-2">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <Skeleton key={i} className="h-5 w-full" />
                        ))}
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                </div>
            </div>

            <Skeleton className="size-full max-h-80 rounded-xl md:col-span-1" />
        </div>
    );
}
