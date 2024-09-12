"use client";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from "@/components/ui/skeleton";
import {
    useCategories,
    useContacts,
    useInfiniteJobs,
    useUser,
    useUsers,
} from "@/hooks";
import { cn, convertValueToLabel } from "@/lib/utils";
import { format } from "date-fns";

export function DashboardPage() {
    const { user, isPending: isUserFetching } = useUser("admin");

    const { data: seekersData, isPending: isSeekersFetching } = useUsers(
        "seeker",
        !!user
    );
    const { paginatedJobs: jobsData, isPending: isJobsFetching } =
        useInfiniteJobs({
            status: "published",
        });
    const { categories: categoriesData, isPending: isCategoriesFetching } =
        useCategories();
    const { data: ticketsData, isPending: isTicketsFetching } = useContacts({
        enabled: !!user,
    });

    if (
        isUserFetching ||
        isSeekersFetching ||
        isJobsFetching ||
        isCategoriesFetching ||
        isTicketsFetching
    )
        return <DashboardSkeleton />;

    return (
        <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Job Seekers
                        </CardTitle>
                        <Icons.users className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Intl.NumberFormat("en-US").format(
                                seekersData?.pages[0]?.totalDocs ?? 0
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Job Postings
                        </CardTitle>
                        <Icons.briefcase className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Intl.NumberFormat("en-US").format(
                                jobsData?.pages[0]?.totalDocs ?? 0
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Job Categories
                        </CardTitle>
                        <Icons.document className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Intl.NumberFormat("en-US").format(
                                categoriesData?.length ?? 0
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Open Tickets
                        </CardTitle>
                        <Icons.ticket className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Intl.NumberFormat("en-US").format(
                                ticketsData?.pages[0]?.totalDocs ?? 0
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Job Postings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {jobsData?.pages[0]?.docs
                                .slice(0, 3)
                                .map((job, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <Icons.building className="mr-2 size-4 text-muted-foreground" />
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {job.position}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {job.companyName} -{" "}
                                                {format(
                                                    new Date(job.createdAt),
                                                    "MMM dd, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ticketsData?.pages[0]?.docs
                                .slice(0, 3)
                                .map((ticket, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <Icons.ticket className="mr-2 size-4 text-muted-foreground" />
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {convertValueToLabel(
                                                    ticket.query
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(
                                                    new Date(ticket.createdAt),
                                                    "MMM dd, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 w-full rounded-lg" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className={cn(
                            "h-60 w-full rounded-lg",
                            index === 0 && "lg:col-span-2"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
