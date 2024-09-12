import { DashShell } from "@/components/globals/layouts";
import { ApplicationsPage } from "@/components/poster";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Applications",
    description: "View & Manage all Applications",
};

interface PageProps {
    searchParams: {
        jId?: string;
    };
}

function Page({ searchParams }: PageProps) {
    return (
        <DashShell type="poster">
            <ApplicationsPage searchParams={searchParams} />
        </DashShell>
    );
}

export default Page;
