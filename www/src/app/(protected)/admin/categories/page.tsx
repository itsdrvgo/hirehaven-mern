import { CategoiesPage } from "@/components/admin";
import { DashShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories Table",
    description: "View & Manage all Job Categories",
};

function Page() {
    return (
        <DashShell type="admin">
            <CategoiesPage />
        </DashShell>
    );
}

export default Page;
