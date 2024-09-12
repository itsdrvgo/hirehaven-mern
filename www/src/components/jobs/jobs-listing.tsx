"use client";

import { useInfiniteJobs } from "@/hooks";
import { cn } from "@/lib/utils";
import { ResponseJobData } from "@/lib/validation";
import { GenericProps } from "@/types";
import { useIntersection } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import Skeleton from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { JobCard } from "./job-card";
import { JobDescCard } from "./job-desc-card";
import { JobsFilter } from "./jobs-filter";

interface PageProps extends GenericProps {
    searchParams: {
        category?: string;
        name?: string;
        type?: string;
        location?: string;
        country?: string;
        minSalary?: string;
        maxSalary?: string;
        isFeatured?: string;
    };
}

export function JobListing({ className, searchParams, ...props }: PageProps) {
    const router = useRouter();
    const pathname = usePathname();

    const {
        paginatedJobs,
        isPending: isJobsFetching,
        fetchNextPage,
        hasNextPage,
        error,
        isFetchingNextPage,
    } = useInfiniteJobs({
        status: "published",
        ...searchParams,
        ...(searchParams.isFeatured === "true"
            ? { isFeatured: searchParams.isFeatured }
            : {}),
    });

    const jobs = useMemo(
        () => paginatedJobs?.pages.flatMap((page) => page!.docs) ?? [],
        [paginatedJobs]
    );

    const [selectedJob, setSelectedJob] = useState<ResponseJobData | null>(
        null
    );

    const viewportRef = useRef<ElementRef<"div">>(null);
    const { entry, ref } = useIntersection({
        root: viewportRef.current,
        threshold: 1,
    });

    useEffect(() => {
        if (entry?.isIntersecting && paginatedJobs?.pages.length && hasNextPage)
            fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry]);

    useEffect(() => {
        if (jobs.length && selectedJob === null) setSelectedJob(jobs[0]);
    }, [jobs, selectedJob]);

    const handleToggleFeatured = () => {
        const newSearchParams: { isFeatured?: string } = {};

        if (searchParams.isFeatured) delete newSearchParams.isFeatured;
        else newSearchParams.isFeatured = "true";

        router.push(
            pathname +
                "?" +
                new URLSearchParams(newSearchParams).toString() +
                "#jobs_list"
        );
    };

    return (
        <div className={cn("space-y-8", className)} {...props}>
            <JobsFilter />

            {isJobsFetching && <JobListSkeleton />}
            {error && (
                <EmptyPlaceholder
                    title="Error"
                    description={error.message}
                    icon="construction"
                />
            )}
            {!isJobsFetching && !jobs.length && (
                <EmptyPlaceholder
                    title="No jobs found"
                    description="Try changing the filters or search query"
                    icon="warning"
                />
            )}

            {!!jobs.length && (
                <div className="relative flex w-full gap-x-6" id="jobs_list">
                    <div className="relative w-full flex-none space-y-4 overflow-hidden md:basis-2/5">
                        <div
                            className={cn(
                                "flex items-center justify-between gap-2",
                                isJobsFetching && "hidden"
                            )}
                        >
                            <h4 className="text-2xl font-semibold">
                                {searchParams.isFeatured === "true"
                                    ? "Featured Jobs"
                                    : "All Jobs"}
                            </h4>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleToggleFeatured}
                            >
                                {searchParams.isFeatured === "true"
                                    ? "Show All Jobs"
                                    : "Show Featured Jobs"}
                            </Button>
                        </div>

                        {jobs.map((job, i) => (
                            <>
                                {i === jobs.length - 1 ? (
                                    <div
                                        ref={ref}
                                        key={job.id}
                                        className="w-full"
                                    >
                                        <JobCard
                                            job={job}
                                            selectedJob={selectedJob}
                                            setSelectedJob={setSelectedJob}
                                        />
                                    </div>
                                ) : (
                                    <div key={job.id} className="w-full">
                                        <JobCard
                                            job={job}
                                            selectedJob={selectedJob}
                                            setSelectedJob={setSelectedJob}
                                        />
                                    </div>
                                )}
                            </>
                        ))}

                        <div className="flex justify-center text-center">
                            {isFetchingNextPage && (
                                <div className="py-5">
                                    <Spinner />
                                </div>
                            )}
                            {!isJobsFetching &&
                                !isFetchingNextPage &&
                                !hasNextPage && (
                                    <p className="my-4 text-sm text-muted-foreground">
                                        No more jobs to show
                                    </p>
                                )}
                        </div>
                    </div>

                    <JobDescCard jobs={jobs} selectedJob={selectedJob} />
                </div>
            )}
        </div>
    );
}

function JobListSkeleton() {
    return (
        <div className="relative flex w-full gap-x-6">
            <div className="relative w-full flex-none space-y-4 overflow-hidden md:basis-2/5">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-9 w-28 rounded-md" />
                    <Skeleton className="h-8 w-32 rounded-md" />
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="min-h-32 rounded-xl" />
                ))}
            </div>

            <div className="hidden size-full md:inline-block">
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        </div>
    );
}
