import { DashShell } from "@/components/globals/layouts";
import { DashboardPage } from "@/components/poster";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard for the poster.",
};

function Page() {
    return (
        <DashShell type="poster">
            <DashboardPage />
        </DashShell>
    );
}

export default Page;
