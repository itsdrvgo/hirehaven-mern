import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { convertValueToLabel, sanitizeContent } from "@/lib/utils";
import { ResponseJobData } from "@/lib/validation";
import { toast } from "sonner";

interface PageProps {
    job: ResponseJobData;
    mode?: "single" | "multiple";
}

export function JobInfo({ job, mode = "multiple" }: PageProps) {
    const handleJobLinkCopy = () => {
        const currentLocation =
            window.location.origin + window.location.pathname;

        navigator.clipboard.writeText(`${currentLocation}/${job?.id}`);
        toast.success("Job link copied to clipboard");
    };

    return (
        <>
            <div className="flex items-center justify-between gap-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7 border-2 border-primary">
                            <AvatarImage
                                src={job.logoUrl}
                                alt={job.companyName}
                            />
                            <AvatarFallback>
                                {job.companyName[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <p className="text-sm font-semibold">
                            {job.companyName}
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold">{job.position}</h2>

                    <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                        <Icons.mapPin className="size-4" />
                        <p className="text-sm capitalize">
                            {job.location.city + ", "}
                            {job.location.state + ", "}
                            {job.location.country} {" \u2022"}{" "}
                            {convertValueToLabel(job.locationType)}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                        <Icons.dollar className="size-4" />
                        <p className="text-sm capitalize">
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
                            /{job.salary.mode.slice(0, -2)} {" \u2022"}{" "}
                            {convertValueToLabel(job.type)}
                        </p>
                    </div>
                </div>

                {mode === "multiple" && (
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="size-10 rounded-full"
                            onClick={handleJobLinkCopy}
                        >
                            <div>
                                <Icons.link className="size-4" />
                            </div>
                        </Button>

                        <Link
                            type="button"
                            href={`/jobs/${job.id}`}
                            className="h-10 rounded-full px-8"
                        >
                            Apply
                        </Link>
                    </div>
                )}

                {mode === "single" && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleJobLinkCopy}
                        startContent={<Icons.link className="mr-px size-3" />}
                    >
                        Share
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Job Description</h2>

                <p
                    dangerouslySetInnerHTML={{
                        __html: sanitizeContent(job.description),
                    }}
                />
            </div>
        </>
    );
}
