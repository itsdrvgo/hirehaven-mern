import { ApplicationsPage } from "@/components/applications";
import { GeneralShell } from "@/components/globals/layouts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Applications",
    description: "View all your applications here",
};

function Page() {
    return (
        <GeneralShell>
            <ApplicationsPage />
        </GeneralShell>
    );
}

export default Page;
