import { PostersPage } from "@/components/admin";
import { DashShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Posters Table",
    description: "View & Manage all Job Posters",
};

function Page() {
    return (
        <DashShell type="admin">
            <PostersPage />
        </DashShell>
    );
}

export default Page;
