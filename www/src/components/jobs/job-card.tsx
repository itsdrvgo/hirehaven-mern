import { calculateTimeDifference, cn, convertValueToLabel } from "@/lib/utils";
import { ResponseJobData } from "@/lib/validation";
import { GenericProps } from "@/types";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "../icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PageProps extends GenericProps {
    job: ResponseJobData;
    selectedJob?: ResponseJobData | null;
    setSelectedJob: Dispatch<SetStateAction<ResponseJobData | null>>;
}

export function JobCard({
    className,
    job,
    selectedJob,
    setSelectedJob,
    ...props
}: PageProps) {
    const router = useRouter();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleClick = () => {
        if (isDesktop) setSelectedJob(job);
        else router.push(`/jobs/${job.id}`);
    };

    return (
        <div
            key={job.id}
            className={cn(
                "flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-transparent bg-card p-5 hover:bg-card/80",
                selectedJob?.id === job.id &&
                    "border-border/10 bg-muted/80 hover:bg-muted/60",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            <div className="flex items-center gap-5">
                <Avatar className="size-10 rounded-xl border-2 border-accent">
                    <AvatarImage src={job.logoUrl} alt={job.companyName} />
                    <AvatarFallback className="rounded-none">
                        {job.companyName[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col justify-between gap-1">
                    <h3 className="text-sm">{job.companyName}</h3>

                    <h2 className="text-lg font-semibold">{job.position}</h2>

                    <div className="flex flex-wrap items-center gap-1">
                        <Tag
                            selectedJob={selectedJob}
                            job={job}
                            className="gap-px"
                        >
                            <Icons.dollar className="size-3" />
                            <span className="capitalize">
                                {Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: Number.isInteger(
                                        Number(job.salary.amount)
                                    )
                                        ? 0
                                        : 2,
                                })
                                    .format(Number(job.salary.amount))
                                    .slice(1)}
                                /{job.salary.mode.slice(0, -2)}
                            </span>
                        </Tag>

                        <Tag selectedJob={selectedJob} job={job}>
                            <Icons.mapPin className="size-3" />
                            <span className="capitalize">
                                {job.location.state}, {job.location.country}
                            </span>
                        </Tag>

                        <Tag selectedJob={selectedJob} job={job}>
                            <Icons.globe className="size-3" />
                            {convertValueToLabel(job.locationType)}
                        </Tag>

                        <Tag selectedJob={selectedJob} job={job}>
                            <Icons.briefcaseBusiness className="size-3" />
                            {convertValueToLabel(job.type)}
                        </Tag>
                    </div>
                </div>
            </div>

            <p className="text-nowrap text-sm">
                {calculateTimeDifference(job.createdAt)}
            </p>
        </div>
    );
}

interface TagProps extends GenericProps {
    job: ResponseJobData;
    selectedJob?: ResponseJobData | null;
}

function Tag({ children, selectedJob, className, job, ...props }: TagProps) {
    return (
        <p
            className={cn(
                "flex items-center gap-1 rounded-md border bg-muted p-1 px-2 text-xs",
                selectedJob?.id === job.id && "bg-card",
                className
            )}
            {...props}
        >
            {children}
        </p>
    );
}
