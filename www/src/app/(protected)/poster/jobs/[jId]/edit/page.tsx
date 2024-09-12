import { DashShell } from "@/components/globals/layouts";
import { JobEditPage } from "@/components/poster/jobs/edit";
import { siteConfig } from "@/config/site";
import { getJob } from "@/lib/react-query";
import { formatNumber } from "@/lib/utils";
import { Metadata } from "next";

interface PageProps {
    params: {
        jId: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        const job = await getJob(params.jId);
        if (!job)
            return {
                title: "Not Found",
                description: "No job was found.",
            };

        return {
            title:
                "$" +
                formatNumber(+job.salary.amount, 0) +
                "/" +
                job.salary.mode.slice(0, -2) +
                " - Hiring '" +
                job.position +
                "'" +
                " at " +
                job.companyName,
            description: job.description,
            keywords: [
                job.position,
                job.companyName,
                Object.values(job.location).join(","),
                job.type,
                job.locationType,
                job.salary.amount + " " + job.salary.mode,
                siteConfig.keywords?.join(",") ?? "",
            ],
        };
    } catch (err) {
        return {
            title: "Not Found",
            description: "No job was found.",
        };
    }
}

function Page({ params }: PageProps) {
    return (
        <DashShell type="poster">
            <JobEditPage params={params} />
        </DashShell>
    );
}

export default Page;
