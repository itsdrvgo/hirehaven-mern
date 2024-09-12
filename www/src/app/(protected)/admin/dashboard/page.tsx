import { DashboardPage } from "@/components/admin";
import { DashShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard for the admin panel",
};

function Page() {
    return (
        <DashShell type="admin">
            <DashboardPage />
        </DashShell>
    );
}

export default Page;
