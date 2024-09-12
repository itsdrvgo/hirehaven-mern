import { GeneralShell } from "@/components/globals/layouts";
import { JobsPage } from "@/components/jobs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jobs",
    description: "Find and apply for jobs.",
};

interface PageProps {
    searchParams: {
        category?: string;
        name?: string;
        type?: string;
        minSalary?: string;
        maxSalary?: string;
        isFeatured?: string;
    };
}

function Page({ searchParams }: PageProps) {
    return (
        <GeneralShell>
            <JobsPage searchParams={searchParams} />
        </GeneralShell>
    );
}

export default Page;
