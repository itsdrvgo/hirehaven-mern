import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Skeleton from "@/components/ui/skeleton";
import { useJobs, useUser } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { ApplicationsTable } from "./applications-table";

interface PageProps {
    searchParams: {
        jId?: string;
    };
}

export function JobSelectCard({ searchParams }: PageProps) {
    const router = useRouter();
    const pathname = usePathname();

    const { user } = useUser("poster");
    const { jobs, isPending: isJobsFetching } = useJobs({
        poster: user?.id,
    });

    if (isJobsFetching) return <JobSelectCardSkeleton />;

    if (!jobs)
        return (
            <EmptyPlaceholder
                title="No Jobs Found"
                description="Please create a job to view applications"
                icon="warning"
            />
        );

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Jobs</CardTitle>
                    <CardDescription>
                        Select the Job to view Applications for it
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Select
                        value={searchParams.jId}
                        onValueChange={(value) =>
                            router.push(`${pathname}?jId=${value}`)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Job" />
                        </SelectTrigger>
                        <SelectContent>
                            {jobs.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.position} - {c.companyName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {searchParams.jId && <ApplicationsTable />}
        </>
    );
}

export function JobSelectCardSkeleton() {
    return <Skeleton className="h-40 w-full rounded-xl border" />;
}
