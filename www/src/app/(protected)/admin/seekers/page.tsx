import { SeekersPage } from "@/components/admin";
import { DashShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Seekers Table",
    description: "View & Manage all Job Seekers",
};

function Page() {
    return (
        <DashShell type="admin">
            <SeekersPage />
        </DashShell>
    );
}

export default Page;
