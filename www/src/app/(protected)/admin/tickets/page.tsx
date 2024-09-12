import { TicketsPage } from "@/components/admin";
import { DashShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tickets",
    description: "View & Manage all Tickets",
};

function Page() {
    return (
        <DashShell type="admin">
            <TicketsPage />
        </DashShell>
    );
}

export default Page;
