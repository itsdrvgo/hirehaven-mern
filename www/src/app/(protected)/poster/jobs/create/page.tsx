import { DashShell } from "@/components/globals/layouts";
import { JobCreatePage } from "@/components/poster";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Post a Job",
    description: "Post a new job to the platform",
};

function Page() {
    return (
        <DashShell type="poster">
            <JobCreatePage />
        </DashShell>
    );
}

export default Page;
