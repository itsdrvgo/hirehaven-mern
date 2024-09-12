"use client";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import Skeleton from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PAGES } from "@/config/const";
import { useApplications, useInfiniteJobs, useUser } from "@/hooks";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import { format } from "date-fns";
import { Briefcase } from "lucide-react";
import { useMemo } from "react";

export function DashboardPage({ className, ...props }: GenericProps) {
    const { user, isPending: isUserFetching } = useUser("poster");
    const { paginatedJobs, isPending: isJobsFetching } = useInfiniteJobs({
        poster: user?.id,
        status: "published",
        enabled: !!user,
    });
    const { data: paginatedApplications, isPending: isApplicationsFetching } =
        useApplications({
            enabled: !!user,
        });

    const recentJobs = useMemo(
        () =>
            paginatedJobs?.pages.flatMap((page) => page!.docs).slice(0, 3) ??
            [],
        [paginatedJobs]
    );

    const recentApplications = useMemo(
        () =>
            paginatedApplications?.pages
                .flatMap((page) => page!.docs)
                .slice(0, 3) ?? [],
        [paginatedApplications]
    );

    if (isUserFetching || isJobsFetching || isApplicationsFetching)
        return <DashboardSkeleton />;

    return (
        <div className={cn("flex-1 space-y-4", className)} {...props}>
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-3xl font-bold">Dashboard</h2>

                <Link
                    size="sm"
                    type="button"
                    variant="outline"
                    href={PAGES.FRONTEND.POSTER.JOBS.CREATE}
                >
                    <Icons.plus className="mr-2 size-4" /> Post New Job
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Jobs
                        </CardTitle>
                        <Briefcase className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {paginatedJobs?.pages[0]?.totalDocs ?? 0}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Applications
                        </CardTitle>
                        <Icons.users className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {paginatedApplications?.pages[0]?.totalDocs ?? 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Job Postings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Applications</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentJobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">
                                            {job.position}
                                        </TableCell>
                                        <TableCell>
                                            {job.applications}
                                        </TableCell>
                                        <TableCell className="hidden md:inline-block">
                                            {job.status ? "Active" : "Inactive"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Date
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentApplications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell className="font-medium">
                                            {application.applicant.firstName}{" "}
                                            {application.applicant.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {application.job.position}
                                        </TableCell>
                                        <TableCell className="hidden md:inline-block">
                                            {format(
                                                new Date(application.createdAt),
                                                "MMM dd, yyyy"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

                <Link
                    size="sm"
                    type="button"
                    variant="outline"
                    href={PAGES.FRONTEND.POSTER.JOBS.CREATE}
                >
                    <Icons.plus className="mr-2 size-4" /> Post New Job
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 w-full rounded-lg" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className={cn("h-72 w-full rounded-lg")}
                    />
                ))}
            </div>
        </div>
    );
}
