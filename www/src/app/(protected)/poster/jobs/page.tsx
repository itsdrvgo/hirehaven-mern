import { DashShell } from "@/components/globals/layouts";
import { JobsPage } from "@/components/poster";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jobs",
    description: "View & Manage all Jobs",
};

function Page() {
    return (
        <DashShell type="poster">
            <JobsPage />
        </DashShell>
    );
}

export default Page;
