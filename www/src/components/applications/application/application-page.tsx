"use client";

import { Icons } from "@/components/icons";
import { Chip } from "@/components/ui/chip";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import { PAGES } from "@/config/const";
import { useApplication, useUser } from "@/hooks";
import {
    calculateTimeDifference,
    cn,
    convertValueToLabel,
    sanitizeContent,
} from "@/lib/utils";
import { GenericProps } from "@/types";
import { redirect } from "next/navigation";

interface PageProps extends GenericProps {
    params: {
        aId: string;
    };
}

export function ApplicationPage({ className, params, ...props }: PageProps) {
    const { aId } = params;

    const { application, isPending: isApplicationFetching } =
        useApplication(aId);
    const { user, isPending: isUserFetching } = useUser();

    if (isApplicationFetching || isUserFetching) return <ApplicationSkeleton />;
    if (!user) redirect(PAGES.FRONTEND.SIGNIN.SEEKER);

    if (!application)
        return (
            <EmptyPlaceholder
                title="Application not found"
                description="The application you are looking for does not exist, or it may have been removed."
                icon="warning"
                endContent={
                    <Link type="button" href="/applications">
                        My Applications
                    </Link>
                }
            />
        );

    return (
        <div className={cn("space-y-10", className)} {...props}>
            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="flex items-center justify-between gap-2 bg-background p-4 md:p-6 md:px-8">
                    <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold md:text-2xl">
                                {application.job.position}
                            </h2>
                            <Link
                                type="link"
                                href={`/jobs/${application.job.id}`}
                                isExternal
                            >
                                <Icons.externalLink className="size-4 text-accent" />
                            </Link>
                        </div>

                        <p className="text-sm md:text-base">
                            {application.job.companyName}
                        </p>
                    </div>

                    <Chip
                        variant="dot"
                        scheme={
                            application.status === "pending"
                                ? "primary"
                                : application.status === "reviewed"
                                  ? "warning"
                                  : application.status === "hired"
                                    ? "success"
                                    : "destructive"
                        }
                    >
                        {convertValueToLabel(application.status)}
                    </Chip>
                </div>

                <div className="grid grid-cols-2 justify-between gap-3 p-4 md:flex md:gap-5 md:p-6 md:px-8">
                    <div className="flex items-center gap-1">
                        <Icons.dollar className="size-4" />
                        <span className="text-xs capitalize md:text-sm">
                            {Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                minimumFractionDigits: Number.isInteger(
                                    Number(application.job.salary.amount)
                                )
                                    ? 0
                                    : 2,
                            })
                                .format(Number(application.job.salary.amount))
                                .slice(1)}
                            /{application.job.salary.mode.slice(0, -2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icons.mapPin className="size-4" />
                        <span className="text-xs capitalize md:text-sm">
                            {application.job.location.state},{" "}
                            {application.job.location.country}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icons.globe className="size-4" />
                        <span className="text-xs capitalize md:text-sm">
                            {convertValueToLabel(application.job.locationType)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Icons.briefcaseBusiness className="size-4" />
                        <span className="text-xs capitalize md:text-sm">
                            {convertValueToLabel(application.job.type)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-background">
                <div className="flex items-center justify-between bg-card p-4 md:p-6 md:px-8">
                    <h2 className="text-xl font-semibold">Application</h2>

                    <p className="text-sm text-muted-foreground">
                        {calculateTimeDifference(
                            application.createdAt,
                            "full"
                        ).includes("ago")
                            ? `Applied ${calculateTimeDifference(application.createdAt, "full")}`
                            : `Applied on ${calculateTimeDifference(application.createdAt, "full")}`}
                    </p>
                </div>

                <div className="space-y-6 p-4 md:p-6 md:px-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Cover Letter</h3>

                        <div className="space-y-2">
                            <h4 className="font-semibold">
                                Why do you want to work at{" "}
                                {application.job.companyName}?
                            </h4>

                            <p
                                className="text-sm text-muted-foreground md:text-base"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeContent(
                                        application.coverLetter
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resume</h3>

                        <div className="size-full overflow-hidden rounded-sm">
                            <object
                                data={user.resumeUrl}
                                type="application/pdf"
                                width="100%"
                                height="600"
                            >
                                <p>
                                    <Link type="link" href={user.resumeUrl!}>
                                        Download your resume
                                    </Link>
                                </p>
                            </object>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ApplicationSkeleton() {
    return (
        <div className="space-y-10">
            <Skeleton className="h-44 rounded-xl" />
            <Skeleton className="h-[40rem] rounded-xl" />
        </div>
    );
}
