"use client";

import { PAGES } from "@/config/const";
import { useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";
import { JobSelectCard, JobSelectCardSkeleton } from "./job-select-card";

interface PageProps extends GenericProps {
    searchParams: {
        jId?: string;
    };
}

export function ApplicationsPage({
    className,
    searchParams,
    ...props
}: PageProps) {
    const { isSignedIn, isPending: isUserFetching } = useUser("poster");

    if (isUserFetching) return <JobSelectCardSkeleton />;

    if (!isSignedIn) redirect(PAGES.FRONTEND.SIGNIN.POSTER);

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <JobSelectCard searchParams={searchParams} />
        </div>
    );
}
