import { cn } from "@/lib/utils";
import { ResponseJobData } from "@/lib/validation";
import { GenericProps } from "@/types";
import { useMediaQuery } from "@mantine/hooks";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import { JobInfo } from "./job";

interface PageProps extends GenericProps {
    jobs: ResponseJobData[];
    selectedJob?: ResponseJobData | null;
}

export function JobDescCard({
    className,
    jobs,
    selectedJob,
    ...props
}: PageProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { scrollY } = useScroll();
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        setScrollDirection(() => {
            if (latest > previous) return "down";
            else return "up";
        });
    });

    if (isDesktop)
        return (
            <div className={cn("w-full", className)} {...props}>
                {selectedJob ? (
                    <div
                        className={cn(
                            "sticky right-0 space-y-5 overflow-auto rounded-xl border bg-card p-5 transition-all duration-450 ease-in-out",
                            scrollDirection === "up"
                                ? "top-20 h-[calc(100vh-6rem)]"
                                : "top-4 h-[calc(100vh-2rem)]"
                        )}
                    >
                        <JobInfo job={selectedJob} />
                    </div>
                ) : jobs.length ? (
                    <EmptyPlaceholder
                        title="No job selected"
                        description="Select a job to view details here"
                        icon="warning"
                    />
                ) : null}
            </div>
        );
}
